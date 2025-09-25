
import { fetchProfile, updateUser } from './fetchOrganization';

global.fetch = jest.fn();

const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value.toString();
    },
    clear() {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('Profile Service', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    (global.fetch as jest.Mock).mockClear();
  });

  describe('fetchProfile', () => {
    it('fetches profile successfully', async () => {
      mockLocalStorage.setItem('Token', 'abc123');
      mockLocalStorage.setItem('user_id', '42');

      const mockResponse = { id: 42, name: 'Acme Inc' };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await fetchProfile();

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith('/api/organization?userId=42', {
        headers: { Authorization: 'Token abc123' },
        cache: 'no-store',
      });
    });

    it('throws error if token is missing', async () => {
      mockLocalStorage.setItem('user_id', '42');
      await expect(fetchProfile()).rejects.toThrow('No token found in localStorage.');
    });

    it('throws error if user_id is missing', async () => {
      mockLocalStorage.setItem('Token', 'abc123');
      await expect(fetchProfile()).rejects.toThrow('No user ID found in localStorage.');
    });

    it('throws error on non-ok response', async () => {
      mockLocalStorage.setItem('Token', 'abc123');
      mockLocalStorage.setItem('user_id', '42');

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        text: () => Promise.resolve('error'),
      });

      await expect(fetchProfile()).rejects.toThrow('Make sure to make changes before saving.');
    });
  });

  describe('updateUser', () => {
    it('updates user with JSON data', async () => {
      mockLocalStorage.setItem('Token', 'xyz789');
      mockLocalStorage.setItem('user_id', '100');

      const mockResponse = { id: 100, name: 'Updated Org' };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const data = { name: 'Updated Org' };
      const result = await updateUser(data);

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith('/api/organization?userId=100', {
        method: 'PUT',
        headers: {
          Authorization: 'Token xyz789',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        cache: 'no-store',
      });
    });

    it('updates user with FormData', async () => {
      mockLocalStorage.setItem('Token', 'xyz789');
      mockLocalStorage.setItem('user_id', '100');

      const formData = new FormData();
      formData.append('logo', 'file.jpg');

      const mockResponse = { success: true };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await updateUser(formData);

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith('/api/organization?userId=100', {
        method: 'PUT',
        headers: {
          Authorization: 'Token xyz789',
        },
        body: formData,
        cache: 'no-store',
      });
    });

    it('throws error if token is missing', async () => {
      mockLocalStorage.setItem('user_id', '100');
      await expect(updateUser({})).rejects.toThrow('No token found in localStorage.');
    });

    it('throws error on non-ok response', async () => {
      mockLocalStorage.setItem('Token', 'xyz789');
      mockLocalStorage.setItem('user_id', '100');

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        text: () => Promise.resolve('error'),
      });

      await expect(updateUser({ name: 'Test' })).rejects.toThrow(
        'Make sure to make changes before saving.'
      );
    });
  });
});