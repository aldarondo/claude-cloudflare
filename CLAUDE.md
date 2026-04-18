# claude-cloudflare

## Project Purpose
Evaluate and configure Cloudflare MCP servers for Claude Code; build custom skills only for gaps not covered by upstream solutions.

## Key Commands
```bash
# Install community MCP (75 tools: DNS, Tunnels, WAF, Workers, R2, Zero Trust)
npm install -g @itunified.io/mcp-cloudflare

# Run tests
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
