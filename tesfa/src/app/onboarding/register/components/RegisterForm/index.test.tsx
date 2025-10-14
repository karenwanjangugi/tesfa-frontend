jest.mock('react', () => {
  const actual = jest.requireActual('react');
  return {
    ...actual,
    use: (arg: any) => arg,
  };
});

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import useRegister from '@/app/hooks/useRegister';
import RegisterForm from '.';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/app/hooks/useRegister', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('react-icons/fi', () => ({
  FiEye: () => <span>👁️</span>,
  FiEyeOff: () => <span>🙈</span>,
}));

describe('RegisterForm', () => {
  const mockPush = jest.fn();
  const mockRegister = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useRegister as jest.Mock).mockReturnValue({
      register: mockRegister,
      loading: false,
      error: null,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderForm = (searchParams: { agreed?: string } = {}) => {
    return render(<RegisterForm searchParams={searchParams as any} />);
  };

  it('renders form with all fields', () => {
    renderForm();

    expect(screen.getByLabelText('Organization name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm password')).toBeInTheDocument(); 
    expect(screen.getByLabelText(/I agree to the/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign up/i })).toBeInTheDocument();
  });

  it('pre-checks terms checkbox when searchParams.agreed=true', () => {
    renderForm({ agreed: 'true' });

    const checkbox = screen.getByLabelText(/I agree to the/i);
    expect(checkbox).toBeChecked();
  });

  it('validates organization name (only numbers = invalid)', async () => {
    renderForm();

    const orgInput = screen.getByLabelText('Organization name');
    fireEvent.change(orgInput, { target: { name: 'organization', value: '12345' } });

    expect(await screen.findByText(/can't contain only numbers/i)).toBeInTheDocument();
  });

  it('validates password length (<8 chars)', async () => {
    renderForm();

    const passwordInput = screen.getByLabelText('Password');
    fireEvent.change(passwordInput, { target: { name: 'password', value: '1234567' } });

    expect(await screen.findByText(/at least 8 characters/i)).toBeInTheDocument();
  });

  it('validates password match', async () => {
    renderForm();

    const passwordInput = screen.getByLabelText('Password');
    const confirmInput = screen.getByLabelText('Confirm password'); 

    fireEvent.change(passwordInput, { target: { name: 'password', value: 'password123' } });
    fireEvent.change(confirmInput, { target: { name: 'confirmPassword', value: 'mismatch' } });

    expect(await screen.findByText(/passwords must match/i)).toBeInTheDocument();
  });

  it('submits form successfully and redirects', async () => {
    mockRegister.mockResolvedValue(true);

    renderForm();

    const checkbox = screen.getByLabelText(/I agree to the/i);
    fireEvent.click(checkbox);

    fireEvent.change(screen.getByLabelText('Organization name'), {
      target: { name: 'organization', value: 'MyOrg' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { name: 'email', value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { name: 'password', value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText('Confirm password'), {
      target: { name: 'confirmPassword', value: 'password123' },
    });

    fireEvent.submit(screen.getByRole('button', { name: /Sign up/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        org_name: 'MyOrg',
        email: 'test@example.com',
        password: 'password123',
        password2: 'password123',
        role: 'organization',
      });
      expect(mockPush).toHaveBeenCalledWith('/onboarding/login');
    });
  });

  it('does not submit if terms are not accepted', () => {
    renderForm();

    fireEvent.change(screen.getByLabelText('Organization name'), {
      target: { name: 'organization', value: 'MyOrg' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { name: 'email', value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { name: 'password', value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText('Confirm password'), {
      target: { name: 'confirmPassword', value: 'password123' },
    });

    fireEvent.submit(screen.getByRole('button', { name: /Sign up/i }));

    expect(mockRegister).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });
});