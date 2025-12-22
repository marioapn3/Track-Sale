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

export type ProductPaginationResponse = PaginationResponse<Product>;

