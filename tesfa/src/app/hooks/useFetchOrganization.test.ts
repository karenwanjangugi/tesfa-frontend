
import { renderHook, act, waitFor } from "@testing-library/react";
import useFetchOrganization from "./useFetchOrganization";
import { fetchProfile } from "../utils/fetchOrganization";

jest.mock("../utils/fetchOrganization");

describe("useFetchOrganization", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches profile successfully", async () => {
    const mockProfile = {
      email: "test@example.com",
      org_name: "Test NGO",
      created_at: "2024-01-01",
    };

    (fetchProfile as jest.Mock).mockResolvedValue(mockProfile);

    const { result } = renderHook(() => useFetchOrganization());

    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBeNull();
    expect(result.current.error).toBeNull();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.user).toEqual(mockProfile);
      expect(result.current.error).toBeNull();
    });
  });

  it("handles fetch error", async () => {
    const errorMessage = "Network Error";
    (fetchProfile as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useFetchOrganization());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(errorMessage);
      expect(result.current.user).toBeNull();
    });
  });

  it("refetches profile when refetch is called", async () => {
    const initialProfile = {
      email: "initial@example.com",
      org_name: "Initial NGO",
      created_at: "2024-01-01",
    };

    const updatedProfile = {
      email: "updated@example.com",
      org_name: "Updated NGO",
      created_at: "2024-06-01",
    };

    (fetchProfile as jest.Mock)
      .mockResolvedValueOnce(initialProfile)
      .mockResolvedValueOnce(updatedProfile);

    const { result } = renderHook(() => useFetchOrganization());

    await waitFor(() => {
      expect(result.current.user).toEqual(initialProfile);
    });

    await act(async () => {
      await result.current.refetch();
    });

    await waitFor(() => {
      expect(result.current.user).toEqual(updatedProfile);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    expect(fetchProfile).toHaveBeenCalledTimes(2);
  });
  it("handles error during refetch", async () => {
    const mockProfile = { email: "test@example.com", org_name: "Test NGO" };
    const refetchError = "Failed to refresh profile";

    (fetchProfile as jest.Mock)
      .mockResolvedValueOnce(mockProfile)
      .mockRejectedValueOnce(new Error(refetchError));

    const { result } = renderHook(() => useFetchOrganization());

    await waitFor(() => {
      expect(result.current.user).toEqual(mockProfile);
    });

    await act(async () => {
      await result.current.refetch();
    });

    await waitFor(() => {
      expect(result.current.error).toBe(refetchError);
      expect(result.current.loading).toBe(false);
      expect(result.current.user).toEqual(mockProfile);
    });
  });
});