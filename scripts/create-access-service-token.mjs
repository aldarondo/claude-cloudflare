#!/usr/bin/env node
/**
 * Creates a Cloudflare Access Service Token and optionally sets the resulting
 * client ID and secret as GitHub Actions secrets.
 *
 * Usage:
 *   node scripts/create-access-service-token.mjs \
 *     --name github-actions-nas-deploy \
 *     --gh-repo aldarondo/enphase-juicebox-coordinator \
 *     --id-secret CF_ACCESS_CLIENT_ID \
 *     --secret-secret CF_ACCESS_CLIENT_SECRET
 *
 * Required env vars (or set in .mcp.json / Windows env):
 *   CLOUDFLARE_API_TOKEN
 *   CLOUDFLARE_ACCOUNT_ID
 */

import { execSync } from "child_process";
import { fileURLToPath } from "url";

const CLOUDFLARE_API = "https://api.cloudflare.com/client/v4";

function usage() {
  console.error(`
Usage:
  node scripts/create-access-service-token.mjs \\
    --name <token-name> \\
    [--gh-repo <owner/repo>] \\
    [--id-secret <github-secret-name>]     (default: CF_ACCESS_CLIENT_ID) \\
    [--secret-secret <github-secret-name>] (default: CF_ACCESS_CLIENT_SECRET)

If --gh-repo is omitted, credentials are printed to stdout only.
`);
  process.exit(1);
}

export function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith("--")) {
      const key = argv[i].slice(2);
      const value = argv[i + 1];
      if (value === undefined || value.startsWith("--")) {
        throw new Error(`Flag --${key} requires a value`);
      }
      args[key] = value;
      i++;
    }
  }
  return args;
}

export async function createServiceToken(accountId, apiToken, name) {
  const res = await fetch(
    `${CLOUDFLARE_API}/accounts/${accountId}/access/service_tokens`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    }
  );
  const data = await res.json();
  if (!data.success) {
    throw new Error(
      `Cloudflare API error: ${JSON.stringify(data.errors ?? data)}`
    );
  }
  return {
    id: data.result.client_id,
    secret: data.result.client_secret,
    name: data.result.name,
    tokenId: data.result.id,
  };
}

export function setGitHubSecret(repo, secretName, secretValue) {
  try {
    execSync(
      `gh secret set ${secretName} --repo ${repo} --body "${secretValue}"`,
      { stdio: "inherit" }
    );
  } catch (err) {
    throw new Error(
      `Failed to set GitHub secret ${secretName} on ${repo}: ${err.message}`
    );
  }
}

async function main() {
  let args;
  try {
    args = parseArgs(process.argv.slice(2));
  } catch (err) {
    console.error(`Error: ${err.message}`);
    usage();
  }

  const tokenName = args["name"];
  if (!tokenName) {
    console.error("Error: --name is required");
    usage();
  }

  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;

  if (!apiToken || !accountId) {
    console.error(
      "Error: CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID must be set in env"
    );
    process.exit(1);
  }

  console.log(`Creating Cloudflare Access Service Token: "${tokenName}"...`);
  const token = await createServiceToken(accountId, apiToken, tokenName);

  console.log(`\nService token created:`);
  console.log(`  Name:      ${token.name}`);
  console.log(`  Token ID:  ${token.tokenId}`);
  console.log(`  Client ID: ${token.id}`);
  console.log(`  Secret:    ${token.secret}`);
  console.log(`\n⚠  The secret is shown only once — save it now.`);

  const repo = args["gh-repo"];
  if (repo) {
    const idSecret = args["id-secret"] ?? "CF_ACCESS_CLIENT_ID";
    const secretSecret = args["secret-secret"] ?? "CF_ACCESS_CLIENT_SECRET";

    console.log(`\nSetting GitHub secrets on ${repo}...`);
    setGitHubSecret(repo, idSecret, token.id);
    console.log(`  ✓ ${idSecret}`);
    setGitHubSecret(repo, secretSecret, token.secret);
    console.log(`  ✓ ${secretSecret}`);
    console.log(`\nDone. Secrets are live on ${repo}.`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(err.message ?? err);
    process.exit(1);
  });
}
