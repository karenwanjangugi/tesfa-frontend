import { renderHook, waitFor, act } from '@testing-library/react';
import useFetchOrganizations from './useFetchOrganizations';
import * as fetchOrganizations from '../utils/fetchOrganizations';
import { User } from '../utils/type';

jest.mock('../utils/fetchOrganizations', () => ({
    fetchUsers: jest.fn(),
}));


const mockUsers: User[] = [
    {
        id: 1,
        email: 'org1@example.com',
        role: 'organization',
        org_name: 'Org 1',
        logo_image: null,
        is_active: true,
        is_staff: false,
        is_superuser: false,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
    },
    {
        id: 2,
        email: 'org2@example.com',
        role: 'organization',
        org_name: 'Org 2',
        logo_image: null,
        is_active: true,
        is_staff: false,
        is_superuser: false,
        created_at: '2024-01-02T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
    },
];

describe('useFetchOrganizations', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch organizations data successfully', async () => {
        (fetchOrganizations.fetchUsers as jest.Mock).mockResolvedValue(mockUsers);

        const { result } = renderHook(() => useFetchOrganizations());

        expect(result.current.loading).toBe(true);
        expect(result.current.organizations).toEqual([]);
        expect(result.current.error).toBe(null);

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.organizations).toEqual(mockUsers);
        expect(result.current.error).toBe(null);
        expect(fetchOrganizations.fetchUsers).toHaveBeenCalledTimes(1);
    });

    it('should handle error when fetching organizations data', async () => {
        const errorMessage = 'Failed to fetch organizations';
        (fetchOrganizations.fetchUsers as jest.Mock).mockRejectedValue(new Error(errorMessage));

        const { result } = renderHook(() => useFetchOrganizations());

        expect(result.current.loading).toBe(true);
        expect(result.current.organizations).toEqual([]);
        expect(result.current.error).toBe(null);

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.organizations).toEqual([]);
        expect(result.current.error).toBe(errorMessage);
        expect(fetchOrganizations.fetchUsers).toHaveBeenCalledTimes(1);
    });

    it('should refetch organizations data', async () => {
        const mockUsers1: User[] = [mockUsers[0]];
        const mockUsers2: User[] = [mockUsers[1]];

        (fetchOrganizations.fetchUsers as jest.Mock)
            .mockResolvedValueOnce(mockUsers1)
            .mockResolvedValueOnce(mockUsers2);

        const { result } = renderHook(() => useFetchOrganizations());

        await waitFor(() => expect(result.current.loading).toBe(false));
        expect(result.current.organizations).toEqual(mockUsers1);

        await act(async () => {
          result.current.refetch();
        });

        await waitFor(() => expect(result.current.loading).toBe(false));
        expect(result.current.organizations).toEqual(mockUsers2);
        expect(fetchOrganizations.fetchUsers).toHaveBeenCalledTimes(2);
    });
});
