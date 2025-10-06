
import { renderHook, waitFor } from "@testing-library/react";
import { useFetchTasks } from "./useFetchTasksAdmin";
import { fetchTasksAssignmentsAdmin } from "../utils/fetchTaskAssignment";

jest.mock("../utils/fetchTaskAssignment");

const mockTasks = [
  { id: 1, task: 1, organization: 1, status: "completed", created_at: "2024-01-01" },
  { id: 2, task: 2, organization: 2, status: "in_progress", created_at: "2024-01-02" },
];

describe("useFetchTasks", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return tasks successfully", async () => {
    (fetchTasksAssignmentsAdmin as jest.Mock).mockResolvedValue(mockTasks);

    const { result } = renderHook(() => useFetchTasks());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.tasks).toEqual(mockTasks);
    });
  });

  it("should handle errors when fetching tasks", async () => {
    const testError = new Error("Failed to fetch tasks");
    (fetchTasksAssignmentsAdmin as jest.Mock).mockRejectedValue(testError);

    const { result } = renderHook(() => useFetchTasks());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.tasks).toEqual([]);
      expect(result.current.error).toEqual(testError);
    });
  });
});
