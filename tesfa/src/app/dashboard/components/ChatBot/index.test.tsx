import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatWidget from './index';
import * as useQueryLogModule from '../../../hooks/useQueryLog';

jest.mock('../../../hooks/useQueryLog');
const mockedUseQueryLog = useQueryLogModule.useQueryLog as jest.Mock;

describe('ChatWidget', () => {
  const submitQueryMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseQueryLog.mockReturnValue({
      logs: [],
      loading: false,
      error: null,
      submitQuery: submitQueryMock,
      refetch: jest.fn(),
      setLogs: jest.fn(),
    });
  });

  test('should send a message and display bot response', async () => {
    submitQueryMock.mockResolvedValueOnce({ response: 'Bot response' });

    render(<ChatWidget />);
    fireEvent.click(screen.getByLabelText(/open chat/i));

    const input = screen.getByLabelText(/chat input/i);
    const sendButton = screen.getByLabelText(/send message/i);

    fireEvent.change(input, { target: { value: 'Hello' } });
    expect(sendButton).not.toBeDisabled();

    fireEvent.click(sendButton);

    const dots = await screen.findAllByText('.', { selector: '.dot' });
    expect(dots.length).toBeGreaterThan(0);
    const responseText = await screen.findByText('Bot response');
    expect(responseText).toBeInTheDocument();
  });

  test('should handle submitQuery failure gracefully', async () => {
    submitQueryMock.mockRejectedValueOnce(new Error('Failed to load response'));

    render(<ChatWidget />);
    fireEvent.click(screen.getByLabelText(/open chat/i));

    const input = screen.getByLabelText(/chat input/i);
    const sendButton = screen.getByLabelText(/send message/i);

    fireEvent.change(input, { target: { value: 'Hi' } });
    fireEvent.click(sendButton);

    const dots = await screen.findAllByText('.', { selector: '.dot' });
    expect(dots.length).toBeGreaterThan(0);

    const errorText = await screen.findByText('Failed to load response');
    expect(errorText).toBeInTheDocument();
  });
});
