import { jest } from "@jest/globals";

// Integration test: verifies the full token-creation → secret-setting flow
// with a mocked Cloudflare API and mocked gh CLI.

jest.unstable_mockModule("child_process", () => ({
  execSync: jest.fn(),
}));

const { createServiceToken, setGitHubSecret } = await import(
  "../../scripts/create-access-service-token.mjs"
);
const { execSync } = await import("child_process");

const MOCK_CLOUDFLARE_RESPONSE = {
  success: true,
  result: {
    client_id: "integration-client-id",
    client_secret: "integration-client-secret",
    name: "test-token",
    id: "integration-token-id",
  },
};

describe("create-token → set-github-secrets flow", () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => MOCK_CLOUDFLARE_RESPONSE,
    });
    execSync.mockReset();
  });

  afterEach(() => {
    delete global.fetch;
  });

  test("creates token and sets both GitHub secrets", async () => {
    const token = await createServiceToken(
      "test-account-id",
      "test-api-token",
      "test-token"
    );

    setGitHubSecret("org/repo", "CF_ACCESS_CLIENT_ID", token.id);
    setGitHubSecret("org/repo", "CF_ACCESS_CLIENT_SECRET", token.secret);

    expect(token.id).toBe("integration-client-id");
    expect(token.secret).toBe("integration-client-secret");
    expect(execSync).toHaveBeenCalledTimes(2);

    const [call1, call2] = execSync.mock.calls;
    expect(call1[0]).toContain("CF_ACCESS_CLIENT_ID");
    expect(call1[0]).toContain("integration-client-id");
    expect(call2[0]).toContain("CF_ACCESS_CLIENT_SECRET");
    expect(call2[0]).toContain("integration-client-secret");
  });

  test("propagates Cloudflare API failure before touching GitHub", async () => {
    global.fetch.mockResolvedValue({
      json: async () => ({ success: false, errors: [{ message: "Unauthorized" }] }),
    });

    await expect(
      createServiceToken("acct", "bad-token", "test-token")
    ).rejects.toThrow("Cloudflare API error");

    expect(execSync).not.toHaveBeenCalled();
  });

  test("propagates gh CLI failure with a clear message", async () => {
    const token = await createServiceToken("acct", "tok", "test-token");
    execSync.mockImplementation(() => {
      throw new Error("gh: not logged in");
    });

    expect(() =>
      setGitHubSecret("org/repo", "CF_ACCESS_CLIENT_ID", token.id)
    ).toThrow("Failed to set GitHub secret CF_ACCESS_CLIENT_ID on org/repo");
  });
});
