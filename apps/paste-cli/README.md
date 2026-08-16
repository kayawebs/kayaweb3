# Kaya Paste CLI

Share a file, direct text, editor content, or stdin through the Kaya paste API.

```bash
cargo install --path .
kaya-paste notes.txt
echo "hello" | kp --expires-in 1
kp --code release-notes --editor
```

The default service is `https://api.kayaweb3.xyz/v1`. Use `--api` to target a local deployment while developing.
