import { renderHook, waitFor, act } from '@testing-library/react';
import useFetchOrganization from './useFetchOrganization';
import * as fetchOrganizations from '../utils/fetchOrganizations';

jest.mock("../utils/fetchOrganizations");

describe("useFetchOrganization", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch organization data successfully", async () => {
    const mockUser = {
      email: "test@example.com",
      role: "organization",
      org_name: "Test Org",
      logo_image: "/logo.png",
      created_at: "2023-01-01T00:00:00Z",
    };
    (fetchOrganizations.fetchProfile as jest.Mock).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useFetchOrganization());

    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBe(null);
    expect(result.current.error).toBe(null);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.error).toBe(null);
    expect(fetchOrganizations.fetchProfile).toHaveBeenCalledTimes(1);
  });

  it("should handle error when fetching organization data", async () => {
    const errorMessage = "Failed to fetch organization";
    (fetchOrganizations.fetchProfile as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useFetchOrganization());

    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBe(null);
    expect(result.current.error).toBe(null);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.user).toBe(null);
    expect(result.current.error).toBe(errorMessage);
    expect(fetchOrganizations.fetchProfile).toHaveBeenCalledTimes(1);
  });

  it("should refetch organization data", async () => {
    const mockUser1 = {
      email: "test1@example.com",
      role: "organization",
      org_name: "Test Org 1",
      logo_image: "/logo1.png",
      created_at: "2023-01-01T00:00:00Z",
    };
    const mockUser2 = {
      email: "test2@example.com",
      role: "organization",
      org_name: "Test Org 2",
      logo_image: "/logo2.png",
      created_at: "2023-01-02T00:00:00Z",
    };

    (fetchOrganizations.fetchProfile as jest.Mock)
      .mockResolvedValueOnce(mockUser1)
      .mockResolvedValueOnce(mockUser2);

    const { result } = renderHook(() => useFetchOrganization());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.user).toEqual(mockUser1);

    await act(async () => {
      result.current.refetch();
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.user).toEqual(mockUser2);
    expect(fetchOrganizations.fetchProfile).toHaveBeenCalledTimes(2);
  });
});
