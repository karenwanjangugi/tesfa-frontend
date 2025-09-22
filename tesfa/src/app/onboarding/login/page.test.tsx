

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import LoginPage from './page';
import { fetchLogin } from '../../../app/utils/loginUtils'; 


jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));


jest.mock('../../../app/utils/loginUtils', () => ({
  fetchLogin: jest.fn(),
}));


jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    const { src, alt, width, height, ...rest } = props;
    return `<img src="${src}" alt="${alt || 'Mocked Image'}" width="${width || 'auto'}" height="${height || 'auto'}" />`;
  },
}));

describe('LoginPage', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (fetchLogin as jest.Mock).mockResolvedValue({
      token: 'fake-jwt-token',
      user: { id: 1, email: 'test@ngo.org' },
    });
  });

  it('should render login form with all fields', () => {
    render(<LoginPage />);

    expect(screen.getByText(/Welcome Back!/i)).toBeInTheDocument();
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
  });

  it('should toggle password visibility when eye icon is clicked', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    const passwordInput = screen.getByLabelText(/^Password$/i) as HTMLInputElement;

    expect(passwordInput).toHaveAttribute('type', 'password');

    const showPasswordBtn = screen.getByRole('button', {
      name: /Show password/i,
    });
    await user.click(showPasswordBtn);

    expect(passwordInput).toHaveAttribute('type', 'text');

    await user.click(showPasswordBtn);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('should submit form and redirect on success', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText(/Email/i), 'test@ngo.org');
    await user.type(screen.getByLabelText(/^Password$/i), 'secure123');

    const submitButton = screen.getByRole('button', { name: /Sign in/i });
    await user.click(submitButton);

    expect(fetchLogin).toHaveBeenCalledWith({
      email: 'test@ngo.org',
      password: 'secure123',
    });

    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });


  it('should disable button and show loading text during submission', async () => {
    const user = userEvent.setup();
  
    (fetchLogin as jest.Mock).mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ token: 'fake' }), 100)));

    render(<LoginPage />);

    await user.type(screen.getByLabelText(/Email/i), 'test@ngo.org');
    await user.type(screen.getByLabelText(/^Password$/i), 'secure123');

    const submitButton = screen.getByRole('button', { name: /Sign in/i });
    await user.click(submitButton);

   
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent(/Signing in.../i);
  });


  it('should display error message if login fails', async () => {
    const user = userEvent.setup();
    (fetchLogin as jest.Mock).mockRejectedValue(new Error('Invalid credentials'));

    render(<LoginPage />);

    await user.type(screen.getByLabelText(/Email/i), 'test@ngo.org');
    await user.type(screen.getByLabelText(/^Password$/i), 'wrongpassword');

    const submitButton = screen.getByRole('button', { name: /Sign in/i });
    await user.click(submitButton);

  
    expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
  });
});