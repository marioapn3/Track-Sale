/**
 * Contoh Response Data untuk ProTable
 * 
 * File ini menunjukkan format response data yang diharapkan
 * dari backend Laravel untuk komponen ProTable
 */

// ============================================
// 1. CONTOH RESPONSE DARI LARAVEL BACKEND
// ============================================

/**
 * Format response yang dikembalikan dari Laravel Controller
 * menggunakan Laravel Pagination
 */
export const exampleLaravelResponse = {
  // Data array - berisi list items
  data: [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      role: "Admin",
      status: "active",
      created_at: "2024-01-15T10:30:00.000000Z",
      updated_at: "2024-01-15T10:30:00.000000Z",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "User",
      status: "active",
      created_at: "2024-01-16T14:20:00.000000Z",
      updated_at: "2024-01-16T14:20:00.000000Z",
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob.johnson@example.com",
      role: "Manager",
      status: "pending",
      created_at: "2024-01-17T09:15:00.000000Z",
      updated_at: "2024-01-17T09:15:00.000000Z",
    },
  ],

  // Metadata pagination
  meta: {
    current_page: 1,
    from: 1,
    last_page: 5,
    per_page: 15,
    to: 15,
    total: 67,
    path: "http://localhost:8000/api/users",
    first_page_url: "http://localhost:8000/api/users?page=1",
    last_page_url: "http://localhost:8000/api/users?page=5",
    prev_page_url: null, // null jika di page pertama
    next_page_url: "http://localhost:8000/api/users?page=2",
  },

  // Links untuk pagination navigation
  links: [
    {
      url: null, // null untuk "Previous"
      label: "&laquo; Previous",
      active: false,
    },
    {
      url: "http://localhost:8000/api/users?page=1",
      label: "1",
      active: true, // true untuk current page
    },
    {
      url: "http://localhost:8000/api/users?page=2",
      label: "2",
      active: false,
    },
    {
      url: "http://localhost:8000/api/users?page=3",
      label: "3",
      active: false,
    },
    {
      url: "http://localhost:8000/api/users?page=4",
      label: "4",
      active: false,
    },
    {
      url: "http://localhost:8000/api/users?page=5",
      label: "5",
      active: false,
    },
    {
      url: "http://localhost:8000/api/users?page=2",
      label: "Next &raquo;",
      active: false,
    },
  ],
};

// ============================================
// 2. CONTOH LARAVEL CONTROLLER CODE
// ============================================

/**
 * Contoh implementasi di Laravel Controller
 * 
 * ```php
 * <?php
 * 
 * namespace App\Modules\User\Controllers\Web;
 * 
 * use App\Http\Controllers\Controller;
 * use App\Modules\User\Models\User;
 * use Illuminate\Http\Request;
 * use Inertia\Inertia;
 * 
 * class UserController extends Controller
 * {
 *     public function index(Request $request)
 *     {
 *         // Query dengan pagination
 *         $users = User::query()
 *             ->when($request->search, function ($query, $search) {
 *                 $query->where('name', 'like', "%{$search}%")
 *                       ->orWhere('email', 'like', "%{$search}%");
 *             })
 *             ->when($request->status, function ($query, $status) {
 *                 $query->where('status', $status);
 *             })
 *             ->orderBy('created_at', 'desc')
 *             ->paginate($request->get('per_page', 15))
 *             ->withQueryString(); // Preserve query parameters
 * 
 *         // Return dengan format yang sesuai
 *         return Inertia::render('Users/Index', [
 *             'users' => [
 *                 'data' => $users->items(),
 *                 'meta' => [
 *                     'current_page' => $users->currentPage(),
 *                     'from' => $users->firstItem(),
 *                     'last_page' => $users->lastPage(),
 *                     'per_page' => $users->perPage(),
 *                     'to' => $users->lastItem(),
 *                     'total' => $users->total(),
 *                     'path' => $users->path(),
 *                     'first_page_url' => $users->url(1),
 *                     'last_page_url' => $users->url($users->lastPage()),
 *                     'prev_page_url' => $users->previousPageUrl(),
 *                     'next_page_url' => $users->nextPageUrl(),
 *                 ],
 *                 'links' => collect($users->linkCollection())->map(function ($link) {
 *                     return [
 *                         'url' => $link['url'],
 *                         'label' => $link['label'],
 *                         'active' => $link['active'],
 *                     ];
 *                 })->toArray(),
 *             ],
 *         ]);
 *     }
 * }
 * ```
 */

// ============================================
// 3. CONTOH RESPONSE DENGAN RELATIONSHIPS
// ============================================

/**
 * Contoh response dengan data yang memiliki relationships
 */
export const exampleResponseWithRelations = {
  data: [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      role: {
        id: 1,
        name: "Admin",
        permissions: ["read", "write", "delete"],
      },
      profile: {
        avatar: "/images/user/user-1.jpg",
        phone: "+1234567890",
        address: "123 Main St",
      },
      status: "active",
      created_at: "2024-01-15T10:30:00.000000Z",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: {
        id: 2,
        name: "User",
        permissions: ["read"],
      },
      profile: {
        avatar: "/images/user/user-2.jpg",
        phone: "+0987654321",
        address: "456 Oak Ave",
      },
      status: "active",
      created_at: "2024-01-16T14:20:00.000000Z",
    },
  ],
  meta: {
    current_page: 1,
    from: 1,
    last_page: 3,
    per_page: 15,
    to: 15,
    total: 42,
    path: "http://localhost:8000/api/users",
    first_page_url: "http://localhost:8000/api/users?page=1",
    last_page_url: "http://localhost:8000/api/users?page=3",
    prev_page_url: null,
    next_page_url: "http://localhost:8000/api/users?page=2",
  },
  links: [
    {
      url: null,
      label: "&laquo; Previous",
      active: false,
    },
    {
      url: "http://localhost:8000/api/users?page=1",
      label: "1",
      active: true,
    },
    {
      url: "http://localhost:8000/api/users?page=2",
      label: "2",
      active: false,
    },
    {
      url: "http://localhost:8000/api/users?page=3",
      label: "3",
      active: false,
    },
    {
      url: "http://localhost:8000/api/users?page=2",
      label: "Next &raquo;",
      active: false,
    },
  ],
};

// ============================================
// 4. CONTOH RESPONSE KOSONG (EMPTY STATE)
// ============================================

/**
 * Contoh response ketika tidak ada data
 */
export const exampleEmptyResponse = {
  data: [], // Array kosong
  meta: {
    current_page: 1,
    from: null,
    last_page: 1,
    per_page: 15,
    to: null,
    total: 0,
    path: "http://localhost:8000/api/users",
    first_page_url: "http://localhost:8000/api/users?page=1",
    last_page_url: "http://localhost:8000/api/users?page=1",
    prev_page_url: null,
    next_page_url: null,
  },
  links: [
    {
      url: null,
      label: "&laquo; Previous",
      active: false,
    },
    {
      url: "http://localhost:8000/api/users?page=1",
      label: "1",
      active: true,
    },
    {
      url: null,
      label: "Next &raquo;",
      active: false,
    },
  ],
};

// ============================================
// 5. CONTOH PENGGUNAAN DI FRONTEND
// ============================================

/**
 * Contoh penggunaan di Inertia Page Component
 * 
 * ```tsx
 * import { usePage } from "@inertiajs/react";
 * import ProTable, { Column, PaginationResponse } from "@/components/tables/ProTables/ProTable";
 * 
 * interface User {
 *   id: number;
 *   name: string;
 *   email: string;
 *   role: string;
 *   status: string;
 *   created_at: string;
 * }
 * 
 * export default function UsersIndex() {
 *   // Ambil data dari Inertia props
 *   const { users } = usePage<{
 *     users: PaginationResponse<User>;
 *   }>().props;
 * 
 *   // Define columns
 *   const columns: Column<User>[] = [
 *     {
 *       key: "id",
 *       header: "ID",
 *     },
 *     {
 *       key: "name",
 *       header: "Name",
 *     },
 *     {
 *       key: "email",
 *       header: "Email",
 *     },
 *     {
 *       key: "role",
 *       header: "Role",
 *     },
 *     {
 *       key: "status",
 *       header: "Status",
 *       render: (user) => (
 *         <Badge color={user.status === "active" ? "success" : "error"}>
 *           {user.status}
 *         </Badge>
 *       ),
 *     },
 *   ];
 * 
 *   return (
 *     <div>
 *       <h1>Users</h1>
 *       <ProTable
 *         data={users.data}
 *         columns={columns}
 *         pagination={users}
 *         loading={false}
 *         emptyMessage="No users found"
 *         emptyDescription="Get started by creating a new user."
 *       />
 *     </div>
 *   );
 * }
 * ```
 */

// ============================================
// 6. TYPE DEFINITIONS (untuk TypeScript)
// ============================================

/**
 * Interface untuk response pagination (sudah ada di ProTable.tsx)
 * 
 * export interface PaginationMeta {
 *   current_page: number;
 *   from: number | null;
 *   last_page: number;
 *   per_page: number;
 *   to: number | null;
 *   total: number;
 *   path: string;
 *   first_page_url: string;
 *   last_page_url: string;
 *   prev_page_url: string | null;
 *   next_page_url: string | null;
 * }
 * 
 * export interface PaginationLink {
 *   url: string | null;
 *   label: string;
 *   active: boolean;
 * }
 * 
 * export interface PaginationResponse<T> {
 *   data: T[];
 *   meta: PaginationMeta;
 *   links: PaginationLink[];
 * }
 */

// ============================================
// 7. HELPER FUNCTION UNTUK LARAVEL
// ============================================

/**
 * Helper function untuk format pagination di Laravel
 * 
 * ```php
 * <?php
 * 
 * namespace App\Helpers;
 * 
 * use Illuminate\Pagination\LengthAwarePaginator;
 * 
 * class PaginationHelper
 * {
 *     public static function format(LengthAwarePaginator $paginator): array
 *     {
 *         return [
 *             'data' => $paginator->items(),
 *             'meta' => [
 *                 'current_page' => $paginator->currentPage(),
 *                 'from' => $paginator->firstItem(),
 *                 'last_page' => $paginator->lastPage(),
 *                 'per_page' => $paginator->perPage(),
 *                 'to' => $paginator->lastItem(),
 *                 'total' => $paginator->total(),
 *                 'path' => $paginator->path(),
 *                 'first_page_url' => $paginator->url(1),
 *                 'last_page_url' => $paginator->url($paginator->lastPage()),
 *                 'prev_page_url' => $paginator->previousPageUrl(),
 *                 'next_page_url' => $paginator->nextPageUrl(),
 *             ],
 *             'links' => collect($paginator->linkCollection())->map(function ($link) {
 *                 return [
 *                     'url' => $link['url'],
 *                     'label' => $link['label'],
 *                     'active' => $link['active'],
 *                 ];
 *             })->toArray(),
 *         ];
 *     }
 * }
 * ```
 * 
 * Usage:
 * ```php
 * $users = User::paginate(15);
 * return Inertia::render('Users/Index', [
 *     'users' => PaginationHelper::format($users),
 * ]);
 * ```
 */


