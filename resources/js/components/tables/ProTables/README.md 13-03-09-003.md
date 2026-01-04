# ProTable Component

Komponen table reusable dengan pagination untuk aplikasi Laravel + Inertia + React.

## Format Response Data

ProTable mengharapkan response data dalam format berikut:

### Struktur Response

```typescript
{
  data: T[],           // Array data items
  meta: {              // Metadata pagination
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
    path: string;
    first_page_url: string;
    last_page_url: string;
    prev_page_url: string | null;
    next_page_url: string | null;
  },
  links: [             // Links untuk pagination
    {
      url: string | null;
      label: string;
      active: boolean;
    }
  ]
}
```

### Contoh Response JSON

```json
{
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "Admin",
      "status": "active",
      "created_at": "2024-01-15T10:30:00.000000Z"
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane.smith@example.com",
      "role": "User",
      "status": "active",
      "created_at": "2024-01-16T14:20:00.000000Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "from": 1,
    "last_page": 5,
    "per_page": 15,
    "to": 15,
    "total": 67,
    "path": "http://localhost:8000/api/users",
    "first_page_url": "http://localhost:8000/api/users?page=1",
    "last_page_url": "http://localhost:8000/api/users?page=5",
    "prev_page_url": null,
    "next_page_url": "http://localhost:8000/api/users?page=2"
  },
  "links": [
    {
      "url": null,
      "label": "&laquo; Previous",
      "active": false
    },
    {
      "url": "http://localhost:8000/api/users?page=1",
      "label": "1",
      "active": true
    },
    {
      "url": "http://localhost:8000/api/users?page=2",
      "label": "2",
      "active": false
    },
    {
      "url": "http://localhost:8000/api/users?page=2",
      "label": "Next &raquo;",
      "active": false
    }
  ]
}
```

## Laravel Controller Implementation

### Menggunakan Helper (Recommended)

```php
<?php

namespace App\Modules\User\Controllers\Web;

use App\Helpers\PaginationHelper;
use App\Http\Controllers\Controller;
use App\Modules\User\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $users = User::query()
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
            })
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15))
            ->withQueryString();

        return Inertia::render('Users/Index', [
            'users' => PaginationHelper::format($users),
        ]);
    }
}
```

### Manual Format (Tanpa Helper)

```php
public function index(Request $request)
{
    $users = User::paginate(15)->withQueryString();

    return Inertia::render('Users/Index', [
        'users' => [
            'data' => $users->items(),
            'meta' => [
                'current_page' => $users->currentPage(),
                'from' => $users->firstItem(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'to' => $users->lastItem(),
                'total' => $users->total(),
                'path' => $users->path(),
                'first_page_url' => $users->url(1),
                'last_page_url' => $users->url($users->lastPage()),
                'prev_page_url' => $users->previousPageUrl(),
                'next_page_url' => $users->nextPageUrl(),
            ],
            'links' => collect($users->linkCollection())->map(function ($link) {
                return [
                    'url' => $link['url'],
                    'label' => $link['label'],
                    'active' => $link['active'],
                ];
            })->toArray(),
        ],
    ]);
}
```

## Frontend Usage

```tsx
import { usePage } from "@inertiajs/react";
import ProTable, { Column, PaginationResponse } from "@/components/tables/ProTables/ProTable";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

export default function UsersIndex() {
  const { users } = usePage<{
    users: PaginationResponse<User>;
  }>().props;

  const columns: Column<User>[] = [
    {
      key: "id",
      header: "ID",
    },
    {
      key: "name",
      header: "Name",
    },
    {
      key: "email",
      header: "Email",
    },
    {
      key: "status",
      header: "Status",
      render: (user) => (
        <Badge color={user.status === "active" ? "success" : "error"}>
          {user.status}
        </Badge>
      ),
    },
  ];

  return (
    <ProTable
      data={users.data}
      columns={columns}
      pagination={users}
      loading={false}
      emptyMessage="No users found"
      emptyDescription="Get started by creating a new user."
    />
  );
}
```

## Notes

- **data**: Array berisi items yang akan ditampilkan di table
- **meta**: Metadata pagination (current_page, total, dll)
- **links**: Array links untuk navigasi pagination (Previous, 1, 2, 3, Next)
- **from/to**: Bisa `null` jika tidak ada data
- **prev_page_url/next_page_url**: Bisa `null` jika di page pertama/terakhir
- **url di links**: Bisa `null` untuk link "Previous" di page pertama atau "Next" di page terakhir

Lihat file `ProTable.response.example.ts` untuk contoh lengkap dengan berbagai skenario.


