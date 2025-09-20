
import { renderHook, act } from "@testing-library/react";
import { usePasswordReset } from "./usePasswordReset";
import { post } from "../utils/fetchPassword";

jest.mock("../utils/fetchPassword", () => ({
  post: jest.fn(),
}));

describe("usePasswordReset", () => {
  const mockPost = post as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should request password reset successfully", async () => {
 
    const mockResponse = { message: "Email sent successfully." };
    mockPost.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => usePasswordReset());

    await act(async () => {
      await result.current.requestReset("user@example.com");
    });

 
    expect(mockPost).toHaveBeenCalledWith("/password-reset/", {
      email: "user@example.com",
    });
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.message).toBe("Email sent successfully.");
  });

  it("should handle error gracefully", async () => {
 
    const mockError = new Error("Network failure");
    mockPost.mockRejectedValue(mockError);

    const { result } = renderHook(() => usePasswordReset());

 
    await act(async () => {
      try {
        await result.current.requestReset("user@example.com");
      } catch (e) {
      }
    });

 
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("Network failure");
    expect(result.current.message).toBeNull();
  });

  it("should handle error with no message", async () => {
    
    mockPost.mockRejectedValue({}); 

    const { result } = renderHook(() => usePasswordReset());

   
    await act(async () => {
      try {
        await result.current.requestReset("user@example.com");
      } catch (e) {
      
      }
    });

   
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(undefined); 
    expect(result.current.message).toBeNull();
  });
});