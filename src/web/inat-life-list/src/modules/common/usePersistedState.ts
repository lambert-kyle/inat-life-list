import React from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Custom hook to manage a state that is persisted in both local storage and URL query parameters.
 * @param key - The key to store the value in local storage and URL query parameters.
 * @param defaultValue - The default value to use if no value is found in local storage or URL query parameters.
 */
export const usePersistedState = <T>(
    key: string,
    defaultValue?: T
): [T, React.Dispatch<React.SetStateAction<T>>] => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Get the initial value from the query param, local storage, or default value
    const getInitialValue = React.useCallback((): T => {
        const queryValue = searchParams.get(key);
        if (queryValue !== null) {
            try {
                return JSON.parse(queryValue) as T;
            } catch {
                console.warn(`Failed to parse query param for key "${key}"`);
            }
        }

        const localStorageValue = localStorage.getItem(key);
        if (localStorageValue !== null) {
            try {
                return JSON.parse(localStorageValue) as T;
            } catch {
                console.warn(
                    `Failed to parse local storage value for key "${key}"`
                );
            }
        }

        return defaultValue as T;
    }, [key, searchParams, defaultValue]);

    const [state, setState] = React.useState<T>(getInitialValue);

    // Sync state, query param, and local storage on initial load
    React.useEffect(() => {
        const initialValue = getInitialValue();
        if (initialValue === undefined) return;

        // sync query param with the initial value
        const queryValue = searchParams.get(key);
        if (
            queryValue === null ||
            queryValue !== JSON.stringify(initialValue)
        ) {
            searchParams.set(key, JSON.stringify(initialValue));
            setSearchParams(searchParams);
        }

        // sync local storage with the initial value
        const localStorageValue = localStorage.getItem(key);
        if (
            localStorageValue === null ||
            localStorageValue !== JSON.stringify(initialValue)
        ) {
            localStorage.setItem(key, JSON.stringify(initialValue));
        }
    }, [key, searchParams, setSearchParams, getInitialValue]);

    // Watch state and update query params and local storage when it changes
    React.useEffect(() => {
        if (state === undefined) return;

        // Update query param
        const queryValue = searchParams.get(key);
        if (queryValue === null || queryValue !== JSON.stringify(state)) {
            const newSearchParams = new URLSearchParams(searchParams);
            newSearchParams.set(key, JSON.stringify(state));
            setSearchParams(newSearchParams);
        }

        // Update local storage
        const localStorageValue = localStorage.getItem(key);
        if (
            localStorageValue === null ||
            localStorageValue !== JSON.stringify(state)
        ) {
            localStorage.setItem(key, JSON.stringify(state));
        }
    }, [state, key, searchParams, setSearchParams]);

    return [state, setState];
};

export default usePersistedState;
