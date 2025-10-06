import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import TasksDetails from "."; 
import * as fetchTaskAssignment from "../../../utils/fetchTaskAssignment";
import * as useFetchTasksHook from "../../../hooks/useFetchTasks";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../../../utils/fetchTaskAssignment");
jest.mock("../../../hooks/useFetchTasks");

describe("TasksDetails component", () => {
  const tasksMock = [
    { id: "1", title: "Test Task 1", description: "desc1" },
    { id: "2", title: "Test Task 2", description: "desc2" },
  ];

  const pushMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    (useFetchTasksHook.useFetchTasks as jest.Mock).mockReturnValue({
      tasks: tasksMock,
      setTasks: jest.fn(),
      loading: false,
      error: null,
    });

  
  jest.spyOn(Storage.prototype, "getItem").mockImplementation((key) => {
  if (key === "user_id") return "test-org-id";
  return null;
});

  });

  it("renders tasks and toggles add mode", () => {
    render(<TasksDetails />);

    expect(screen.getByText("Test Task 1")).toBeInTheDocument();
    expect(screen.getByText("Test Task 2")).toBeInTheDocument();

    const selectButton = screen.getByRole("button", { name: /add task/i });
    expect(selectButton).toBeInTheDocument();

    fireEvent.click(selectButton);

    expect(screen.getAllByRole("checkbox").length).toBe(tasksMock.length);
  });

  it("allows selecting tasks and adding them", async () => {
    const setTasksMock = jest.fn();
    (useFetchTasksHook.useFetchTasks as jest.Mock).mockReturnValue({
      tasks: tasksMock,
      setTasks: setTasksMock,
      loading: false,
      error: null,
    });

    const createTaskAssignmentMock = fetchTaskAssignment.createTaskAssignment as jest.Mock;
    createTaskAssignmentMock.mockImplementation((taskId, orgId) =>
      Promise.resolve({ id: `assign-${taskId}`, task: taskId, status: "new" })
    );

    render(<TasksDetails />);
    fireEvent.click(screen.getByRole("button", { name: /add task/i }));

    const task1Container = screen.getByText("Test Task 1").closest("div");
    if (!task1Container) throw new Error("Task 1 container not found");
    fireEvent.click(task1Container);

    const addButton = await screen.findByRole("button", { name: /add \(1\) to my tasks/i });
    expect(addButton).not.toBeDisabled();

    fireEvent.click(addButton);

    await waitFor(() => {
     
      expect(createTaskAssignmentMock).toHaveBeenCalledWith("1", "test-org-id");
      expect(pushMock).toHaveBeenCalledWith(expect.stringContaining("/kanban?newTasks="));
    });
  });

  it("displays loading and error states", () => {
    (useFetchTasksHook.useFetchTasks as jest.Mock).mockReturnValue({
      tasks: [],
      setTasks: jest.fn(),
      loading: true,
      error: null,
    });
    const { rerender } = render(<TasksDetails />);
    expect(screen.getByText(/loading tasks/i)).toBeInTheDocument();

    (useFetchTasksHook.useFetchTasks as jest.Mock).mockReturnValue({
      tasks: [],
      setTasks: jest.fn(),
      loading: false,
      error: new Error("fail"),
    });

    rerender(<TasksDetails />);
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });
});
