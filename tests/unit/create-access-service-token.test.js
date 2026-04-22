import { jest } from "@jest/globals";

// Mock child_process before importing the module
jest.unstable_mockModule("child_process", () => ({
  execSync: jest.fn(),
}));

const { parseArgs, createServiceToken, setGitHubSecret } = await import(
  "../../scripts/create-access-service-token.mjs"
);
const { execSync } = await import("child_process");

describe("parseArgs", () => {
  test("parses named flags", () => {
    const result = parseArgs(["--name", "my-token", "--gh-repo", "org/repo"]);
    expect(result).toEqual({ name: "my-token", "gh-repo": "org/repo" });
  });

  test("parses single flag", () => {
    expect(parseArgs(["--name", "tok"])).toEqual({ name: "tok" });
  });

  test("returns empty object for no args", () => {
    expect(parseArgs([])).toEqual({});
  });

  test("throws when flag has no value", () => {
    expect(() => parseArgs(["--name"])).toThrow("Flag --name requires a value");
  });

  test("throws when flag is immediately followed by another flag", () => {
    expect(() => parseArgs(["--name", "--other"])).toThrow(
      "Flag --name requires a value"
    );
  });
});

describe("createServiceToken", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    delete global.fetch;
  });

  test("returns token fields on success", async () => {
    global.fetch.mockResolvedValue({
      json: async () => ({
        success: true,
        result: {
          client_id: "id-123",
          client_secret: "secret-abc",
          name: "my-token",
          id: "tok-456",
        },
      }),
    });

    const result = await createServiceToken("acct-id", "api-token", "my-token");
    expect(result).toEqual({
      id: "id-123",
      secret: "secret-abc",
      name: "my-token",
      tokenId: "tok-456",
    });
  });

  test("throws on API error response", async () => {
    global.fetch.mockResolvedValue({
      json: async () => ({
        success: false,
        errors: [{ code: 1000, message: "Invalid token" }],
      }),
    });

    await expect(
      createServiceToken("acct-id", "bad-token", "my-token")
    ).rejects.toThrow("Cloudflare API error");
  });

  test("sends correct request shape", async () => {
    global.fetch.mockResolvedValue({
      json: async () => ({
        success: true,
        result: {
          client_id: "x",
          client_secret: "y",
          name: "n",
          id: "z",
        },
      }),
    });

    await createServiceToken("acct-id", "api-token", "my-token");

    const [url, opts] = global.fetch.mock.calls[0];
    expect(url).toContain("/accounts/acct-id/access/service_tokens");
    expect(opts.method).toBe("POST");
    expect(opts.headers["Authorization"]).toBe("Bearer api-token");
    expect(JSON.parse(opts.body)).toEqual({ name: "my-token" });
  });
});

describe("setGitHubSecret", () => {
  beforeEach(() => {
    execSync.mockReset();
  });

  test("calls gh CLI with correct args", () => {
    setGitHubSecret("org/repo", "MY_SECRET", "secret-value");
    expect(execSync).toHaveBeenCalledWith(
      expect.stringContaining("gh secret set MY_SECRET --repo org/repo"),
      expect.any(Object)
    );
  });

  test("throws descriptive error when gh CLI fails", () => {
    execSync.mockImplementation(() => {
      throw new Error("command not found: gh");
    });

    expect(() => setGitHubSecret("org/repo", "MY_SECRET", "val")).toThrow(
      "Failed to set GitHub secret MY_SECRET on org/repo"
    );
  });
});
