# claude-cloudflare Roadmap
> Tag key: `[Code]` = Claude Code · `[Cowork]` = Claude Cowork · `[Human]` = Charles must act

## 🎯 Current Milestone
Able to manage Cloudflare from Claude for the brian-mcp tunnel use case (aldarondo.us DNS + tunnel).

## 🔄 In Progress
- [ ] `[Human]` Point aldarondo.family NS to Cloudflare (`alice.ns.cloudflare.com`, `cameron.ns.cloudflare.com`) at Squarespace — zone is currently `pending`
- [ ] `[Code]` Connect MCP to Claude Code and verify tunnel/DNS tools work against aldarondo.family

## 🔲 Backlog
- [ ] `[Code]` Document which tools cover the brian-mcp use case; note any gaps; scope custom skill work if needed

## ✅ Completed
- [x] `[Code]` Evaluate MCP servers — chose `@itunified.io/mcp-cloudflare`; created `.mcp.json` config (2026-04-18)

## 🚫 Blocked
- `[Human]` Token created, env vars set, .mcp.json configured — waiting on NS delegation at Squarespace before zone goes active.
