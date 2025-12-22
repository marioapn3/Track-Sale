import { Product, ProductPaginationResponse } from "./interface";

export const getProducts = async (page: number = 1, perPage: number = 15, search?: string) => {
    const url = new URL(`/api/v1/product`, window.location.origin);
    url.searchParams.set("page", page.toString());
    url.searchParams.set("per_page", perPage.toString());

    if (search && search.trim()) {
        url.searchParams.set("search", search.trim());
    }

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json() as Promise<ProductPaginationResponse>;
};

export interface CreateProductPayload {
    name: string;
    sku: string;
    stock: number;
    price: number;
    image?: File | null;
    unit: string;
    is_active?: boolean;
    brand?: string | null;
    description?: string | null;
}

export interface UpdateProductPayload {
    name: string;
    sku: string;
    stock: number;
    price: number;
    image?: File | null;
    unit: string;
    is_active?: boolean;
    brand?: string | null;
    description?: string | null;
}

export const createProduct = async (payload: CreateProductPayload): Promise<Product> => {
    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("sku", payload.sku);
    formData.append("stock", payload.stock.toString());
    formData.append("price", payload.price.toString());
    formData.append("unit", payload.unit);
    formData.append("is_active", payload.is_active !== undefined ? payload.is_active.toString() : "true");

    if (payload.image) {
        formData.append("image", payload.image);
    }

    if (payload.brand) {
        formData.append("brand", payload.brand);
    }

    if (payload.description) {
        formData.append("description", payload.description);
    }

    const res = await fetch(`/api/v1/product`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "X-Requested-With": "XMLHttpRequest",
        },
        body: formData,
    });

    const response = await res.json();

    if (!res.ok) {
        // Handle validation errors
        if (response.errors) {
            const errorMessages = Object.values(response.errors).flat();
            throw new Error(errorMessages.join(", ") || "Validation failed");
        }
        throw new Error(response.message || "Failed to create product");
    }

    return response.data;
};

export const updateProduct = async (id: number, payload: UpdateProductPayload): Promise<Product> => {
    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("sku", payload.sku);
    formData.append("stock", payload.stock.toString());
    formData.append("price", payload.price.toString());
    formData.append("unit", payload.unit);
    formData.append("is_active", payload.is_active !== undefined ? payload.is_active.toString() : "true");
    formData.append("_method", "PUT");

    if (payload.image) {
        formData.append("image", payload.image);
    }

    if (payload.brand !== undefined) {
        formData.append("brand", payload.brand || "");
    }

    if (payload.description !== undefined) {
        formData.append("description", payload.description || "");
    }

    const res = await fetch(`/api/v1/product/${id}`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "X-Requested-With": "XMLHttpRequest",
        },
        body: formData,
    });

    const response = await res.json();

    if (!res.ok) {
        // Handle validation errors
        if (response.errors) {
            const errorMessages = Object.values(response.errors).flat();
            throw new Error(errorMessages.join(", ") || "Validation failed");
        }
        throw new Error(response.message || "Failed to update product");
    }

    return response.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
    const res = await fetch(`/api/v1/product/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-Requested-With": "XMLHttpRequest",
        },
    });

    const response = await res.json();

    if (!res.ok) {
        throw new Error(response.message || "Failed to delete product");
    }
};

export const getProductById = async (id: number): Promise<Product> => {
    const res = await fetch(`/api/v1/product/${id}`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "X-Requested-With": "XMLHttpRequest",
        },
    });

    const response = await res.json();

    if (!res.ok) {
        throw new Error(response.message || "Failed to fetch product");
    }

    return response.data;
};

export const getAllProducts = async (): Promise<Product[]> => {
    const res = await fetch(`/api/v1/product/all`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "X-Requested-With": "XMLHttpRequest",
        },
    });

    const response = await res.json();

    if (!res.ok) {
        throw new Error(response.message || "Failed to fetch products");
    }

    return response.data;
};

