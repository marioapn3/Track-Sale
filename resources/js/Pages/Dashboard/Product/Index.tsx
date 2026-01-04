import { useState, useEffect, useCallback } from "react";
import { useFetchWithPagination } from "../../../api/hooks/useFetchWithPagination";
import { getProducts, deleteProduct } from "../../../api/features/dashboard/products";
import ProTable, { Column } from "../../../components/tables/ProTables/ProTable";
import { Product, ProductPaginationResponse } from "../../../api/features/dashboard/products/interface";
import Badge from "../../../components/ui/badge/Badge";
import { Edit, Trash2, Package, Search, X, Plus, Navigation } from "lucide-react";
import Button from "../../../components/ui/button/Button";
import { router } from "@inertiajs/react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import { toast } from "sonner";

function ProductList() {
    const { data, loading, refetch } = useFetchWithPagination<ProductPaginationResponse>(getProducts, { perPage: 15 });

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);

    const getSearchFromUrl = useCallback(() => {
        const urlObj = new URL(window.location.href);
        return urlObj.searchParams.get("search") || "";
    }, []);

    const [searchValue, setSearchValue] = useState(getSearchFromUrl);

    useEffect(() => {
        setSearchValue(getSearchFromUrl());
    }, [getSearchFromUrl]);

    useEffect(() => {
        const timer = setTimeout(() => {
            const url = new URL(window.location.href);
            const currentSearch = url.searchParams.get("search") || "";

            if (searchValue !== currentSearch) {
                url.searchParams.set("search", searchValue);
                url.searchParams.set("page", "1");

                if (!searchValue.trim()) {
                    url.searchParams.delete("search");
                }

                router.visit(url.toString(), {
                    preserveState: true,
                    preserveScroll: false,
                });
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchValue]);

    const columns: Column<Product>[] = [
        {
            key: "id",
            header: "ID",
            className: "w-20",
        },
        {
            key: "name",
            header: "Product",
            render: (product) => (
                <div className="flex items-center gap-3">
                    {product.image ? (
                        <img
                            src={`/storage/${product.image}`}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover bg-gray-100 dark:bg-gray-800"
                        />
                    ) : (
                        <div className="flex items-center justify-center w-10 h-10 bg-brand-100 rounded-lg dark:bg-brand-900">
                            <Package className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                        </div>
                    )}
                    <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                            {product.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            SKU: {product.sku}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            key: "stock",
            header: "Stock",
            render: (product) => (
                <span className="text-gray-800 text-theme-sm dark:text-white/90">
                    {product.stock} {product.unit}
                </span>
            ),
        },
        {
            key: "price",
            header: "Price",
            render: (product) => (
                <span className="text-gray-800 text-theme-sm dark:text-white/90 font-medium">
                    {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                    }).format(product.price)}
                </span>
            ),
        },
        {
            key: "brand",
            header: "Brand",
            render: (product) => (
                <span className="text-gray-800 text-theme-sm dark:text-white/90">
                    {product.brand || "-"}
                </span>
            ),
        },
        {
            key: "is_active",
            header: "Status",
            render: (product) => (
                <Badge size="sm" color={product.is_active ? "success" : "error"}>
                    {product.is_active ? "Active" : "Inactive"}
                </Badge>
            ),
        },
        {
            key: "created_at",
            header: "Created At",
            render: (product) => (
                <span className="text-gray-800 text-theme-sm dark:text-white/90">
                    {new Date(product.created_at).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </span>
            ),
        },
        {
            key: "actions",
            header: "Actions",
            className: "text-right",
            headerClassName: "text-right",
            render: (product) => (
                <div className="flex items-center justify-end gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        startIcon={<Navigation className="w-4 h-4" />}
                        onClick={(e) => {
                            e?.stopPropagation();
                            router.visit(`/dashboard/stock-movement/${product.slug}`);
                        }}
                    >
                        Atur Stok 
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        startIcon={<Edit className="w-4 h-4" />}
                        onClick={(e) => {
                            e?.stopPropagation();
                            router.visit(`/dashboard/product/${product.id}/edit`);
                        }}
                    >
                        Edit
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        startIcon={<Trash2 className="w-4 h-4" />}
                        onClick={(e) => {
                            e?.stopPropagation();
                            setProductToDelete(product);
                            setIsDeleteModalOpen(true);
                        }}
                    >
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    const handlePageChange = (page: number) => {
        const url = new URL(window.location.href);
        url.searchParams.set("page", page.toString());
        router.visit(url.toString(), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    const handleClearSearch = () => {
        setSearchValue("");
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setProductToDelete(null);
    };

    const handleDeleteConfirm = async () => {
        if (!productToDelete) return;

        try {
            await deleteProduct(productToDelete.id);
            toast.success("Product deleted successfully");
            refetch();
            handleCloseDeleteModal();
        } catch (error: any) {
            toast.error(error.message || "Failed to delete product");
        }
    };

    return (
        <div className="space-y-6">
            <PageBreadcrumb pageTitle="Products" subTitle="Manage your products inventory" listBreadcrumb={["Products"]} />

            {/* Search Bar and Create Button */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={searchValue}
                        onChange={handleSearchChange}
                        placeholder="Search products by name, SKU, or brand..."
                        className="w-full pl-10 pr-10 h-11 rounded-lg border border-gray-200 bg-white py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-800 dark:bg-white/3 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                    />
                    {searchValue && (
                        <button
                            onClick={handleClearSearch}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>
                <Button
                    variant="primary"
                    startIcon={<Plus className="w-4 h-4" />}
                    onClick={() => router.visit("/dashboard/product/create")}
                >
                    Create Product
                </Button>
            </div>

            <ProTable<Product>
                data={data?.data}
                columns={columns}
                pagination={data ?? null}
                loading={loading}
                emptyMessage="No products found"
                emptyDescription="Get started by creating a new product."
                onPageChange={handlePageChange}
                onRowClick={(product) => {
                    router.visit(`/dashboard/product/${product.id}/edit`);
                }}
            />

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && productToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Delete Product
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                            Are you sure you want to delete "{productToDelete.name}"? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={handleCloseDeleteModal}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleDeleteConfirm}
                                className="bg-error-500 hover:bg-error-600"
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductList;






