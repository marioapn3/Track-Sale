import {
    StockMovement,
    StockMovementPaginationResponse,
    StockMovementsByProductResponse,
} from "./interface";

export const getStockMovements = async (
    page: number = 1,
    perPage: number = 15,
    search?: string
) => {
    const url = new URL(`/api/v1/stock-movement`, window.location.origin);
    url.searchParams.set("page", page.toString());
    url.searchParams.set("per_page", perPage.toString());

    if (search && search.trim()) {
        url.searchParams.set("search", search.trim());
    }

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error("Failed to fetch stock movements");
    return res.json() as Promise<StockMovementPaginationResponse>;
};

export const getStockMovementsByProductSlug = async (
    productSlug: string,
    page: number = 1,
    perPage: number = 15,
    search?: string
) => {
    const url = new URL(`/api/v1/stock-movement/product/${productSlug}`, window.location.origin);
    url.searchParams.set("page", page.toString());
    url.searchParams.set("per_page", perPage.toString());

    if (search && search.trim()) {
        url.searchParams.set("search", search.trim());
    }

    const res = await fetch(url.toString(), {
        headers: {
            "Accept": "application/json",
            "X-Requested-With": "XMLHttpRequest",
        },
    });
    if (!res.ok) throw new Error("Failed to fetch stock movements");
    const response = await res.json();
    return response.data as StockMovementsByProductResponse;
};

export interface CreateStockMovementPayload {
    product_id: number;
    type: "IN" | "OUT" | "ADJUST";
    quantity: number;
    source?: string | null;
    reference?: string | null;
    user_id?: number | null;
}

export interface UpdateStockMovementPayload {
    product_id: number;
    type: "IN" | "OUT" | "ADJUST";
    quantity: number;
    source?: string | null;
    reference?: string | null;
    user_id?: number | null;
}

export const createStockMovement = async (
    payload: CreateStockMovementPayload
): Promise<StockMovement> => {
    const res = await fetch(`/api/v1/stock-movement`, {
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
        if (response.errors) {
            const errorMessages = Object.values(response.errors).flat();
            throw new Error(errorMessages.join(", ") || "Validation failed");
        }
        throw new Error(response.message || "Failed to create stock movement");
    }

    return response.data;
};

export const updateStockMovement = async (
    id: number,
    payload: UpdateStockMovementPayload
): Promise<StockMovement> => {
    const res = await fetch(`/api/v1/stock-movement/${id}`, {
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
        if (response.errors) {
            const errorMessages = Object.values(response.errors).flat();
            throw new Error(errorMessages.join(", ") || "Validation failed");
        }
        throw new Error(response.message || "Failed to update stock movement");
    }

    return response.data;
};

export const deleteStockMovement = async (id: number): Promise<void> => {
    const res = await fetch(`/api/v1/stock-movement/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-Requested-With": "XMLHttpRequest",
        },
    });

    const response = await res.json();

    if (!res.ok) {
        throw new Error(response.message || "Failed to delete stock movement");
    }
};

export const getStockMovementById = async (id: number): Promise<StockMovement> => {
    const res = await fetch(`/api/v1/stock-movement/${id}`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "X-Requested-With": "XMLHttpRequest",
        },
    });

    const response = await res.json();

    if (!res.ok) {
        throw new Error(response.message || "Failed to fetch stock movement");
    }

    return response.data;
};

export const getAllStockMovements = async (): Promise<StockMovement[]> => {
    const res = await fetch(`/api/v1/stock-movement/all`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "X-Requested-With": "XMLHttpRequest",
        },
    });

    const response = await res.json();

    if (!res.ok) {
        throw new Error(response.message || "Failed to fetch stock movements");
    }

    return response.data;
};

