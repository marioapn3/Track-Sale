// src/hooks/useFetch.ts
import { useState, useEffect } from "react";

type FetchResult<T> = {
    data: T | null;
    loading: boolean;
    error: string | null;
};

export const useFetch = <T = any>(fetchFunction: () => Promise<T>): FetchResult<T> => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await fetchFunction();
                setData(result);
            } catch (err: any) {
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [fetchFunction]);

    return { data, loading, error };
};
