// src/app/profile/components/TaskSummary/index.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskSummary from './index'; // or './TaskSummary' depending on your file

// Mock the hook
const mockUseFetchTaskAssignments = jest.fn();

jest.mock('@/app/hooks/useFetchTaskAssignment', () => ({
  __esModule: true,
  useFetchTaskAssignments: () => mockUseFetchTaskAssignments(),
}));

// Optional: mock icons for cleaner output
jest.mock('lucide-react', () => {
  const original = jest.requireActual('lucide-react');
  return {
    ...original,
    CheckCircle: () => <svg data-testid="check-icon" />,
    ChevronLeft: () => <svg />,
    ChevronRight: () => <svg />,
  };
});

describe('TaskSummary', () => {
  const mockTasks = [
    { id: 1, title: 'Setup database', status: 'completed' },
    { id: 2, title: 'Design UI', status: 'completed' },
    { id: 3, title: 'Write tests', status: 'completed' },
    { id: 4, title: 'Deploy app', status: 'completed' },
    { id: 5, title: 'Fix bug #123', status: 'completed' },
    { id: 6, title: 'Review PR', status: 'completed' },
    { id: 7, title: 'Update docs', status: 'in_progress' },
  ];

  beforeEach(() => {
    mockUseFetchTaskAssignments.mockReset();
  });

  it('shows error message when hook returns an error', () => {
    mockUseFetchTaskAssignments.mockReturnValue({
      assignedTasks: [],
      loading: false,
      error: { message: 'Failed to fetch tasks' },
    });

    render(<TaskSummary />);
    expect(screen.getByText('Error: Failed to fetch tasks')).toBeInTheDocument();
  });

 

  it('paginates completed tasks correctly', () => {
    mockUseFetchTaskAssignments.mockReturnValue({
      assignedTasks: mockTasks,
      loading: false,
      error: null,
    });

    render(<TaskSummary />);

    // Page 1
    expect(screen.getByText('Setup database')).toBeInTheDocument();
    expect(screen.queryByText('Review PR')).not.toBeInTheDocument();

    // Go to page 2
    fireEvent.click(screen.getByText('Next'));
    expect(screen.getByText('Review PR')).toBeInTheDocument();
    expect(screen.queryByText('Setup database')).not.toBeInTheDocument();

    // Go back to page 1
    fireEvent.click(screen.getByText('Previous'));
    expect(screen.getByText('Setup database')).toBeInTheDocument();
  });

  it('disables pagination buttons at boundaries', () => {
    mockUseFetchTaskAssignments.mockReturnValue({
      assignedTasks: mockTasks,
      loading: false,
      error: null,
    });

    render(<TaskSummary />);

    const prevBtn = screen.getByText('Previous');
    const nextBtn = screen.getByText('Next');

    expect(prevBtn).toBeDisabled();
    expect(nextBtn).not.toBeDisabled();

    fireEvent.click(nextBtn); // go to page 2

    expect(prevBtn).not.toBeDisabled();
    expect(nextBtn).toBeDisabled();
  });

  it('shows 0/0 and 0% when no tasks exist', () => {
    mockUseFetchTaskAssignments.mockReturnValue({
      assignedTasks: [],
      loading: false,
      error: null,
    });

    render(<TaskSummary />);

    expect(screen.getByText('0/0 Tasks Completed')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();

    // The "Recently Completed" heading is still shown (by design)
    expect(screen.getByText('Recently Completed')).toBeInTheDocument();

    // But no task items should appear
    expect(screen.queryByTestId('check-icon')).not.toBeInTheDocument();
  });
});