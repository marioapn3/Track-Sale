import type { PaginationResponse } from "../../../../components/tables/ProTables/ProTable";

export interface Role {
    id: number
    name: string
    guard_name: string
    created_at: string
    updated_at: string
}

export type RolePaginationResponse = PaginationResponse<Role>
