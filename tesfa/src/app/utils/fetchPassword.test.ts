import { post } from "./fetchPassword";
describe("post()", () => {
  const API_BASE = "https://api.example.com";
  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_URL = API_BASE;
    global.fetch = jest.fn(); 
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  it("should POST data and return JSON on success", async () => {
    const mockData = { success: true };
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });
    const result = await post("/login", { username: "meron" });
    expect(fetch).toHaveBeenCalledWith(
      `${API_BASE}/login`,
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "meron" }),
      })
    );
    expect(result).toEqual(mockData);
  });
  it("should throw error with server message on failure", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      text: async () => JSON.stringify({ message: "Invalid credentials" }),
    });
    await expect(post("/login", { username: "bad" }))
      .rejects.toThrow("Invalid credentials");
  });
  it("should throw if NEXT_PUBLIC_API_URL is not set", async () => {
    delete process.env.NEXT_PUBLIC_API_URL;
    await expect(post("/anything", {}))
      .rejects.toThrow("NEXT_PUBLIC_API_URL is not defined");
  });
});





