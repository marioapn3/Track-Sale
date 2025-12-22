<?php

namespace App\Modules\Sales\DTOs;

use App\Modules\Sales\Requests\SalesRequest;

class SalesDTO
{
    private function __construct(
        public readonly string $name,
        public readonly string $email,
        public readonly ?string $password,
    ) {}

    public static function fromRequest(
        SalesRequest $request
    ): self {
        return new self(
            name: $request->name,
            email: $request->email,
            password: $request->password,
        );
    }
}
