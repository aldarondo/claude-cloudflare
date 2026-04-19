# claude-cloudflare

Connects Claude Code to Cloudflare so Charles can manage DNS, tunnels, WAF, Workers, and R2 directly from any Claude Code session.

## What's Running

| Resource | Value |
|---|---|
| Domain | aldarondo.family |
| Tunnel | brian (healthy) |
| Exposed service | brian.aldarondo.family → brian-mcp memory server (port 8765) |

## Tech Stack

| Layer | Technology |
|---|---|
| MCP server | `@itunified.io/mcp-cloudflare` (~84 tools) |
| Invocation | `node` via global npm install |
| Config | `.mcp.json` (gitignored — see `.mcp.json.example`) |
| Credentials | Windows User env vars + hardcoded in `.mcp.json` |

## Setup (new machine)

### 1. Install the MCP package

```bash
npm install -g @itunified.io/mcp-cloudflare
```

### 2. Create `.mcp.json` from the example

```bash
cp .mcp.json.example .mcp.json
```

Edit `.mcp.json` and fill in:
- `CLOUDFLARE_API_TOKEN` — token with Zone/DNS Edit (aldarondo.family) + Account/Cloudflare Tunnel Edit
- `CLOUDFLARE_ACCOUNT_ID` — `353b2df4f32741e0245d4a254bf72c2a`
- Path to the globally installed package (update username in the `args` path)

### 3. Set Windows env vars (optional but recommended)

```powershell
setx CLOUDFLARE_API_TOKEN "your-token"
setx CLOUDFLARE_ACCOUNT_ID "353b2df4f32741e0245d4a254bf72c2a"
```

### 4. Restart Claude Code

The `cloudflare` MCP server will load automatically. Verify with:
```
/mcp
```

## Making the MCP Available Globally

To load the Cloudflare MCP in every project (not just this one):

```bash
claude mcp add cloudflare -s user \
  -e CLOUDFLARE_API_TOKEN="your-token" \
  -e CLOUDFLARE_ACCOUNT_ID="your-account-id" \
  -- node "C:\Users\YOUR_USERNAME\AppData\Roaming\npm\node_modules\@itunified.io\mcp-cloudflare\dist\index.js"
```

## Key Tools

| Tool | What it does |
|---|---|
| `cloudflare_dns_list/create/update/delete` | Full DNS record CRUD for aldarondo.family |
| `cloudflare_tunnel_create/delete/get/list` | Tunnel lifecycle management |
| `cloudflare_tunnel_config_get/update` | Ingress routing rules (hostname → backend) |
| `cloudflare_tunnel_token` | Get connector JWT for cloudflared |
| `cloudflare_zone_get/list` | Zone info and health |
| `cloudflare_token_verify` | Confirm API token is valid |

## Docs

- [cloudflared install guide for Docker](docs/cloudflared-install.md) — instructions for the brian-mcp agent

---
**Publisher:** Xity Software, LLC
