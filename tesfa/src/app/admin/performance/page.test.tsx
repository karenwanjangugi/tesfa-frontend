
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PerformancePage from './page';
import { useQueryLog } from '@/app/hooks/useQueryLog';

jest.mock('@/app/hooks/useQueryLog', () => ({
  useQueryLog: jest.fn(),
}));


jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  return {
    ...OriginalModule,
    AreaChart: ({ children }: { children: React.ReactNode }) => <div data-testid="area-chart">{children}</div>,
    Area: () => <div data-testid="area" />,
    XAxis: () => <div data-testid="x-axis" />,
    YAxis: () => <div data-testid="y-axis" />,
    Tooltip: () => <div data-testid="tooltip" />,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  };
});


jest.mock('../sharedcomponent/Sidebar', () => () => <div data-testid="sidebar" />);
jest.mock('./components/ApiUsageChart', () => () => <div data-testid="api-usage-chart" />);

describe('PerformancePage', () => {
  const mockLogs = [
    { query: 'test1', created_at: '2024-01-15T10:00:00Z' },
    { query: 'test2', created_at: '2024-01-20T11:00:00Z' },
    { query: 'test3', created_at: '2024-02-05T09:00:00Z' },
  ];

  beforeEach(() => {
    (useQueryLog as jest.Mock).mockReturnValue({
      logs: mockLogs,
      loading: false,
      error: null,
    });
  });

  it('renders sidebar, accuracy/efficiency bars, and chart with data', async () => {
    render(<PerformancePage />);


    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByText('Tesfa Agent')).toBeInTheDocument();
    expect(screen.getByText('70%')).toBeInTheDocument();
    expect(screen.getByText('60%')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    });

    expect(screen.queryByText('Loading chart...')).not.toBeInTheDocument();
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    expect(screen.getByTestId('api-usage-chart')).toBeInTheDocument();
  });

  it('shows loading state when logs are loading', () => {
    (useQueryLog as jest.Mock).mockReturnValue({
      logs: [],
      loading: true,
      error: null,
    });

    render(<PerformancePage />);

    expect(screen.getByText('Loading chart...')).toBeInTheDocument();
  });

  it('shows error message when hook returns error', () => {
    const errorMessage = 'Failed to fetch logs';
    (useQueryLog as jest.Mock).mockReturnValue({
      logs: [],
      loading: false,
      error: errorMessage,
    });

    render(<PerformancePage />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});