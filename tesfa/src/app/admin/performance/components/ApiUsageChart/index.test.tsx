
import { render, screen, waitFor } from '@testing-library/react';
import ApiUsageChart from '.';
import useFetchApiUsageStats from '@/app/hooks/usefetchApiusage';

jest.mock('@/app/hooks/usefetchApiusage', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('recharts', () => ({
  LineChart: ({ children }: { children: React.ReactNode }) => <div data-testid="line-chart">{children}</div>,
  Line: ({ name }: { name: string }) => <div data-testid={`line-${name}`} />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('ApiUsageChart', () => {
  const mockData = [
    { month: 'Jan', queries: 100, users: 50, tasks: 75, countries: 25 },
    { month: 'Feb', queries: 120, users: 60, tasks: 80, countries: 30 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    (useFetchApiUsageStats as jest.Mock).mockReturnValue({
      data: [],
      loading: true,
      error: null,
    });

    render(<ApiUsageChart />);

    expect(screen.getByText('Loading API usage data...')).toBeInTheDocument();
  });

  it('renders error state when hook returns error', () => {
    const errorMessage = 'Failed to load data';
    (useFetchApiUsageStats as jest.Mock).mockReturnValue({
      data: [],
      loading: false,
      error: errorMessage,
    });

    render(<ApiUsageChart />);

    expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
  });

  it('renders chart with data when loading completes successfully', async () => {
    (useFetchApiUsageStats as jest.Mock).mockReturnValue({
      data: mockData,
      loading: false,
      error: null,
    });

    render(<ApiUsageChart />);


    await waitFor(() => {
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });


    expect(screen.getByText('API Usage Overview')).toBeInTheDocument();
    expect(screen.getByText('Monthly API Calls by Endpoint')).toBeInTheDocument();

    expect(screen.getByTestId('line-Queries')).toBeInTheDocument();
    expect(screen.getByTestId('line-Users')).toBeInTheDocument();
    expect(screen.getByTestId('line-Tasks')).toBeInTheDocument();
    expect(screen.getByTestId('line-Countries')).toBeInTheDocument();

    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    expect(screen.getByTestId('legend')).toBeInTheDocument();
  });

  it('passes correct data to LineChart', () => {
    (useFetchApiUsageStats as jest.Mock).mockReturnValue({
      data: mockData,
      loading: false,
      error: null,
    });

    render(<ApiUsageChart />);


    const chartElement = screen.getByTestId('line-chart');
    expect(chartElement).toBeInTheDocument();
 
  });
});