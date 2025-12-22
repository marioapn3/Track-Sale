import { Sales, SalesPaginationResponse } from "./interface";

export const getSales = async (page: number = 1, perPage: number = 15, search?: string) => {
    const url = new URL(`/api/v1/sales`, window.location.origin);
    url.searchParams.set("page", page.toString());
    url.searchParams.set("per_page", perPage.toString());

    if (search && search.trim()) {
        url.searchParams.set("search", search.trim());
    }

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error("Failed to fetch sales");
    return res.json() as Promise<SalesPaginationResponse>;
};

export interface CreateSalesPayload {
    name: string;
    email: string;
    password: string;
}

export interface UpdateSalesPayload {
    name: string;
    email: string;
    password?: string;
}

export const createSales = async (payload: CreateSalesPayload): Promise<Sales> => {
    const res = await fetch(`/api/v1/sales`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify(payload),
    });

    const response = await res.json();

    if (!res.ok) {
        // Handle validation errors
        if (response.errors) {
            const errorMessages = Object.values(response.errors).flat();
            throw new Error(errorMessages.join(", ") || "Validation failed");
        }
        throw new Error(response.message || "Failed to create sales");
    }

    return response.data;
};

export const updateSales = async (id: number, payload: UpdateSalesPayload): Promise<Sales> => {
    const res = await fetch(`/api/v1/sales/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify(payload),
    });

    const response = await res.json();

    if (!res.ok) {
        // Handle validation errors
        if (response.errors) {
            const errorMessages = Object.values(response.errors).flat();
            throw new Error(errorMessages.join(", ") || "Validation failed");
        }
        throw new Error(response.message || "Failed to update sales");
    }

    return response.data;
};

export const deleteSales = async (id: number): Promise<void> => {
    const res = await fetch(`/api/v1/sales/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-Requested-With": "XMLHttpRequest",
        },
    });

    const response = await res.json();

    if (!res.ok) {
        throw new Error(response.message || "Failed to delete sales");
    }
};

export const getSalesById = async (id: number): Promise<Sales> => {
    const res = await fetch(`/api/v1/sales/${id}`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "X-Requested-With": "XMLHttpRequest",
        },
    });

    const response = await res.json();

    if (!res.ok) {
        throw new Error(response.message || "Failed to fetch sales");
    }

    return response.data;
};

export const getAllSales = async (): Promise<Sales[]> => {
    const res = await fetch(`/api/v1/sales/all`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "X-Requested-With": "XMLHttpRequest",
        },
    });

    const response = await res.json();

    if (!res.ok) {
        throw new Error(response.message || "Failed to fetch sales");
    }

    return response.data;
};

