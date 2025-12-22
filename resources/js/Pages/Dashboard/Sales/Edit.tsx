import { useState, useEffect } from "react";
import { toast } from "sonner";
import { router } from "@inertiajs/react";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import { getSalesById, updateSales, type UpdateSalesPayload } from "../../../api/features/dashboard/sales";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import Button from "../../../components/ui/button/Button";

interface EditSalesProps {
    id: string;
}

export default function EditSales({ id }: EditSalesProps) {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        fetchSales();
    }, [id]);

    const fetchSales = async () => {
        try {
            setFetching(true);
            const sales = await getSalesById(Number(id));
            setFormData({
                name: sales.name || "",
                email: sales.email || "",
                password: "",
                password_confirmation: "",
            });
        } catch (error: any) {
            toast.error(error.message || "Failed to fetch sales");
            router.visit("/dashboard/sales");
        } finally {
            setFetching(false);
        }
    };

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

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (formData.password && formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }

        if (formData.password && formData.password !== formData.password_confirmation) {
            newErrors.password_confirmation = "Passwords do not match";
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
            const payload: UpdateSalesPayload = {
                name: formData.name.trim(),
                email: formData.email.trim(),
            };

            if (formData.password) {
                payload.password = formData.password;
            }

            await updateSales(Number(id), payload);
            toast.success("Sales updated successfully");
            router.visit("/dashboard/sales");
        } catch (error: any) {
            if (error.message) {
                const errorMessage = error.message;

                // Try to parse field-specific errors
                if (errorMessage.includes("name")) {
                    setErrors((prev) => ({ ...prev, name: errorMessage }));
                } else if (errorMessage.includes("email")) {
                    setErrors((prev) => ({ ...prev, email: errorMessage }));
                } else if (errorMessage.includes("password")) {
                    setErrors((prev) => ({ ...prev, password: errorMessage }));
                } else {
                    toast.error(errorMessage);
                }
            } else {
                toast.error("Failed to update sales. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand-500 border-r-transparent"></div>
                    <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">Loading sales...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageBreadcrumb
                pageTitle="Edit Sales"
                subTitle="Update sales member information"
                listBreadcrumb={["Sales", "Edit"]}
            />

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Name */}
                    <div>
                        <Label htmlFor="name" required>
                            Name
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter sales name"
                            error={!!errors.name}
                            hint={errors.name}
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <Label htmlFor="email" required>
                            Email
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter email address"
                            error={!!errors.email}
                            hint={errors.email}
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <Label htmlFor="password">
                            New Password
                        </Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Leave blank to keep current password"
                            error={!!errors.password}
                            hint={errors.password}
                        />
                        <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                            Leave blank if you don't want to change the password
                        </p>
                    </div>

                    {/* Password Confirmation */}
                    {formData.password && (
                        <div>
                            <Label htmlFor="password_confirmation" required>
                                Confirm New Password
                            </Label>
                            <Input
                                id="password_confirmation"
                                name="password_confirmation"
                                type="password"
                                value={formData.password_confirmation}
                                onChange={handleInputChange}
                                placeholder="Confirm new password"
                                error={!!errors.password_confirmation}
                                hint={errors.password_confirmation}
                            />
                        </div>
                    )}
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.visit("/dashboard/sales")}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" disabled={loading}>
                        {loading ? "Updating..." : "Update Sales"}
                    </Button>
                </div>
            </form>
        </div>
    );
}

