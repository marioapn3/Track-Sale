/**
 * Example usage of ProTable component
 * 
 * This file demonstrates how to use the ProTable component
 * with pagination, custom columns, and API integration.
 */

import { useState } from "react";
import { usePage } from "@inertiajs/react";
import ProTable, { Column, PaginationResponse } from "./ProTable";
import Badge from "../../ui/badge/Badge";
import Button from "../../ui/button/Button";
import { Edit, Trash2, Eye } from "lucide-react";

// Example data type
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive" | "pending";
  created_at: string;
}

// Example usage in a page component
export default function UsersTableExample() {
  const { data, meta, links } = usePage<{
    data: PaginationResponse<User>;
  }>().props;

  // Define columns
  const columns: Column<User>[] = [
    {
      key: "id",
      header: "ID",
      className: "w-20",
    },
    {
      key: "name",
      header: "Name",
      render: (user) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">
            {user.name}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {user.email}
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (user) => (
        <span className="text-gray-800 text-theme-sm dark:text-white/90">
          {user.role}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (user) => {
        const statusConfig = {
          active: { color: "success" as const, label: "Active" },
          inactive: { color: "error" as const, label: "Inactive" },
          pending: { color: "warning" as const, label: "Pending" },
        };

        const config = statusConfig[user.status];
        return (
          <Badge size="sm" color={config.color}>
            {config.label}
          </Badge>
        );
      },
    },
    {
      key: "created_at",
      header: "Created At",
      render: (user) => (
        <span className="text-gray-800 text-theme-sm dark:text-white/90">
          {new Date(user.created_at).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      headerClassName: "text-right",
      render: (user) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            startIcon={<Eye className="w-4 h-4" />}
            onClick={() => console.log("View", user.id)}
          >
            View
          </Button>
          <Button
            size="sm"
            variant="outline"
            startIcon={<Edit className="w-4 h-4" />}
            onClick={() => console.log("Edit", user.id)}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            startIcon={<Trash2 className="w-4 h-4" />}
            onClick={() => console.log("Delete", user.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const handlePageChange = (page: number) => {
    // This will be handled by Inertia automatically via URL
    console.log("Page changed to:", page);
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Users
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your users and their permissions
        </p>
      </div>

      <ProTable<User>
        data={data.data}
        columns={columns}
        pagination={data}
        loading={false}
        emptyMessage="No users found"
        emptyDescription="Get started by creating a new user."
        onPageChange={handlePageChange}
        onRowClick={(user) => {
          console.log("Row clicked:", user);
          // Navigate to user detail page
        }}
        rowClassName={(user) => {
          // Add custom row styling based on user status
          if (user.status === "inactive") {
            return "opacity-60";
          }
          return "";
        }}
      />
    </div>
  );
}

/**
 * Backend Example (Laravel Controller)
 * 
 * In your Laravel controller, return paginated data like this:
 * 
 * ```php
 * public function index(Request $request)
 * {
 *     $users = User::query()
 *         ->paginate($request->get('per_page', 15))
 *         ->withQueryString();
 * 
 *     return Inertia::render('Users/Index', [
 *         'data' => [
 *             'data' => $users->items(),
 *             'meta' => [
 *                 'current_page' => $users->currentPage(),
 *                 'from' => $users->firstItem(),
 *                 'last_page' => $users->lastPage(),
 *                 'per_page' => $users->perPage(),
 *                 'to' => $users->lastItem(),
 *                 'total' => $users->total(),
 *                 'path' => $users->path(),
 *                 'first_page_url' => $users->url(1),
 *                 'last_page_url' => $users->url($users->lastPage()),
 *                 'prev_page_url' => $users->previousPageUrl(),
 *                 'next_page_url' => $users->nextPageUrl(),
 *             ],
 *             'links' => collect($users->linkCollection())->map(function ($link) {
 *                 return [
 *                     'url' => $link['url'],
 *                     'label' => $link['label'],
 *                     'active' => $link['active'],
 *                 ];
 *             })->toArray(),
 *         ],
 *     ]);
 * }
 * ```
 */


