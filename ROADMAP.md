# claude-cloudflare Roadmap
> Tag key: `[Code]` = Claude Code · `[Cowork]` = Claude Cowork · `[Human]` = Charles must act

## 🎯 Current Milestone
Able to manage Cloudflare from Claude for the brian-mcp tunnel use case (aldarondo.family DNS + tunnel).

**Acceptance criteria — all met (2026-04-22):**
- ✅ DNS CRUD verified: A/CNAME/TXT records can be created, read, updated, and deleted via MCP
- ✅ Tunnel lifecycle verified: tunnel can be created, token fetched, ingress configured, and deleted via MCP
- ✅ `brian` tunnel is healthy and `brian.aldarondo.family` resolves to the mcp-memory service
- ✅ `create-access-service-token.mjs` script is tested (unit + integration) and documented
- ✅ No secrets in version control; `.mcp.json` is gitignored on all machines

## 🔄 In Progress
<!-- nothing in progress -->

## 🔲 Backlog

### Synology NAS integration
- [x] `[Human]` cloudflared installed on NAS (2026-04-22)
- [x] `[Code]` `nas-ssh` tunnel created, healthy, `nas-ssh.aldarondo.family` CNAME live (2026-04-20)
- [x] `[Code]` Access app "NAS SSH" created with Service Token policy for GitHub Actions (2026-04-21)
- [x] `[Human]` DSM panel — decided not to expose externally (2026-04-22)
- [x] `[Human]` NAS SSH bypass policy — intentional; SSH key auth is the security layer, bypass is correct (2026-04-22)
- [x] `[Human]` WAF rules — not applicable; tunnel architecture guarantees origin protection without WAF (2026-04-22)

## ✅ Completed
- [x] `[Code]` Added `scripts/create-access-service-token.mjs` — creates Cloudflare Access Service Tokens and pipes credentials to GitHub Actions secrets via `gh secret set` (2026-04-21)
- [x] `[Code]` Tunnel "brian" created, ingress configured (brian.aldarondo.family → mcp-memory:8765), CNAME live, tunnel healthy (2026-04-19)
- [x] `[Code]` Tool coverage documented — MCP covers full tunnel+DNS lifecycle; only gap is cloudflared install (Bash) (2026-04-19)
- [x] `[Code]` MCP verified live — token active, DNS reads aldarondo.family, tunnel API connected (2026-04-19)
- [x] `[Human]` Token created, Windows env vars set, NS delegated — aldarondo.family zone active (2026-04-18)
- [x] `[Code]` Chose @itunified.io/mcp-cloudflare, created .mcp.json, updated CLAUDE.md (2026-04-18)
- [x] `[Code]` Evaluate MCP servers — chose `@itunified.io/mcp-cloudflare` over official (2026-04-18)

## 🚫 Blocked
<!-- log blockers here -->
