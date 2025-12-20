<?php

namespace App\Modules\RolePermission\DTOs;

use App\Modules\RolePermission\Requests\RoleRequest;

class RoleDTO
{
    private function __construct(
        public readonly string $name,
    ) {}

    public static function fromRequest(
        RoleRequest $request
    ): self {
        return new self(
            name: $request->name,
        );
    }
}
