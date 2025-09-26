import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditProfilePage from './page';
import { useRouter } from 'next/navigation';

// Import the actual hook (for mocking reference)
import useFetchOrganization from '../hooks/useFetchOrganization';

import { updateUser } from '../utils/fetchOrganizations';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  __esModule: true,
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

jest.mock('../hooks/useFetchOrganization', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../utils/fetchOrganizations', () => ({
  updateUser: jest.fn(),
}));

jest.mock('../sharedComponents/Layout', () => {
  return ({ children }: { children: React.ReactNode }) => <div data-testid="layout">{children}</div>;
});

jest.mock('lucide-react', () => ({
  CameraIcon: () => <div data-testid="camera-icon" />,
  Eye: () => <div data-testid="eye-icon" />,
  EyeOff: () => <div data-testid="eye-off-icon" />,
  Sidebar: () => <div data-testid="sidebar-icon" />,
}));

const mockProfile = {
  id: 1,
  email: 'ngo@example.com',
  org_name: 'My NGO',
  logo_image: '/logo.png',
};

describe('EditProfilePage', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    (useFetchOrganization as jest.Mock).mockReturnValue({
      user: mockProfile,
      loading: false,
      error: null,
      refetch: jest.fn().mockResolvedValue(undefined),
    });

    (updateUser as jest.Mock).mockResolvedValue(undefined);
  });

  it('submits form and navigates on success', async () => {
    jest.useFakeTimers();
    render(<EditProfilePage />);

    fireEvent.change(screen.getByRole('textbox', { name: /Email/i }), {
      target: { value: 'updated@example.com' },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Save/i }));
    });

    act(() => {
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(updateUser).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/profile');
    });

    expect(screen.getByText(/Successfully updated!/i)).toBeInTheDocument();
  });

  it('shows error message on update failure', async () => {
    const errorMessage = 'Email already taken';
    (updateUser as jest.Mock).mockRejectedValue(new Error(errorMessage));

    render(<EditProfilePage />);

    fireEvent.click(screen.getByRole('button', { name: /Save/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('toggles password visibility', () => {
    render(<EditProfilePage />);

    const toggleButton = screen.getByLabelText(/Show password/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    expect(passwordInput).toHaveAttribute('type', 'password');
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
  });
});
