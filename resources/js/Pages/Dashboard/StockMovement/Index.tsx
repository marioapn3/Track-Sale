import { useState, useEffect, useCallback } from "react";
import { useFetchWithPagination } from "../../../api/hooks/useFetchWithPagination";
import {
    getStockMovementsByProductSlug,
    createStockMovement,
    deleteStockMovement,
    type CreateStockMovementPayload,
} from "../../../api/features/dashboard/stock-movements";
import {
    StockMovement,
    StockMovementsByProductResponse,
} from "../../../api/features/dashboard/stock-movements/interface";
import ProTable, { Column } from "../../../components/tables/ProTables/ProTable";
import Badge from "../../../components/ui/badge/Badge";
import { Trash2, Search, X, Package, ArrowUp, ArrowDown, RotateCcw } from "lucide-react";
import Button from "../../../components/ui/button/Button";
import { router } from "@inertiajs/react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import { toast } from "sonner";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import Select from "../../../components/form/Select";

interface StockMovementIndexProps {
    productSlug: string;
}

const typeOptions = [
    { value: "IN", label: "Stok Masuk" },
    { value: "OUT", label: "Stok Keluar" },
    { value: "ADJUST", label: "Penyesuaian Stok" },
];

const sourceOptions = [
    { value: "supplier", label: "Supplier" },
    { value: "sales", label: "Sales" },
    { value: "retur", label: "Retur" },
];

export default function StockMovementIndex({ productSlug }: StockMovementIndexProps) {
    const [product, setProduct] = useState<any>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [stockMovementToDelete, setStockMovementToDelete] = useState<StockMovement | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        type: "",
        quantity: "",
        source: "",
        reference: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const fetchData = useCallback(
        async (page: number = 1, perPage: number = 15, search?: string) => {
            const result = await getStockMovementsByProductSlug(productSlug, page, perPage, search);
            setProduct(result.product);
            return result.stock_movements;
        },
        [productSlug]
    );

    const { data: stockMovementsData, loading: tableLoading, refetch } = useFetchWithPagination<StockMovementsByProductResponse["stock_movements"]>(
        fetchData,
        { perPage: 15 }
    );

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.type) {
            newErrors.type = "Type is required";
        }

        if (!formData.quantity.trim()) {
            newErrors.quantity = "Quantity is required";
        } else if (isNaN(Number(formData.quantity)) || Number(formData.quantity) <= 0) {
            newErrors.quantity = "Quantity must be a valid number greater than 0";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm() || !product) {
            console.log("validateForm", validateForm());
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            const payload: CreateStockMovementPayload = {
                product_id: product.id,
                type: formData.type as "IN" | "OUT" | "ADJUST",
                quantity: Number(formData.quantity),
                source: formData.source || null,
                reference: formData.reference || null,
            };

            await createStockMovement(payload);
            toast.success("Stock movement created successfully");
            setFormData({
                type: "",
                quantity: "",
                source: "",
                reference: "",
            });
            setShowCreateForm(false);
            refetch();
        } catch (error: any) {
            if (error.message) {
                const errorMessage = error.message;

                if (errorMessage.includes("type")) {
                    setErrors((prev) => ({ ...prev, type: errorMessage }));
                } else if (errorMessage.includes("quantity")) {
                    setErrors((prev) => ({ ...prev, quantity: errorMessage }));
                } else if (errorMessage.includes("Insufficient stock")) {
                    setErrors((prev) => ({ ...prev, quantity: errorMessage }));
                } else {
                    toast.error(errorMessage);
                }
            } else {
                toast.error("Failed to create stock movement. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!stockMovementToDelete) return;

        try {
            await deleteStockMovement(stockMovementToDelete.id);
            toast.success("Stock movement deleted successfully");
            refetch();
            setIsDeleteModalOpen(false);
            setStockMovementToDelete(null);
        } catch (error: any) {
            toast.error(error.message || "Failed to delete stock movement");
        }
    };

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

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "IN":
                return <ArrowUp className="w-4 h-4 text-success-500" />;
            case "OUT":
                return <ArrowDown className="w-4 h-4 text-error-500" />;
            case "ADJUST":
                return <RotateCcw className="w-4 h-4 text-warning-500" />;
            default:
                return null;
        }
    };

    const getTypeColor = (type: string): "success" | "error" | "warning" | "primary" => {
        switch (type) {
            case "IN":
                return "success";
            case "OUT":
                return "error";
            case "ADJUST":
                return "warning";
            default:
                return "primary";
        }
    };

    const columns: Column<StockMovement>[] = [
        {
            key: "id",
            header: "ID",
            className: "w-20",
        },
        {
            key: "type",
            header: "Type",
            render: (movement) => (
                <div className="flex items-center gap-2">
                    {getTypeIcon(movement.type)}
                    <Badge size="sm" color={getTypeColor(movement.type)}>
                        {movement.type === "IN" ? "Masuk" : movement.type === "OUT" ? "Keluar" : "Penyesuaian"}
                    </Badge>
                </div>
            ),
        },
        {
            key: "quantity",
            header: "Quantity",
            render: (movement) => (
                <span className="text-gray-800 text-theme-sm dark:text-white/90 font-medium">
                    {movement.quantity} {product?.unit || ""}
                </span>
            ),
        },
        {
            key: "source",
            header: "Source",
            render: (movement) => (
                <span className="text-gray-800 text-theme-sm dark:text-white/90">
                    {movement.source || "-"}
                </span>
            ),
        },
        {
            key: "reference",
            header: "Reference",
            render: (movement) => (
                <span className="text-gray-800 text-theme-sm dark:text-white/90">
                    {movement.reference || "-"}
                </span>
            ),
        },
        {
            key: "user",
            header: "User",
            render: (movement) => (
                <span className="text-gray-800 text-theme-sm dark:text-white/90">
                    {movement.user?.name || "-"}
                </span>
            ),
        },
        {
            key: "created_at",
            header: "Created At",
            render: (movement) => (
                <span className="text-gray-800 text-theme-sm dark:text-white/90">
                    {new Date(movement.created_at).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </span>
            ),
        },
        {
            key: "actions",
            header: "Actions",
            className: "text-right",
            headerClassName: "text-right",
            render: (movement) => (
                <div className="flex items-center justify-end gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        startIcon={<Trash2 className="w-4 h-4" />}
                        onClick={(e) => {
                            e?.stopPropagation();
                            setStockMovementToDelete(movement);
                            setIsDeleteModalOpen(true);
                        }}
                    >
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <PageBreadcrumb
                pageTitle={product ? `Stock Movement - ${product.name}` : "Stock Movement"}
                subTitle={product ? `Manage stock movements for ${product.name}` : "Manage stock movements"}
                listBreadcrumb={["Products", "Stock Movement"]}
            />

            {/* Product Info Card */}
            {product && (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center gap-4">
                        {product.image ? (
                            <img
                                src={`/storage/${product.image}`}
                                alt={product.name}
                                className="w-16 h-16 rounded-lg object-cover bg-gray-100 dark:bg-gray-800"
                            />
                        ) : (
                            <div className="flex items-center justify-center w-16 h-16 bg-brand-100 rounded-lg dark:bg-brand-900">
                                <Package className="w-8 h-8 text-brand-600 dark:text-brand-400" />
                            </div>
                        )}
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {product.name}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                SKU: {product.sku} | Current Stock: <span className="font-medium text-gray-900 dark:text-white">{product.stock} {product.unit}</span>
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Form */}
            {showCreateForm && (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Create Stock Movement
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <Label htmlFor="type" required>
                                    Type
                                </Label>
                                <Select
                                    options={typeOptions}
                                    placeholder="Select type"
                                    onChange={(value) => handleSelectChange("type", value)}
                                    defaultValue={formData.type}
                                />
                                {errors.type && (
                                    <p className="mt-1.5 text-xs text-error-500">{errors.type}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="quantity" required>
                                    Quantity
                                </Label>
                                <Input
                                    id="quantity"
                                    name="quantity"
                                    type="number"
                                    value={formData.quantity}
                                    onChange={handleInputChange}
                                    placeholder="Enter quantity"
                                    min="1"
                                    error={!!errors.quantity}
                                    hint={errors.quantity}
                                />
                            </div>

                            <div>
                                <Label htmlFor="source">Source</Label>
                                <Select
                                    options={sourceOptions}
                                    placeholder="Select source (optional)"
                                    onChange={(value) => handleSelectChange("source", value)}
                                    defaultValue={formData.source}
                                />
                            </div>

                            <div>
                                <Label htmlFor="reference">Reference</Label>
                                <Input
                                    id="reference"
                                    name="reference"
                                    type="text"
                                    value={formData.reference}
                                    onChange={handleInputChange}
                                    placeholder="Enter reference (optional)"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setShowCreateForm(false);
                                    setFormData({
                                        type: "",
                                        quantity: "",
                                        source: "",
                                        reference: "",
                                    });
                                    setErrors({});
                                }}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" variant="primary" disabled={loading}>
                                {loading ? "Creating..." : "Create Stock Movement"}
                            </Button>
                        </div>
                    </form>
                </div>
            )}

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
                        placeholder="Search stock movements..."
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
                    startIcon={<Package className="w-4 h-4" />}
                    onClick={() => setShowCreateForm(!showCreateForm)}
                >
                    {showCreateForm ? "Hide Form" : "Create Stock Movement"}
                </Button>
            </div>

            <ProTable<StockMovement>
                data={stockMovementsData?.data}
                columns={columns}
                pagination={stockMovementsData ?? null}
                loading={tableLoading}
                emptyMessage="No stock movements found"
                emptyDescription="Get started by creating a new stock movement."
                onPageChange={handlePageChange}
            />

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && stockMovementToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Delete Stock Movement
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                            Are you sure you want to delete this stock movement? This action will reverse the stock change and cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsDeleteModalOpen(false);
                                    setStockMovementToDelete(null);
                                }}
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

