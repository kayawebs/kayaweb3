import Link from "next/link";
import { getAllPosts, type BlogMeta } from "@/lib/blog";

const projects = [
	{
		name: "Net Transfer",
		type: "Open Source",
		description: "A simple LAN file transfer tool for zero-config local sharing.",
		tech: ["TypeScript", "Node.js", "CLI"],
		link: "https://github.com/kayawebs/net-transfer",
	},
	{
		name: "EasyPaste",
		type: "Website",
		description: "A minimal paste-and-share site for quick text or snippets.",
		tech: ["Web"],
		link: "https://easypaste.xyz/",
	},
	{
		name: "Gamely",
		type: "Website",
		description: "A small collection of web mini-games.",
		tech: ["Web"],
		link: "https://gamely.top/",
	},
];

export default function Home() {
	const allPosts = getAllPosts();
	const grouped: Record<string, BlogMeta[]> = allPosts.reduce((acc, p) => {
		(acc[p.category] ||= []).push(p);
		return acc;
	}, {} as Record<string, BlogMeta[]>);

	const categories = Object.entries(grouped).map(([id, posts]) => ({
		id,
		title: id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
		description: `Posts about ${id.replace(/-/g, " ")}`,
		posts,
	}));

	return (
		<div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans">
			<main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-10 px-6 pb-16 pt-12 sm:px-10 sm:pt-16">
				{/* 顶部：品牌 / Logo + 简要标题 */}
				<header className="flex items-center justify-between gap-6 border-b border-[var(--terminal-border)] pb-6">
					<div className="flex items-center gap-3">
						<div className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)] text-sm font-mono terminal-accent">
							{"$>"}
						</div>
						<div className="space-y-1">
							<h1 className="text-lg font-semibold tracking-tight">Kaya</h1>
							<p className="text-xs text-[var(--terminal-muted)]">Building Web3 apps, terminal-style UIs, and developer tools.</p>
						</div>
					</div>
					<div className="hidden items-center gap-4 text-xs text-[var(--terminal-muted)] sm:flex font-mono">
						<span className="h-2 w-2 rounded-full bg-green-500" />
						<span>STATUS: AVAILABLE FOR COLLAB</span>
					</div>
				</header>

				{/* Section 1: 个人简介 */}
				<section className="terminal-panel">
					<div className="mb-4 flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
						<span className="terminal-accent">~/about</span>
						<span>cat profile.txt</span>
					</div>
					<div className="space-y-3">
						<h2 className="text-xl font-semibold tracking-tight">About Me</h2>
						<p className="text-sm leading-relaxed text-[var(--foreground)]/90">
							I am a Frontend / Full-stack Engineer focusing on Web3 application development, performance optimization, and engineering practices. My goal is to improve developer efficiency and experience by building high-quality open-source tools and products.
						</p>
						<p className="text-sm leading-relaxed text-[var(--foreground)]/90">
							Currently, I’m focusing on on-chain data analysis (deriving analytics and insights from public blockchains), and I’m open to remote work opportunities.
						</p>
					</div>
				</section>

				{/* Section 2: 博客分类折叠列表（强化层级关系） */}
				<section className="terminal-panel">
					<div className="mb-4 flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
						<span className="terminal-accent">~/blog</span>
						<span>ls</span>
					</div>
					<div className="space-y-4">
						<h2 className="text-xl font-semibold tracking-tight">Blog Categories</h2>
						<p className="text-xs text-[var(--terminal-muted)]">
							Below are blog categories grouped by topic, with corresponding article lists.
						</p>
						{categories.map((category, index) => (
							<details
								key={category.id}
								className="group rounded-lg border border-[var(--terminal-border)] bg-transparent"
								open
							>
								<summary className="flex cursor-pointer items-center justify-between gap-4 rounded-lg bg-[var(--terminal-panel-bg)]/60 px-4 py-3 text-sm transition-colors hover:bg-[var(--terminal-panel-bg)]">
									<div className="flex items-baseline gap-3">
										<span className="text-xs font-mono terminal-accent">
											{String(index + 1).padStart(2, "0")}.
										</span>
										<div>
											<h3 className="text-base font-semibold">{category.title}</h3>
											<p className="mt-1 text-xs text-[var(--terminal-muted)]">
												{category.description}
											</p>
										</div>
									</div>
									<div className="flex items-center gap-3 text-xs font-mono text-[var(--terminal-muted)]">
										<span>{category.posts.length} posts</span>
										<span className="terminal-accent transition-transform group-open:rotate-90">
											›
										</span>
									</div>
								</summary>
								<div className="border-t border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 px-4 py-2">
                                <ul className="space-y-1 pl-3 sm:pl-4">
                                  {category.posts.map((post, idx) => (
                                    <li
                                      key={`${post.category}-${post.slug}`}
                                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 sm:gap-4 rounded-md px-2 py-2 text-sm hover:bg-[var(--terminal-panel-bg)]"
                                    >
                                      <Link
                                        href={`/blog/${post.category}/${post.slug}`}
                                        className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3"
                                      >
                                        <span className="shrink-0 text-xs font-mono text-[var(--terminal-muted)]">
                                          {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                                        </span>
                                        <div className="flex min-w-0 flex-col">
                                          <span className="break-words font-medium text-[var(--foreground)]">
                                            {post.title}
                                          </span>
                                          <span className="mt-0.5 truncate text-[11px] font-mono text-[var(--terminal-muted)]">
                                            /{post.category}/{post.slug}
                                          </span>
                                        </div>
                                      </Link>
                                      <span className="hidden text-xs font-mono text-[var(--terminal-muted)] sm:inline">
                                        {post.date}
                                      </span>
                                      <span className="sm:hidden text-[11px] font-mono text-[var(--terminal-muted)]">
                                        {post.date}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
								</div>
							</details>
						))}
					</div>
				</section>

				{/* Section 3: 开源项目与产品区块 */}
				<section className="terminal-panel">
					<div className="mb-4 flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
						<span className="terminal-accent">~/projects</span>
						<span>ls</span>
					</div>
					<div className="space-y-3">
						<h2 className="text-xl font-semibold tracking-tight">Open Source & Products</h2>
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							{projects.map((project) => (
								<div
									key={project.name}
									className="flex flex-col rounded-md border border-[var(--terminal-border)] p-4 transition-colors hover:bg-[var(--terminal-panel-bg)]"
								>
									<h3 className="text-lg font-semibold">{project.name}</h3>
									<p className="text-sm text-[var(--terminal-muted)]">{project.type}</p>
									<p className="mt-2 text-sm leading-relaxed text-[var(--foreground)]/90">
										{project.description}
									</p>
									<div className="mt-2 flex flex-wrap gap-2">
										{project.tech.map((tech) => (
											<span
												key={tech}
												className="rounded-full bg-[var(--terminal-panel-bg)] px-3 py-1 text-xs font-mono text-[var(--foreground)]"
											>
												{tech}
											</span>
										))}
									</div>
									<a
										href={project.link}
										target="_blank"
										rel="noopener noreferrer"
										className="mt-4 inline-block rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
									>
										View Project
									</a>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* 底部：联系信息 */}
				<footer className="border-t border-[var(--terminal-border)] pt-6 text-center text-xs text-[var(--terminal-muted)]">
					<p>© 2025 Kaya. All rights reserved.</p>
					<p>
						Interested in collaboration or chat? Feel free to contact me via{" "}
						<a
							href="mailto:kayaweb3@gmail.com"
							className="text-[var(--foreground)] underline"
						>
							kayaweb3@gmail.com
						</a>
						.
					</p>
				</footer>
			</main>
		</div>
	);
}
