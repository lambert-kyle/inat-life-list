import User from './User.ts';
import { useQuery } from '@tanstack/react-query';

async function fetchUserById(
    userId: number | undefined
): Promise<User | undefined> {
    if (!userId) return undefined;
    const response = await fetch(
        `https://api.inaturalist.org/v1/users/${userId}`
    );
    if (!response.ok) {
        throw new Error(`Failed to fetch user with id ${userId}`);
    }
    const json = await response.json();
    if (json.total_results === 0) return undefined;
    return json.results.at(0) as User;
}

export const useUser = (userId: number | undefined) => {
    return useQuery<User | undefined, Error>({
        queryKey: ['user', userId],
        queryFn: () => fetchUserById(userId),
        staleTime: 1000 * 60 * 5,
        retry: 1,
    });
};

export default useUser;
