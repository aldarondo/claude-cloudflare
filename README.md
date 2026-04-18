# claude-cloudflare

Skill support for managing Cloudflare configuration from Claude Code — evaluates existing MCP servers and fills gaps with custom skills.

## Features
- Evaluate and configure official/community Cloudflare MCP servers for Claude Code
- DNS, Tunnel, WAF, Workers, R2 management via AI assistant
- Custom skill layer for workflows not covered by upstream MCPs
- Documented setup for the Aldarondo family infrastructure (brian-mcp tunnel, aldarondo.us)

## Tech Stack
| Layer | Technology |
|---|---|
| MCP (official) | @cloudflare/mcp-server-cloudflare |
| MCP (community) | @itunified.io/mcp-cloudflare |
| CLI | wrangler |
| Custom skills | Claude Code skill files (bash/markdown) |

## Getting Started

```bash
# Install community MCP server
npm install -g @itunified.io/mcp-cloudflare

# Or use the official Cloudflare remote MCP
# Configure in Claude Code settings: https://*.mcp.cloudflare.com

# Run tests (once custom code exists)
npm test
```

## Project Status
Early development. See [ROADMAP.md](ROADMAP.md) for what's planned.

---
**Publisher:** Xity Software, LLC
