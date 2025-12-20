<?php

namespace App\Modules\Base\DTOs;

use App\Modules\Base\Requests\PaginationRequest;

class PaginationDTO
{
    private function __construct(
        public readonly int $page,
        public readonly int $per_page,
        public readonly string $search,
        public readonly string $sort,
        public readonly string $sort_by,
        public readonly string $sort_direction,
    ) {}

    public static function fromRequest(
        PaginationRequest $request
    ): self {
        return new self(
            page: $request->page ?? 1,
            per_page: $request->per_page ?? 10,
            search: $request->search ?? '',
            sort: $request->sort ?? '',
            sort_by: $request->sort_by ?? '',
            sort_direction: $request->sort_direction ?? '',
        );
    }
}
