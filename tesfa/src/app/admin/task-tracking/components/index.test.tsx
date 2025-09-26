
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import TasksAdmin from "./index";
import { useDashboardData } from "../../../hooks/useTaskPageData";

jest.mock("../../../hooks/useTaskPageData");

const mockData = {
  taskAssignments: [
    { id: 1, task: 1, organization: 1, status: "completed", created_at: "2024-01-01" },
    { id: 2, task: 2, organization: 2, status: "in_progress", created_at: "2024-01-02" },
  ],
  predictions: [{ id: 1, task: 1, predicted_deadline: "2024-01-02" }],
  taskTitleMap: new Map([
    [1, "Task A"],
    [2, "Task B"],
  ]),
  organizationNameMap: new Map([
    [1, "Org 1"],
    [2, "Org 2"],
  ]),
  allTasks: [],
  organizations: [],
};

describe("TasksAdmin", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should display loading state initially", () => {
    (useDashboardData as jest.Mock).mockReturnValue({
      data: null,
      loading: true,
      error: null,
    });
    render(<TasksAdmin />);
    expect(screen.getByText("Loading dashboard data...")).toBeInTheDocument();
  });

  it("should display error message if data fetching fails", () => {
    const errorMessage = "Failed to fetch";
    (useDashboardData as jest.Mock).mockReturnValue({
      data: null,
      loading: false,
      error: new Error(errorMessage),
    });
    render(<TasksAdmin />);
    expect(screen.getByText(`Error loading data: ${errorMessage}. Please ensure your token is valid.`)).toBeInTheDocument();
  });

  it("should display no data message if data is not available", () => {
    (useDashboardData as jest.Mock).mockReturnValue({
      data: null,
      loading: false,
      error: null,
    });
    render(<TasksAdmin />);
    expect(screen.getByText("No data available.")).toBeInTheDocument();
  });

  it("should render dashboard stats and task assignments when data is loaded", () => {
    (useDashboardData as jest.Mock).mockReturnValue({
      data: mockData,
      loading: false,
      error: null,
    });
    render(<TasksAdmin />);
    expect(screen.getByText("Predicted Cases")).toBeInTheDocument();
    expect(screen.getAllByText("1")).toHaveLength(2);
    expect(screen.getByText("Total Interventions")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("Completed Tasks")).toBeInTheDocument();
    expect(screen.getByText("Task A")).toBeInTheDocument();
    expect(screen.getByText("Org 1")).toBeInTheDocument();
  });

  it("should filter tasks based on search query", async () => {
    (useDashboardData as jest.Mock).mockReturnValue({
      data: mockData,
      loading: false,
      error: null,
    });
    render(<TasksAdmin />);
    const searchInput = screen.getByPlaceholderText("Search");
    fireEvent.change(searchInput, { target: { value: "Task A" } });
    await waitFor(() => {
      expect(screen.getByText("Task A")).toBeInTheDocument();
      expect(screen.queryByText("Task B")).not.toBeInTheDocument();
    });
  });
});
