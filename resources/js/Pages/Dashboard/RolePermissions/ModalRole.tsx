import { useState, useEffect } from "react";
import { Modal } from "../../../components/ui/modal";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import Button from "../../../components/ui/button/Button";
import { Role } from "../../../api/features/dashboard/roles-permissions/interface";
import { createRole, updateRole } from "../../../api/features/dashboard/roles-permissions";
import { Loader2 } from "lucide-react";

interface ModalRoleProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    role?: Role | null;
}

interface FormErrors {
    name?: string;
    general?: string;
}

export default function ModalRole({ isOpen, onClose, onSuccess, role }: ModalRoleProps) {
    const isEditMode = !!role;
    const [formData, setFormData] = useState({
        name: "",
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (role) {
                setFormData({
                    name: role.name || "",
                });
            } else {
                setFormData({
                    name: "",
                });
            }
            setErrors({});
        }
    }, [isOpen, role]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({
                ...prev,
                [name]: undefined,
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Role name is required";
        } else if (formData.name.trim().length > 255) {
            newErrors.name = "Role name must not exceed 255 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            if (isEditMode && role) {
                await updateRole(role.id, {
                    name: formData.name.trim(),
                });
            } else {
                await createRole({
                    name: formData.name.trim(),
                });
            }

            onSuccess();
            onClose();
        } catch (error: any) {
            if (error.message) {
                const errorMessage = error.message;
                
                if (errorMessage.includes("name")) {
                    setErrors({
                        name: errorMessage,
                    });
                } else {
                    setErrors({
                        general: errorMessage,
                    });
                }
            } else {
                setErrors({
                    general: isEditMode
                        ? "Failed to update role. Please try again."
                        : "Failed to create role. Please try again.",
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
            <div className="p-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {isEditMode ? "Edit Role" : "Create New Role"}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {isEditMode
                            ? "Update the role information below."
                            : "Fill in the information to create a new role."}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* General Error Message */}
                    {errors.general && (
                        <div className="rounded-lg border border-error-200 bg-error-50 p-4 dark:border-error-800 dark:bg-error-900/20">
                            <p className="text-sm text-error-700 dark:text-error-400">
                                {errors.general}
                            </p>
                        </div>
                    )}

                    {/* Role Name Field */}
                    <div>
                        <Label htmlFor="name" required>
                            Role Name
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Enter role name (e.g., Admin, Manager)"
                            value={formData.name}
                            onChange={handleChange}
                            error={!!errors.name}
                            disabled={loading}
                            hint={errors.name}
                        />
                    </div>

                    {/* Form Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={loading}
                            startIcon={loading ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined}
                        >
                            {loading
                                ? isEditMode
                                    ? "Updating..."
                                    : "Creating..."
                                : isEditMode
                                ? "Update Role"
                                : "Create Role"}
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}

