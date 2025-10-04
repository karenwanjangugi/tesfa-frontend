
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import * as useFetchOrganizationsHook from "@/app/hooks/useFetchOrganizations";


jest.mock("@/app/hooks/useFetchPredictionsAdmin", () => ({
  useFetchPredictions: () => ({ predictions: [], loading: false }),
}));

jest.mock("@/app/hooks/useFetchTasksAdmin", () => ({
  useFetchTasks: () => ({ tasks: [], loading: false }),
}));

jest.mock("@/app/hooks/useQueryLog", () => ({
  useQueryLog: () => ({ logs: [], loading: false }),
}));

jest.mock("@/app/hooks/useFetchOrganizations", () => ({
  __esModule: true,
  default: jest.fn(() => ({ organizations: [], loading: false })),
}));

jest.mock("@/app/hooks/useCountries", () => ({
  useCountries: () => ({ countries: [], loading: false }),
}));


jest.mock("recharts", () => ({
  BarChart: ({ "data-testid": dataTestId, children }: { "data-testid": string, children: React.ReactNode }) => <div data-testid={dataTestId}>{children}</div>,
  Bar: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  Tooltip: () => <div />,
  LineChart: ({ "data-testid": dataTestId, children }: { "data-testid": string, children: React.ReactNode }) => <div data-testid={dataTestId}>{children}</div>,
  Line: () => <div />,
  CartesianGrid: () => <div />,
  Legend: () => <div />,
  PieChart: ({ "data-testid": dataTestId, children }: { "data-testid": string, children: React.ReactNode }) => <div data-testid={dataTestId}>{children}</div>,
  Pie: () => <div />,
  Cell: () => <div />,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));


jest.mock("react-icons/fa", () => ({
  FaSpinner: () => <span data-testid="spinner" />,
}));

jest.mock("../sharedcomponent/Calender", () => ({
  __esModule: true,
  default: ({ onDateChange }: { onDateChange: (range: [Date | null, Date | null]) => void }) => (
    <button onClick={() => onDateChange([null, null])} data-testid="calendar-picker">
      Calendar
    </button>
  ),
}));


jest.mock("../sharedcomponent/Sidebar", () => ({
  __esModule: true,
  default: () => <div data-testid="sidebar" />,
}));


import DashboardPage from "./page";

describe("DashboardPage", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(<DashboardPage />);
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("calendar-picker")).toBeInTheDocument();
  });

  it("shows spinner when organizations are loading", () => {

    const useFetchOrganizationsSpy = jest.spyOn(useFetchOrganizationsHook, "default");
    useFetchOrganizationsSpy.mockReturnValue({ organizations: [], loading: true });

    render(<DashboardPage />);
    expect(screen.getAllByTestId("spinner").length).toBeGreaterThan(0);
  });

  it("renders charts", () => {
    render(<DashboardPage />);
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
    expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
  });
});