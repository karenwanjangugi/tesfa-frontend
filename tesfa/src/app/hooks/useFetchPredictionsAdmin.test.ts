
import { renderHook, waitFor } from "@testing-library/react";
import { useFetchPredictions } from "./useFetchPredictionsAdmin";
import { fetchPredictionsAdmin } from "../utils/fetchPredictionsAdmin";

jest.mock("../utils/fetchPredictionsAdmin");

const mockPredictions = [
  { id: 1, task: 1, predicted_deadline: "2024-01-02" },
  { id: 2, task: 2, predicted_deadline: "2024-01-03" },
];

describe("useFetchPredictions", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return predictions successfully", async () => {
    (fetchPredictionsAdmin as jest.Mock).mockResolvedValue(mockPredictions);

    const { result } = renderHook(() => useFetchPredictions());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.predictions).toEqual(mockPredictions);
    });
  });

  it("should handle errors when fetching predictions", async () => {
    const testError = new Error("Failed to fetch predictions");
    (fetchPredictionsAdmin as jest.Mock).mockRejectedValue(testError);

    const { result } = renderHook(() => useFetchPredictions());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.predictions).toEqual([]);
      expect(result.current.error).toEqual(testError);
    });
  });
});
