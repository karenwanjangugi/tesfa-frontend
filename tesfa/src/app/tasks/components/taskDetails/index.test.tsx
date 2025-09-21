import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import TasksPage from '../../page';
import { useFetchTasks } from '../../../../hooks/useFetchTasks';
import { createTaskAssignment } from '../../../../utils/fetchtaskAssignment';

// Mock child components and libraries
jest.mock('../../../sharedcomponents/Button', () => ({
  Button: ({ children, onClick, disabled, className }: any) => (
    <button onClick={onClick} disabled={disabled} className={className}>{children}</button>
  ),
}));
jest.mock('../Checkbox', () => ({
  Checkbox: ({ checked, onCheckedChange }: { checked: boolean, onCheckedChange: (checked: boolean) => void }) => (
    <input type="checkbox" checked={checked} onChange={e => onCheckedChange(e.target.checked)} />
  ),
}));
jest.mock('react-icons/fa');
jest.mock('framer-motion', () => ({
  motion: { div: ({ children, ...props }: any) => <div {...props}>{children}</div> },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

jest.mock('next/navigation');
jest.mock('../../../../hooks/useFetchTasks');
jest.mock('../../../../utils/fetchtaskAssignment');

describe('TasksPage', () => {
  const mockUseRouter = useRouter as jest.Mock;
  const mockUseTasks = useFetchTasks as jest.Mock;
  const mockCreateTaskAssignment = createTaskAssignment as jest.Mock;
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({ push: mockPush, replace: jest.fn() });
    mockUseTasks.mockReturnValue({
      tasks: [
        { id: '1', title: 'Design Homepage', description: 'Create wireframes', status: 'pending' },
        { id: '2', title: 'Fix Login Bug', description: 'User auth issue', status: 'pending' },
      ],
      setTasks: jest.fn(),
      loading: false,
      error: null,
    });
  });

  it('renders loading state', () => {
    mockUseTasks.mockReturnValue({ loading: true, tasks: [], error: null, setTasks: jest.fn() });
    render(<TasksPage />);
    expect(screen.getByText(/Loading tasks.../i)).toBeInTheDocument();
  });

  it('renders error state', () => {
    mockUseTasks.mockReturnValue({ loading: false, tasks: [], error: new Error('Failed'), setTasks: jest.fn() });
    render(<TasksPage />);
    expect(screen.getByText(/Something went Wrong/i)).toBeInTheDocument();
  });

  it('submits selected tasks and redirects', async () => {
    const mockSetTasks = jest.fn();
    mockUseTasks.mockReturnValue({
      tasks: [{ id: '1', title: 'Design Homepage', description: '...', status: 'pending' }],
      setTasks: mockSetTasks,
      loading: false,
      error: null,
    });

    mockCreateTaskAssignment.mockResolvedValue({
      id: 101,
      task: 1,
      status: 'pending',
    });

    render(<TasksPage />);


    fireEvent.click(screen.getByRole('button', { name: /add task/i }));
    fireEvent.click(screen.getByText('Design Homepage'));

    fireEvent.click(screen.getByRole('button', { name: /add \(1\) to my tasks/i }));


    await waitFor(() => {
      expect(mockCreateTaskAssignment).toHaveBeenCalledWith('1', 7);
    });
    await waitFor(() => {
      expect(mockSetTasks).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('/kanban?newTasks='));
    });
  });
});