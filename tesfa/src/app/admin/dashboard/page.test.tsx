import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardPage from './page';

import CalendarPicker from '../sharedcomponent/Calender';

// ✅ Mock all data hooks
jest.mock('@/app/hooks/useFetchOrganizations', () => ({
  __esModule: true,
  default: () => ({
    organizations: [
      { id: 1, created_at: '2024-01-15T10:00:00Z', role: 'organization', is_active: true },
      { id: 2, created_at: '2024-02-20T10:00:00Z', role: 'organization', is_active: true },
    ],
    loading: false,
  }),
}));

jest.mock('@/app/hooks/useFetchPredictionsAdmin', () => ({
  __esModule: true,
  useFetchPredictions: () => ({
    predictions: [{ id: 1 }, { id: 2 }],
    loading: false,
  }),
}));

jest.mock('@/app/hooks/useFetchTasksAdmin', () => ({
  __esModule: true,
  useFetchTasks: () => ({
    tasks: [{ id: 1 }],
    loading: false,
  }),
}));

jest.mock('@/app/hooks/useQueries', () => ({
  __esModule: true,
  useFetchQueries: () => ({
    queries: [
      { id: 1, created_at: '2024-03-10T10:00:00Z' },
      { id: 2, created_at: '2024-04-05T10:00:00Z' },
      { id: 3, created_at: '2024-05-01T10:00:00Z' },
    ],
    loading: false,
  }),
}));

jest.mock('@/app/hooks/useAffectedRegions', () => ({
  __esModule: true,
  useAffectedCountries: () => ({
    data: [
      { country_id: 1, countries_name: 'Ethiopia' },
      { country_id: 2, countries_name: 'Sudan' },
    ],
    loading: false,
  }),
}));

// ✅ Mock shared components using ABSOLUTE paths (via @/)
jest.mock('@/app/sharedcomponent/Sidebar', () => ({
  __esModule: true,
  default: () => <div data-testid="sidebar">Sidebar</div>,
}));

// ⚠️ CRITICAL: Use "Calendar", NOT "Calender"
jest.mock('@/app/sharedcomponent/Calendar', () => ({
  __esModule: true,
  default: ({ onDateChange }: { onDateChange: (range: [Date | null, Date | null]) => void }) => (
    <button onClick={() => onDateChange([null, null])} data-testid="calendar-picker">
      Calendar Picker
    </button>
  ),
}));

// ✅ Mock Recharts (they don't render in JSDOM)
jest.mock('recharts', () => {
  const MockChart = ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="chart">{children}</div>
  );
  return {
    BarChart: MockChart,
    Bar: () => null,
    XAxis: () => null,
    YAxis: () => null,
    Tooltip: () => null,
    LineChart: MockChart,
    Line: () => null,
    CartesianGrid: () => null,
    Legend: () => null,
    PieChart: MockChart,
    Pie: () => null,
    Cell: () => null,
    ResponsiveContainer: ({ children }: { children?: React.ReactNode }) => (
      <div style={{ width: '100%', height: 300 }}>{children}</div>
    ),
  };
});

// ✅ Mock spinner
jest.mock('react-icons/fa', () => ({
  FaSpinner: () => <span data-testid="spinner">Loading...</span>,
}));

describe('DashboardPage', () => {
  it('renders dashboard with data and charts', async () => {
    render(<DashboardPage />);

    // Wait for initial render
    await waitFor(() => {
      expect(screen.getByText('High Risk Areas')).toBeInTheDocument();
    });

    // ✅ Stats
    expect(screen.getByText('High Risk Areas')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // countries

    expect(screen.getByText('Total Organizations')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument(); // filteredOrgs (all within date range)

    expect(screen.getByText('Active Organizations')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // both active

    expect(screen.getByText('Total Queries')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();

    // ✅ Charts rendered
    expect(screen.getAllByTestId('chart')).toHaveLength(3);

    // ✅ Country list
    expect(screen.getByText('Ethiopia')).toBeInTheDocument();
    expect(screen.getByText('Sudan')).toBeInTheDocument();

    // ✅ Shared components
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('calendar-picker')).toBeInTheDocument();
  });

  it('shows loading spinner when data is loading', () => {
    // Override one hook to return loading: true
    jest.mocked(require('@/app/hooks/useFetchOrganizations').default).mockReturnValueOnce({
      organizations: null,
      loading: true,
    });

    render(<DashboardPage />);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });
});