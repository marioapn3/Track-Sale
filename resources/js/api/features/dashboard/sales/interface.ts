import type { PaginationResponse } from "../../../../components/tables/ProTables/ProTable";

export interface Sales {
    id: number;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
}

export type SalesPaginationResponse = PaginationResponse<Sales>;





