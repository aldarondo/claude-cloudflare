# claude-cloudflare Roadmap
> Tag key: `[Code]` = Claude Code · `[Cowork]` = Claude Cowork · `[Human]` = Charles must act

## 🎯 Current Milestone
Able to manage Cloudflare from Claude for the brian-mcp tunnel use case (aldarondo.family DNS + tunnel).

## 🔄 In Progress
<!-- nothing in progress -->

## 🔲 Backlog
<!-- nothing pending -->

## ✅ Completed
- [x] `[Code]` Tunnel "brian" created, ingress configured (brian.aldarondo.family → mcp-memory:8765), CNAME live, tunnel healthy (2026-04-19)
- [x] `[Code]` Tool coverage documented — MCP covers full tunnel+DNS lifecycle; only gap is cloudflared install (Bash) (2026-04-19)
- [x] `[Code]` MCP verified live — token active, DNS reads aldarondo.family, tunnel API connected (2026-04-19)
- [x] `[Human]` Token created, Windows env vars set, NS delegated — aldarondo.family zone active (2026-04-18)
- [x] `[Code]` Chose @itunified.io/mcp-cloudflare, created .mcp.json, updated CLAUDE.md (2026-04-18)
- [x] `[Code]` Evaluate MCP servers — chose `@itunified.io/mcp-cloudflare` over official (2026-04-18)

## 🚫 Blocked
<!-- log blockers here -->
