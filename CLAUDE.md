# claude-cloudflare

## What This Project Is
Connects Claude Code to the Cloudflare account so Charles can manage DNS, tunnels, WAF, Workers, and R2 directly from Claude — starting with the brian-mcp tunnel use case (aldarondo.us).

## Tech Stack
Not yet determined — evaluating `@cloudflare/mcp-server-cloudflare` (official) vs `@itunified.io/mcp-cloudflare` (community, 75 tools) before committing to a stack.

## Key Decisions
- No custom code until MCP evaluation is complete — use upstream as-is if it covers the tunnel use case
- Scope the Cloudflare API token to minimum required permissions for the chosen MCP

## Session Startup Checklist
1. Check which MCP server is configured in Claude Code settings
2. Verify Cloudflare API token is set in the MCP config
3. Run a quick DNS lookup or tunnel status check to confirm connectivity

## Key Commands
```bash
# Run tests (once custom code exists)
npm test
```

## Testing Requirements (mandatory)
- Every feature or bug fix must include unit tests covering the core logic
- Every user-facing flow must have at least one integration test
- Tests live in `tests/unit/` and `tests/integration/`
- Run all tests before marking any task complete: `npm test`

## Git Rules
- Never create pull requests. Push directly to main.
- solo/auto-push OK

@~/Documents/GitHub/CLAUDE.md
