# Install cloudflared on the brian-mcp Host

## Why This Is Needed

brian-mcp is a locally-running service that needs to be securely reachable from the internet without opening firewall ports or exposing a public IP. The solution is a Cloudflare Tunnel — a persistent outbound connection from the host machine to Cloudflare's edge network. Traffic to `brian-mcp.aldarondo.family` hits Cloudflare, travels through the tunnel, and arrives at the local service.

`cloudflared` is the daemon that creates and maintains that tunnel connection. It must be installed and running on the same machine as brian-mcp.

## What You Need Before Starting

A tunnel token (a long JWT string) — Charles will provide this. It authenticates `cloudflared` to the correct tunnel. Do not proceed without it.

## Install cloudflared

Follow the official Cloudflare instructions for your OS:
https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/

Quick paths by platform:

**Linux (Debian/Ubuntu)**
```bash
curl -L https://pkg.cloudflare.com/cloudflare-main.gpg | sudo gpg --dearmor -o /usr/share/keyrings/cloudflare-main.gpg
echo "deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/cloudflared $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/cloudflared.list
sudo apt update && sudo apt install cloudflared
```

**Linux (RPM/Fedora/RHEL)**
```bash
curl -L https://pkg.cloudflare.com/cloudflare-main.repo | sudo tee /etc/yum.repos.d/cloudflared.repo
sudo yum install cloudflared
```

**macOS**
```bash
brew install cloudflared
```

**Windows**
Download the installer from: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/

## Run as a Service

Replace `TOKEN` with the value Charles provides.

```bash
sudo cloudflared service install TOKEN
sudo systemctl enable cloudflared
sudo systemctl start cloudflared
```

This registers `cloudflared` as a system service that starts automatically on boot.

## Verify

```bash
sudo systemctl status cloudflared
```

You should see `active (running)`. The tunnel will show as healthy in the Cloudflare dashboard within a few seconds.

Report back to Charles once the service is running — he will verify connectivity from the Cloudflare side and confirm the DNS record is live.

## Troubleshooting

**Service shows `failed` or `inactive` in systemctl status**
Check logs: `sudo journalctl -u cloudflared -n 50`
Common causes: invalid token (re-run `sudo cloudflared service install NEW_TOKEN`), or `cloudflared` binary not in PATH.

**Tunnel shows "unhealthy" in Cloudflare dashboard**
The connector is not reaching Cloudflare. Verify the machine has outbound internet on port 7844 (UDP) and 443 (TCP). Try: `curl -I https://cloudflare.com` to confirm basic connectivity.

**`brian.aldarondo.family` times out or returns NXDOMAIN**
DNS CNAME may not be live yet. Give it 1–2 minutes after the tunnel goes healthy, then: `nslookup brian.aldarondo.family 1.1.1.1`

**Port conflict — local service not reachable**
If the ingress route points to `localhost:8765` but mcp-memory is on a different port, Charles needs to update the ingress config on the Cloudflare side (via MCP or dashboard). No local config file change is needed.

**Token invalid error in logs**
The tunnel token is a one-time credential tied to the specific tunnel. If the tunnel was deleted and recreated, get a new token via `cloudflare_tunnel_token` MCP tool and reinstall the service.

## Notes

- `cloudflared` makes outbound connections only — no inbound ports need to be opened
- The token is a credential — do not log it or commit it to version control
- The ingress rule routing traffic to brian-mcp's local port is managed on the Cloudflare side; no local config file is needed when using a token-based install
