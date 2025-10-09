import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterPage from './page';
import { fetchRegister } from '../../utils/registerUtils';

jest.mock('../../utils/registerUtils', () => ({
  fetchRegister: jest.fn(),
}));

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => new URLSearchParams(),
}));

describe('RegisterPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render registration form', () => {
    render(<RegisterPage />);
    expect(screen.getByLabelText(/organization name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^confirm password$/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/I agree to the Terms and Conditions/i)).toBeInTheDocument();
  });

  it('should submit form and redirect to login on success', async () => {
    (fetchRegister as jest.Mock).mockResolvedValueOnce({ message: 'Registration successful' });

    render(<RegisterPage />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/organization name/i), 'TestNGO');
    await user.type(screen.getByLabelText(/email/i), 'test@ngo.org');
    await user.type(screen.getByLabelText(/^password$/i), 'secure123');
    await user.type(screen.getByLabelText(/^confirm password$/i), 'secure123');
    await user.click(screen.getByLabelText(/I agree to the Terms and Conditions/i));

    await user.click(screen.getByRole('button', { name: /sign up/i }));

    expect(fetchRegister).toHaveBeenCalledWith({
      org_name: 'TestNGO',
      email: 'test@ngo.org',
      password: 'secure123',
      password2: 'secure123',
      role: 'organization',
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/onboarding/login');
    });
  });

  it('should display error message when registration fails', async () => {
    (fetchRegister as jest.Mock).mockRejectedValueOnce({ message: 'Email already exists' });

    render(<RegisterPage />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/organization name/i), 'TestNGO');
    await user.type(screen.getByLabelText(/email/i), 'test@ngo.org');
    await user.type(screen.getByLabelText(/^password$/i), 'secure123');
    await user.type(screen.getByLabelText(/^confirm password$/i), 'secure123');
    await user.click(screen.getByLabelText(/I agree to the Terms and Conditions/i));

    await user.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText(/Email already exists/i)).toBeInTheDocument();
    });
  });

  it('should show validation errors for invalid inputs', async () => {
    render(<RegisterPage />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/organization name/i), '12345');
    await user.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText(/Organization name can't contain only numbers/i)).toBeInTheDocument();
    });

    await user.clear(screen.getByLabelText(/organization name/i));
    await user.type(screen.getByLabelText(/organization name/i), 'ValidOrg');
    await user.clear(screen.getByLabelText(/^password$/i));
    await user.type(screen.getByLabelText(/^password$/i), 'short');
    await user.clear(screen.getByLabelText(/^confirm password$/i));
    await user.type(screen.getByLabelText(/^confirm password$/i), 'short');
    await user.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText(/Password must be at least 8 characters/i)).toBeInTheDocument();
    });

    await user.clear(screen.getByLabelText(/^password$/i));
    await user.clear(screen.getByLabelText(/^confirm password$/i));
    await user.type(screen.getByLabelText(/^password$/i), 'longenough1');
    await user.type(screen.getByLabelText(/^confirm password$/i), 'different2');
    await user.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText(/Passwords must match/i)).toBeInTheDocument();
    });
  });
});