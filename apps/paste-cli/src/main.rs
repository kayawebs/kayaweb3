use clap::Parser;
use colored::*;
use qrcode::{render::unicode, QrCode};
use serde::{Deserialize, Serialize};
use std::fs;
use std::io::{self, Read};
use std::path::Path;
use std::process::Command;
use tempfile::NamedTempFile;

#[derive(Parser)]
#[command(name = "kaya-paste", about = "Share text and code through Kaya Tools")]
struct Cli {
    #[arg(help = "Text to share or a file path")]
    input: Option<String>,

    #[arg(
        short,
        long,
        help = "Custom share code (4-50 letters, numbers, _ or -)"
    )]
    code: Option<String>,

    #[arg(short, long, help = "Open an editor to compose content")]
    editor: bool,

    #[arg(
        long,
        default_value = "https://api.kayaweb3.xyz/v1",
        help = "Kaya API base URL"
    )]
    api: String,

    #[arg(long, default_value_t = 24, help = "Expiry in hours (1-168)")]
    expires_in: u16,

    #[arg(long, help = "Do not show a terminal QR code")]
    no_qr: bool,
}

#[derive(Serialize)]
struct CreatePasteRequest {
    content: String,
    #[serde(skip_serializing_if = "Option::is_none", rename = "customCode")]
    custom_code: Option<String>,
    #[serde(rename = "expiresInHours")]
    expires_in_hours: u16,
}

#[derive(Deserialize)]
struct CreatePasteResponse {
    code: String,
    url: String,
}

#[derive(Deserialize)]
struct ErrorResponse {
    error: String,
}

fn open_editor() -> Result<String, Box<dyn std::error::Error>> {
    let mut file = NamedTempFile::new()?;
    let editor = std::env::var("VISUAL")
        .or_else(|_| std::env::var("EDITOR"))
        .unwrap_or_else(|_| "nano".to_string());
    let status = Command::new(editor).arg(file.path()).status()?;
    if !status.success() {
        return Err("Editor exited with a non-zero status".into());
    }
    let mut content = String::new();
    file.read_to_string(&mut content)?;
    Ok(content)
}

fn read_content(cli: &Cli) -> Result<String, Box<dyn std::error::Error>> {
    if cli.editor {
        return open_editor();
    }
    if let Some(input) = &cli.input {
        let path = Path::new(input);
        return if path.is_file() {
            Ok(fs::read_to_string(path)?)
        } else {
            Ok(input.clone())
        };
    }
    if atty::is(atty::Stream::Stdin) {
        return open_editor();
    }
    let mut content = String::new();
    io::stdin().read_to_string(&mut content)?;
    Ok(content)
}

fn main() {
    let cli = Cli::parse();
    if !(1..=168).contains(&cli.expires_in) {
        eprintln!(
            "{} Expiry must be from 1 to 168 hours.",
            "Error:".red().bold()
        );
        std::process::exit(1);
    }

    let content = match read_content(&cli) {
        Ok(content) if !content.trim().is_empty() => content,
        Ok(_) => {
            eprintln!("{} No content to share.", "Error:".red().bold());
            std::process::exit(1);
        }
        Err(error) => {
            eprintln!("{} {}", "Error:".red().bold(), error);
            std::process::exit(1);
        }
    };

    let endpoint = format!("{}/pastes", cli.api.trim_end_matches('/'));
    let request = CreatePasteRequest {
        content,
        custom_code: cli.code,
        expires_in_hours: cli.expires_in,
    };
    let response = reqwest::blocking::Client::new()
        .post(endpoint)
        .json(&request)
        .send();

    match response {
        Ok(response) if response.status().is_success() => {
            match response.json::<CreatePasteResponse>() {
                Ok(paste) => {
                    println!("{} {}", "Created:".green().bold(), paste.url.bright_blue());
                    println!("{} {}", "Code:".bold(), paste.code.bright_yellow());
                    if !cli.no_qr {
                        if let Ok(qr) = QrCode::new(paste.url) {
                            println!("\n{}", qr.render::<unicode::Dense1x2>().build());
                        }
                    }
                }
                Err(error) => eprintln!("{} {}", "Error:".red().bold(), error),
            }
        }
        Ok(response) => {
            let message = response
                .json::<ErrorResponse>()
                .map(|body| body.error)
                .unwrap_or_else(|_| "Request failed.".to_string());
            eprintln!("{} {}", "Error:".red().bold(), message);
            std::process::exit(1);
        }
        Err(error) => {
            eprintln!("{} {}", "Error:".red().bold(), error);
            std::process::exit(1);
        }
    }
}
