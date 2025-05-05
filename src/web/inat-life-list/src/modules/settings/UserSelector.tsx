import React, { useEffect, useState } from 'react';
import User from './User.ts';

const fetchUsers = async (query: string): Promise<User[]> => {
    const url = new URL('https://api.inaturalist.org/v1/users/autocomplete');
    url.searchParams.set('q', query);
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`Failed to fetch user with query "${query}"`);
    const json = await res.json();
    return json.results.map((p: User) => ({
        id: p.id,
        login: p.login,
        name: p.name,
        icon: p.icon,
        icon_url: p.icon_url,
    }));
};

export const UserSelector: React.FC<{
    user: User | undefined;
    setUser: (User: User) => void;
}> = ({ user, setUser }) => {
    const [userQuery, setUserQuery] = useState(user?.login ?? '');
    const [UserResults, setUserResults] = useState<User[]>([]);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        if (userQuery.trim().length === 0) return;
        const timeoutId = setTimeout(() => {
            fetchUsers(userQuery).then(setUserResults).catch(console.error);
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [userQuery]);

    return (
        <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                User:
            </label>
            <input
                type="text"
                value={userQuery}
                placeholder={'Search for a user...'}
                onChange={(e) => setUserQuery(e.target.value)}
                onFocus={() => setShowResults(true)}
                onBlur={() => {
                    setTimeout(() => setShowResults(false), 200);
                }}
                style={{
                    width: '90%',
                    padding: '0.5rem ',
                    background: '#f5f5f5',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                }}
            />
            {showResults && (
                <div style={{ padding: '.25em' }}>
                    <ul
                        style={{
                            maxHeight: '150px',
                            overflowY: 'auto',
                            listStyle: 'none',
                            padding: 0,
                            marginTop: '0.5rem',
                        }}
                    >
                        {UserResults.map((User) => (
                            <li
                                key={User.id}
                                style={{
                                    cursor: 'pointer',
                                    padding: '0.25rem 0',
                                }}
                                onClick={() => {
                                    setUser(User);
                                    setUserQuery(User.login);
                                    setUserResults([]);
                                }}
                            >
                                → {User.login} ({User.name})
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default UserSelector;
