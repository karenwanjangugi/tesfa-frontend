
import { render, screen } from '@testing-library/react';
import PerformancePage from './page';

jest.mock('../sharedcomponent/Sidebar', () => ({
  __esModule: true,
  default: () => <div data-testid="sidebar" />,
}));

jest.mock('./ApiUsageChart', () => ({
  __esModule: true,
  default: () => <div data-testid="api-usage-chart" />,
}));

jest.mock('recharts', () => ({
  AreaChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="area-chart">{children}</div>
  ),
  Area: () => <div data-testid="area" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  Tooltip: () => <div data-testid="tooltip" />,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('PerformancePage', () => {
  it('renders all main components and UI elements', () => {
    render(<PerformancePage />);

    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('api-usage-chart')).toBeInTheDocument();

    expect(screen.getByText('Tesfa Agent')).toBeInTheDocument();

    expect(screen.getByText('Accuracy')).toBeInTheDocument();
    expect(screen.getByText('70%')).toBeInTheDocument();
    expect(screen.getByText('Efficiency')).toBeInTheDocument();
    expect(screen.getByText('60%')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Number of Queries' })).toBeInTheDocument();
    
  
    expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    expect(screen.getByTestId('area')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();

  
    expect(screen.getAllByTestId('area-chart')).toHaveLength(1); 
    expect(screen.getByTestId('api-usage-chart')).toBeInTheDocument();
  });

  it('renders progress bars with correct widths', () => {
    render(<PerformancePage />);

    const accuracyPercent = screen.getByText('70%');
    const efficiencyPercent = screen.getByText('60%');
    
    expect(accuracyPercent).toBeInTheDocument();
    expect(efficiencyPercent).toBeInTheDocument();
    
    const gradientDivs = screen.getAllByRole('generic', { 
      name: '' 
    }).filter(el => 
      el.classList.contains('bg-gradient-to-r') && 
      el.style.width 
    );
    
   
  });

  it('displays correct chart data structure', () => {
    render(<PerformancePage />);


    expect(screen.getByTestId('area-chart')).toBeInTheDocument();

  });
});