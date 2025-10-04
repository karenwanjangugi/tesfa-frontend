
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import DashboardPage from './page';

const mockUseFetchOrganizations = jest.fn();
const mockUseFetchPredictions = jest.fn();
const mockUseFetchTasks = jest.fn();
const mockUseFetchQueries = jest.fn();
const mockUseAffectedCountries = jest.fn();

jest.mock('@/app/hooks/useFetchOrganizations', () => ({
  __esModule: true,
  default: () => mockUseFetchOrganizations(),
}));

jest.mock('@/app/hooks/useFetchPredictionsAdmin', () => ({
  __esModule: true,
  useFetchPredictions: () => mockUseFetchPredictions(),
}));

jest.mock('@/app/hooks/useFetchTasksAdmin', () => ({
  __esModule: true,
  useFetchTasks: () => mockUseFetchTasks(),
}));

jest.mock('@/app/hooks/useQueries', () => ({
  __esModule: true,
  useFetchQueries: () => mockUseFetchQueries(),
}));

jest.mock('@/app/hooks/useAffectedRegions', () => ({
  __esModule: true,
  useAffectedCountries: () => mockUseAffectedCountries(),
}));


jest.mock('recharts', () => {
  const createMock = (name: string) => () => <div data-testid={`mock-${name}`} />;
  return {
    BarChart: createMock('bar-chart'),
    Bar: () => <div />,
    XAxis: () => <div />,
    YAxis: () => <div />,
    Tooltip: () => <div />,
    LineChart: createMock('line-chart'),
    Line: () => <div />,
    CartesianGrid: () => <div />,
    Legend: () => <div />,
    PieChart: createMock('pie-chart'),
    Pie: () => <div />,
    Cell: () => <div />,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  };
});


jest.mock('../sharedcomponent/Calender', () => {
  return ({ onDateChange }: { onDateChange: (range: [Date | null, Date | null]) => void }) => {
    React.useEffect(() => {
      onDateChange([new Date('2024-01-01'), new Date('2024-01-31')]);
    }, [onDateChange]);
    return <div data-testid="calendar-picker" />;
  };
});

jest.mock('../sharedcomponent/Sidebar', () => () => <div data-testid="sidebar" />);

jest.mock('react-icons/fa', () => ({
  FaSpinner: () => <span data-testid="spinner" />,
}));

describe('DashboardPage', () => {
  beforeEach(() => {

    mockUseFetchOrganizations.mockReturnValue({
      organizations: [
        { id: 1, role: 'organization', is_active: true, created_at: '2024-01-15T00:00:00Z' },
        { id: 2, role: 'organization', is_active: false, created_at: '2024-02-20T00:00:00Z' },
      ],
      loading: false,
    });

    mockUseFetchPredictions.mockReturnValue({
      predictions: [{ id: 1 }, { id: 2 }],
      loading: false,
    });

    mockUseFetchTasks.mockReturnValue({
      tasks: [{ id: 1 }],
      loading: false,
    });

    mockUseFetchQueries.mockReturnValue({
      queries: [
        { id: 1, created_at: '2024-01-10T00:00:00Z' },
        { id: 2, created_at: '2024-03-05T00:00:00Z' },
      ],
      loading: false,
    });

 
    mockUseAffectedCountries.mockReturnValue({
      data: [
        { country_id: 1, countries_name: 'Country A' },
        { country_id: 2, countries_name: 'Country B' },
      ],
      loading: false,
    });
  });

  it('renders dashboard with data and charts', () => {
    render(<DashboardPage />);

    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('calendar-picker')).toBeInTheDocument();

    const statValues = screen.getAllByText(/\d+/);
    expect(statValues).toHaveLength(4);
    expect(statValues[0]).toHaveTextContent('2'); 
    expect(statValues[1]).toHaveTextContent('1'); 
    expect(statValues[2]).toHaveTextContent('1'); 
    expect(statValues[3]).toHaveTextContent('1'); 

    expect(screen.getByTestId('mock-bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('mock-pie-chart')).toBeInTheDocument();
    expect(screen.getByTestId('mock-line-chart')).toBeInTheDocument();

    expect(screen.getByText('Country A')).toBeInTheDocument();
    expect(screen.getByText('Country B')).toBeInTheDocument();
  });

  it('shows spinners when affected countries are loading', () => {
 
    mockUseAffectedCountries.mockReturnValue({
      data: null,
      loading: true,
    });

    render(<DashboardPage />);

    const spinners = screen.getAllByTestId('spinner');
    expect(spinners).toHaveLength(2);

    expect(screen.getByText('High Risk Areas')).toBeInTheDocument();
  });
});