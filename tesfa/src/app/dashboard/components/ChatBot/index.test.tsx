

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatWidget from './index'; 
import { useQueryLog } from '../../../hooks/useQueryLog';

jest.mock('../../../hooks/useQueryLog', () => ({
  useQueryLog: jest.fn(),
}));

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

jest.mock('lucide-react', () => ({
  Send: () => <div data-testid="send-icon" />,
  MessageCircle: () => <div data-testid="message-circle-icon" />,
}));

describe('ChatWidget', () => {
  const mockSubmitQuery = jest.fn();
  const mockLogs = [
    { id: 1, query: 'Hello', response: null },
    { id: 2, query: 'Hello', response: 'Hi there!' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useQueryLog as jest.Mock).mockReturnValue({
      logs: mockLogs,
      submitQuery: mockSubmitQuery,
    });
  });

  it('renders closed widget with toggle button', () => {
    render(<ChatWidget />);
    expect(screen.getByTestId('message-circle-icon')).toBeInTheDocument();
    expect(screen.queryByText('Chat')).not.toBeInTheDocument();
  });

  it('opens chat when toggle button is clicked', async () => {
    const user = userEvent.setup();
    render(<ChatWidget />);

    await user.click(screen.getByTestId('message-circle-icon'));

    expect(screen.getByText('Chat')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Type a message...')).toBeInTheDocument();
  });

  it('closes chat when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<ChatWidget />);

    await user.click(screen.getByTestId('message-circle-icon'));
    await user.click(screen.getByText('✕'));

    expect(screen.queryByText('Chat')).not.toBeInTheDocument();
  });

  it('sends message on Enter key press', async () => {
    const user = userEvent.setup();
    render(<ChatWidget />);

    await user.click(screen.getByTestId('message-circle-icon'));

    const input = screen.getByPlaceholderText('Type a message...');
    await user.type(input, 'Hello world');
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(mockSubmitQuery).toHaveBeenCalledWith('Hello world');
      expect(input).toHaveValue(''); 
    });
  });

  it('sends message on Send button click', async () => {
    const user = userEvent.setup();
    render(<ChatWidget />);

    await user.click(screen.getByTestId('message-circle-icon'));

    const input = screen.getByPlaceholderText('Type a message...');
    await user.type(input, 'Hello again');
    await user.click(screen.getByLabelText('Send message'));

    await waitFor(() => {
      expect(mockSubmitQuery).toHaveBeenCalledWith('Hello again');
      expect(input).toHaveValue('');
    });
  });

  it('does not send empty message', async () => {
    const user = userEvent.setup();
    render(<ChatWidget />);

    await user.click(screen.getByTestId('message-circle-icon'));

    const input = screen.getByPlaceholderText('Type a message...');
    await user.type(input, '   ');
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(mockSubmitQuery).not.toHaveBeenCalled();
  });

  it('renders user and bot messages correctly', async () => {
    render(<ChatWidget />);

    await userEvent.click(screen.getByTestId('message-circle-icon'));
    await waitFor(() => {
      expect(screen.getAllByText('Hello')).toHaveLength(1); 
      expect(screen.getByText('Hi there!')).toBeInTheDocument();
    });
    const input = screen.getByPlaceholderText('Type a message...');
    await userEvent.type(input, 'New message');
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(screen.getAllByText('New message')).toHaveLength(1);
    });
    const userMessages = screen.getAllByText('New message');
    userMessages.forEach((msg) => {
      const container = msg.closest('div')?.parentElement;
      expect(container).toHaveClass('justify-end');
    });

    const botMessages = screen.getAllByText('Hi there!');
    botMessages.forEach((msg) => {
      const container = msg.closest('div')?.parentElement;
      expect(container).toHaveClass('justify-start');
    });
  });

  it('deduplicates user messages from logs and local state', async () => {
    const user = userEvent.setup();
    render(<ChatWidget />);

    await user.click(screen.getByTestId('message-circle-icon'));

    const input = screen.getByPlaceholderText('Type a message...');
    await user.type(input, 'Hello'); 
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    await waitFor(() => {
      expect(screen.getAllByText('Hello')).toHaveLength(1);
    });
  });

  it('disables send button when input is empty', async () => {
    render(<ChatWidget />);

    await userEvent.click(screen.getByTestId('message-circle-icon'));

    const sendButton = screen.getByLabelText('Send message');
    expect(sendButton).toBeDisabled();

    const input = screen.getByPlaceholderText('Type a message...');
    await userEvent.type(input, 'a');
    expect(sendButton).not.toBeDisabled();
  });

  it('logs error if submitQuery fails', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    mockSubmitQuery.mockRejectedValueOnce(new Error('Network error'));

    const user = userEvent.setup();
    render(<ChatWidget />);

    await user.click(screen.getByTestId('message-circle-icon'));

    const input = screen.getByPlaceholderText('Type a message...');
    await user.type(input, 'Failing message');
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Failed to send message:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });
});