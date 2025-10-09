import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditProfilePage from './page';
import useFetchOrganization from '../hooks/useFetchOrganization';
import { updateUser } from '../utils/fetchOrganizations';

const mockRouter = {
  push: jest.fn(),
};

jest.mock('next/navigation', () => ({
  __esModule: true,
  useRouter: () => mockRouter,
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <div data-testid="mocked-image" {...props} />,
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

jest.mock('../sharedComponents/ProtectedRoot', () => {
  return ({ children }: { children: React.ReactNode }) => <>{children}</>;
});

jest.mock('lucide-react', () => {
  const CameraIcon = () => <div data-testid="camera-icon" />;
  const Eye = () => <div data-testid="eye-icon" />;
  const EyeOff = () => <div data-testid="eye-off-icon" />;
  return { CameraIcon, Eye, EyeOff };
});

const mockProfile = {
  id: 1,
  email: 'ngo@example.com',
  org_name: 'My NGO',
  logo_image: '/logo.png',
};

describe('EditProfilePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRouter.push.mockClear();

    (useFetchOrganization as jest.Mock).mockReturnValue({
      user: mockProfile,
      loading: false,
      error: null,
      refetch: jest.fn().mockResolvedValue(undefined),
    });

    (updateUser as jest.Mock).mockResolvedValue(undefined);
  });

  it('renders loading state', () => {
    (useFetchOrganization as jest.Mock).mockReturnValue({
      user: null,
      loading: true,
      error: null,
      refetch: jest.fn(),
    });
    render(<EditProfilePage />);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('renders error message', () => {
    const error = 'Failed to load';
    (useFetchOrganization as jest.Mock).mockReturnValue({
      user: null,
      loading: false,
      error,
      refetch: jest.fn(),
    });
    render(<EditProfilePage />);
    expect(screen.getByText(error)).toBeInTheDocument();
  });

  it('submits form and navigates on success', async () => {
    render(<EditProfilePage />);

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'updated@example.com' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Save/i }));

    await waitFor(() => {
      expect(updateUser).toHaveBeenCalled();
      expect(mockRouter.push).toHaveBeenCalledWith('/profile');
    });
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

    const toggleButton = screen.getByRole('button', { name: /Show password/i });
    const passwordInput = screen.getByPlaceholderText(/password/i);

    expect(passwordInput).toHaveAttribute('type', 'password');
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
  });
});