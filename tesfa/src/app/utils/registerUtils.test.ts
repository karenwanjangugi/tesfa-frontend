import { fetchRegister } from "./registerUtils"; 

global.fetch = jest.fn();

describe('fetchRegister', () => {
  const userData = {
    email: 'newuser@example.com',
    password: 'password123',
    name: 'New User',
  };

  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('should register successfully and return response data', async () => {
    const mockResponseText = JSON.stringify({
      user_id: 101,
      email: 'newuser@example.com',
      message: 'Registration successful',
    });

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      text: async () => mockResponseText,
    });

    const result = await fetchRegister(userData);

    expect(result).toEqual({
      user_id: 101,
      email: 'newuser@example.com',
      message: 'Registration successful',
    });
  });

  it('should format password length error with custom message', async () => {
    const errorResponse = {
      password: ['This password must contain at least 8 characters.'],
    };
    const mockResponseText = JSON.stringify(errorResponse);

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      text: async () => mockResponseText,
    });

    await expect(fetchRegister(userData)).rejects.toThrow(
      'Password must be at least 8 characters long.'
    );
  });

  it('should format email already exists error', async () => {
    const errorResponse = {
      email: ['user with this email already exists.'],
    };
    const mockResponseText = JSON.stringify(errorResponse);

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      text: async () => mockResponseText,
    });

    await expect(fetchRegister(userData)).rejects.toThrow('Email already exists.');
  });

  it('should handle generic field error with capitalized field name', async () => {
    const errorResponse = {
      name: ['This field is required.'],
    };
    const mockResponseText = JSON.stringify(errorResponse);

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      text: async () => mockResponseText,
    });

    await expect(fetchRegister(userData)).rejects.toThrow('Name: This field is required.');
  });

  it('should handle multiple field errors', async () => {
    const errorResponse = {
      email: ['Enter a valid email address.'],
      password: ['Password too short.'],
    };
    const mockResponseText = JSON.stringify(errorResponse);

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      text: async () => mockResponseText,
    });

    await expect(fetchRegister(userData)).rejects.toThrow(
      'Email: Enter a valid email address.\nPassword: Password too short.'
    );
  });

  it('should handle "detail" error', async () => {
    const mockResponseText = JSON.stringify({ detail: 'Registration closed.' });

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      text: async () => mockResponseText,
    });

    await expect(fetchRegister(userData)).rejects.toThrow('Registration closed.');
  });

  it('should handle "non_field_errors"', async () => {
    const mockResponseText = JSON.stringify({
      non_field_errors: ['Terms of service must be accepted.'],
    });

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      text: async () => mockResponseText,
    });

    await expect(fetchRegister(userData)).rejects.toThrow('Terms of service must be accepted.');
  });

  it('should handle plain text error response', async () => {
    const plainTextError = 'Bad Request';

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      text: async () => plainTextError,
    });

    await expect(fetchRegister(userData)).rejects.toThrow('Bad Request');
  });

  it('should handle network error', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network timeout'));

    await expect(fetchRegister(userData)).rejects.toThrow('Network timeout');
  });
});