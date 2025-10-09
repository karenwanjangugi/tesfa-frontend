import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProfilePage from './page';

const mockUseFetchOrganization = jest.fn();
const mockUseFetchTaskAssignments = jest.fn();
const mockPush = jest.fn(); 

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }), 
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} alt={props.alt || 'mocked image'} />,
}));

jest.mock('@/app/hooks/useFetchOrganization', () => ({
  __esModule: true,
  default: () => mockUseFetchOrganization(),
}));

jest.mock('@/app/hooks/useFetchTaskAssignment', () => ({
  __esModule: true,
  useFetchTaskAssignments: () => mockUseFetchTaskAssignments(),
}));

jest.mock('../sharedComponents/Layout', () => {
  return ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
});

jest.mock('../sharedComponents/ProtectedRoot', () => {
  return ({ children }: { children: React.ReactNode }) => <>{children}</>;
});

describe('ProfilePage', () => {
  beforeEach(() => {
    jest.clearAllMocks(); 
  });

  it('renders full profile when data is available', async () => {
    const mockProfile = {
      org_name: 'Tech Innovators Inc.',
      email: 'hello@techinnovators.com',
      created_at: '2023-06-10T14:30:00Z',
      logo_image: '/logo.png',
    };

    const mockTasks = [
      { id: 1, status: 'completed' },
      { id: 2, status: 'in_progress' },
      { id: 3, status: 'completed' },
    ];

    mockUseFetchOrganization.mockReturnValue({
      user: mockProfile,
      loading: false,
      error: null,
    });

    mockUseFetchTaskAssignments.mockReturnValue({
      assignedTasks: mockTasks,
    });

    const originalAPIURL = process.env.API_URL;
    process.env.API_URL = 'https://api.example.com';

    render(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByText('hello@techinnovators.com')).toBeInTheDocument();
      expect(screen.getByText('Jun 10, 2023')).toBeInTheDocument();
      expect(screen.getByText('2/3 Tasks')).toBeInTheDocument();
    });

    const img = screen.getByAltText('Organization Logo') as HTMLImageElement;
  
    expect(img.src).toBe('https://api.example.com/logo.png');

    const editButton = screen.getByLabelText('Edit Profile');
    fireEvent.click(editButton);
    expect(mockPush).toHaveBeenCalledWith('/edit-profile');

    process.env.API_URL = originalAPIURL;
  });
});