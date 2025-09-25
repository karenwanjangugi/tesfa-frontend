
import { renderHook, waitFor, act } from '@testing-library/react';
import useFetchOrganizations from './useFetchOrganizations';
import { fetchUsers } from '../utils/fetchOrganizations';


jest.mock('../utils/fetchOrganizations', () => ({
    fetchUsers: jest.fn(),
}));


const mockUsers = [
    { id: 1, email: 'john@example.com', role: 'admin', org_name: 'Org A' },
    { id: 2, email: 'jane@example.com', role: 'user', org_name: 'Org B' },
];

describe('useFetchOrganizations', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('fetches users successfully on mount', async () => {
        (fetchUsers as jest.Mock).mockResolvedValue(mockUsers);

        const { result } = renderHook(() => useFetchOrganizations());


        expect(result.current.loading).toBe(true);
        expect(result.current.organizations).toEqual([]);
        expect(result.current.error).toBeNull();

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.organizations).toEqual(mockUsers);
        expect(result.current.error).toBeNull();
        expect(fetchUsers).toHaveBeenCalledTimes(1);
    });

    it('handles fetch errors gracefully', async () => {
        const errorMessage = 'Failed to fetch users';
        (fetchUsers as jest.Mock).mockRejectedValue(new Error(errorMessage));

        const { result } = renderHook(() => useFetchOrganizations());

        expect(result.current.loading).toBe(true);

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.organizations).toEqual([]);
        expect(result.current.error).toBe(errorMessage);
        expect(fetchUsers).toHaveBeenCalledTimes(1);
    });

    it('refetches users when refetch is called', async () => {
        (fetchUsers as jest.Mock)
            .mockResolvedValueOnce(mockUsers)
            .mockResolvedValueOnce([...mockUsers, { id: 3, email: 'bob@example.com', role: 'user', org_name: 'Org C' }]);

        const { result } = renderHook(() => useFetchOrganizations());
        await waitFor(() => expect(result.current.loading).toBe(false));
        expect(result.current.organizations).toEqual(mockUsers);


        await act(async () => {
            await result.current.refetch();
        });

        await waitFor(() => expect(result.current.loading).toBe(false));
        expect(result.current.organizations).toHaveLength(3);
        expect(fetchUsers).toHaveBeenCalledTimes(2);
    });
});