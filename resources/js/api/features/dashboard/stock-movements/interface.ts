import type { PaginationResponse } from "../../../../components/tables/ProTables/ProTable";

export interface Product {
    id: number;
    name: string;
    sku: string;
    stock: number;
    price: number;
    image: string | null;
    slug: string;
    unit: string;
    is_active: boolean;
    brand: string | null;
    description: string | null;
    created_at: string;
    updated_at: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
}

export interface StockMovement {
    id: number;
    product_id: number;
    type: "IN" | "OUT" | "ADJUST";
    quantity: number;
    source: string | null;
    reference: string | null;
    user_id: number | null;
    created_at: string;
    updated_at: string;
    product?: Product;
    user?: User | null;
}

export type StockMovementPaginationResponse = PaginationResponse<StockMovement>;

export interface StockMovementsByProductResponse {
    product: Product;
    stock_movements: StockMovementPaginationResponse;
}





