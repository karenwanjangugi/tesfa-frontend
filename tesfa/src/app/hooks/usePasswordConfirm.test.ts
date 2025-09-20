import { renderHook, act, waitFor } from "@testing-library/react";
import { usePasswordResetConfirm } from "./usePasswordConfirm";
import { post } from "../utils/fetchPassword";


jest.mock("../utils/fetchPassword", () => ({
  post: jest.fn(),
}));

describe("usePasswordResetConfirm", () => {
  const mockPost = post as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should reset password successfully", async () => {
   
    const mockResponse = { message: "Password reset successful." };
    mockPost.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => usePasswordResetConfirm());

    await act(async () => {
      await result.current.confirmReset({
        uid: "123",
        token: "abc",
        new_password: "newpass123",
      });
    });

    expect(mockPost).toHaveBeenCalledWith("password-reset-confirm/", {
      uid: "123",
      token: "abc",
      new_password: "newpass123",
    });
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.message).toBe("Password reset successful.");
  });

  it("should handle error gracefully", async () => {
 
    const mockError = new Error("Network error");
    mockPost.mockRejectedValue(mockError);

    const { result } = renderHook(() => usePasswordResetConfirm());

    await act(async () => {
      try {
        await result.current.confirmReset({
          uid: "123",
          token: "abc",
          new_password: "newpass123",
        });
      } catch (e) {
       
      }
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("Network error"); 
    expect(result.current.message).toBeNull();
  });

  it("should set default success message if response has no message", async () => {
    mockPost.mockResolvedValue({}); 

    const { result } = renderHook(() => usePasswordResetConfirm());

    await act(async () => {
      await result.current.confirmReset({
        uid: "123",
        token: "abc",
        new_password: "newpass123",
      });
    });

    expect(result.current.message).toBe("Password reset successful.");
  });

  it("should set generic error message if error has no message", async () => {
   
    mockPost.mockRejectedValue({}); 

    const { result } = renderHook(() => usePasswordResetConfirm());

    await act(async () => {
      try {
        await result.current.confirmReset({
          uid: "123",
          token: "abc",
          new_password: "newpass123",
        });
      } catch (e) {
        
      }
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("Something went wrong");
    expect(result.current.message).toBeNull();
  });
});