import { renderHook, waitFor } from "@testing-library/react";
import { useFetchTasks } from "./useFetchTasks";
import { mapApiTask } from "../utils/fetchTasks";
import { fetchTaskAssignments } from "../utils/fetchtaskAssignment";

process.env.NEXT_PUBLIC_API_URL = "https://api.example.com";
process.env.NEXT_PUBLIC_API_TOKEN = "fake-token";

jest.mock("../utils/fetchtaskAssignment", () => ({
  fetchTaskAssignments: jest.fn(),
}));

jest.mock("../utils/fetchTasks", () => ({
  ...jest.requireActual("../utils/fetchTasks"),
  mapApiTask: jest.fn(),
}));

global.fetch = jest.fn();

describe("useTasks", () => {
  const mockAssignments = [
    { id: 101, task: 1 },
    { id: 102, task: 3 },
  ];

  const mockApiTasks = [
    {
      id: 1,
      title: "Assigned Task",
      description: "Already assigned",
      status: "pending",
    },
    {
      id: 2,
      title: "Available Task",
      description: "Not assigned yet",
      status: "pending",
    },
    {
      id: 3,
      title: "Also Assigned",
      description: "Already taken",
      status: "pending",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    (fetchTaskAssignments as jest.Mock).mockResolvedValue(mockAssignments);
    (mapApiTask as jest.Mock).mockImplementation(
      (apiTask: { id: number; title: string; description: string }) =>
        Promise.resolve({
          id: String(apiTask.id),
          title: apiTask.title,
          description: apiTask.description,
          status: "pending",
        })
    );

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockApiTasks),
    });
  });

  it("fetches and filters unassigned tasks successfully", async () => {
    const { result } = renderHook(() => useFetchTasks());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(fetchTaskAssignments).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalled();
    const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
    expect(fetchCall[0]).toBe("api/tasks");
    expect(result.current.tasks.length).toBe(1);
    expect(result.current.tasks[0].id).toBe("2");
    expect(result.current.tasks[0].title).toBe("Available Task");
  });

  
  it("handles API fetch error gracefully", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error("API is down"));
    const { result } = renderHook(() => useFetchTasks());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toEqual(expect.any(Error));
    expect(result.current.tasks).toEqual([]);
  });


  it("returns all tasks if no assignments exist", async () => {
    (fetchTaskAssignments as jest.Mock).mockResolvedValue([]);
    const { result } = renderHook(() => useFetchTasks());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.tasks.length).toBe(3);
  });


  it('handles empty tasks response', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });
    const { result } = renderHook(() => useFetchTasks());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.tasks).toEqual([]);
    expect(result.current.error).toBeNull();
  });
});
