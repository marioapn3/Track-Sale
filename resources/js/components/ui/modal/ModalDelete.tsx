import { useState } from "react";
import { Modal } from "./index";
import Button from "../button/Button";
import { Loader2, AlertTriangle } from "lucide-react";

interface ModalDeleteProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    title?: string;
    description?: string;
    itemName?: string;
    itemDetails?: React.ReactNode;
    confirmButtonText?: string;
    cancelButtonText?: string;
    className?: string;
}

export default function ModalDelete({
    isOpen,
    onClose,
    onConfirm,
    title = "Delete Item",
    description = "Are you sure you want to delete this item? This action cannot be undone.",
    itemName,
    itemDetails,
    confirmButtonText = "Delete",
    cancelButtonText = "Cancel",
    className,
}: ModalDeleteProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async () => {
        setLoading(true);
        setError(null);

        try {
            await onConfirm();
            onClose();
        } catch (err: any) {
            setError(err.message || "Failed to delete. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className={`max-w-md ${className || ""}`}>
            <div className="p-6">
                <div className="mb-6">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-error-100 rounded-full dark:bg-error-900">
                        <AlertTriangle className="w-6 h-6 text-error-600 dark:text-error-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
                        {title}
                    </h2>
                    <p className="mt-2 text-sm text-center text-gray-500 dark:text-gray-400">
                        {description}
                    </p>
                </div>

                {/* Item Info */}
                {(itemName || itemDetails) && (
                    <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                        {itemName && (
                            <>
                                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Name
                                </div>
                                <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                                    {itemName}
                                </div>
                            </>
                        )}
                        {itemDetails && <div className="mt-3">{itemDetails}</div>}
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-4 rounded-lg border border-error-200 bg-error-50 p-4 dark:border-error-800 dark:bg-error-900/20">
                        <p className="text-sm text-error-700 dark:text-error-400">{error}</p>
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={loading}
                    >
                        {cancelButtonText}
                    </Button>
                    <Button
                        type="button"
                        variant="primary"
                        onClick={handleDelete}
                        disabled={loading}
                        className="bg-error-500 hover:bg-error-600 disabled:bg-error-300 dark:bg-error-600 dark:hover:bg-error-700"
                        startIcon={loading ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined}
                    >
                        {loading ? "Deleting..." : confirmButtonText}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

