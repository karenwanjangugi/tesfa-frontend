import { renderHook, waitFor } from "@testing-library/react";
import { useDashboardData } from "./useTaskPageData";
import { fetchTasksAssignmentsAdmin } from "../utils/fetchTaskAssignment";
import { fetchTasksDetailsAdmin } from "../utils/fetchTasks";
import { fetchOrganizationsAdmin } from "../utils/fetchOrganizations";
import { fetchPredictionsAdmin } from "../utils/fetchPredictionsAdmin";

jest.mock("../utils/fetchTaskAssignment");
jest.mock("../utils/fetchTasks");
jest.mock("../utils/fetchOrganizations");
jest.mock("../utils/fetchPredictionsAdmin");

const mockTaskAssignments = [
  { id: 1, task: 1, organization: 1, status: "completed", created_at: "2024-01-01" },
];
const mockTaskDetails = [{ id: 1, title: "Test Task" }];
const mockUsers = [
  { id: 1, org_name: "Test Org", role: "organization" },
  { id: 2, org_name: "Test Admin", role: "admin" },
];
const mockPredictions = [{ id: 1, task: 1, predicted_deadline: "2024-01-02" }];

describe("useDashboardData", () => {
  beforeEach(() => {
    (fetchTasksAssignmentsAdmin as jest.Mock).mockResolvedValue(mockTaskAssignments);
    (fetchTasksDetailsAdmin as jest.Mock).mockResolvedValue(mockTaskDetails);
    (fetchOrganizationsAdmin as jest.Mock).mockResolvedValue(mockUsers);
    (fetchPredictionsAdmin as jest.Mock).mockResolvedValue(mockPredictions);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch and process data successfully", async () => {
    const { result } = renderHook(() => useDashboardData());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.data).toBeDefined();
    });

    expect(result.current.data?.taskAssignments).toEqual(mockTaskAssignments);
    expect(result.current.data?.allTasks).toEqual(mockTaskDetails);
    expect(result.current.data?.organizations).toEqual([mockUsers[0]]);
    expect(result.current.data?.predictions).toEqual(mockPredictions);
    expect(result.current.data?.taskTitleMap.get(1)).toBe("Test Task");
    expect(result.current.data?.organizationNameMap.get(1)).toBe("Test Org");
  });

  it("should handle errors during data fetching", async () => {
    const testError = new Error("Failed to fetch");
    (fetchTasksAssignmentsAdmin as jest.Mock).mockRejectedValue(testError);

    const { result } = renderHook(() => useDashboardData());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toBeNull();
      expect(result.current.error).toEqual(testError);
    });
  });
});