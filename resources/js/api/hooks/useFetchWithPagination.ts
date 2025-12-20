import { useState, useEffect, useCallback } from "react";
import { usePage } from "@inertiajs/react";

type FetchResult<T> = {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
};

export const useFetchWithPagination = <T = any>(
    fetchFunction: (page?: number, perPage?: number, search?: string) => Promise<T>,
    options?: {
        perPage?: number;
        preserveState?: boolean;
    }
): FetchResult<T> => {
    const { url } = usePage();
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getPageFromUrl = useCallback(() => {
        const urlObj = new URL(window.location.href);
        return parseInt(urlObj.searchParams.get("page") || "1", 10);
    }, []);

    const getSearchFromUrl = useCallback(() => {
        const urlObj = new URL(window.location.href);
        return urlObj.searchParams.get("search") || undefined;
    }, []);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const page = getPageFromUrl();
            const perPage = options?.perPage || 15;
            const search = getSearchFromUrl();
            const result = await fetchFunction(page, perPage, search);
            setData(result);
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }, [fetchFunction, getPageFromUrl, getSearchFromUrl, options?.perPage]);

    useEffect(() => {
        fetchData();
    }, [url, fetchData]);

    return { data, loading, error, refetch: fetchData };
};

