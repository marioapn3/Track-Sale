import { useState } from "react";
import { toast } from "sonner";
import { router } from "@inertiajs/react";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import { createSales, type CreateSalesPayload } from "../../../api/features/dashboard/sales";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import Button from "../../../components/ui/button/Button";

export default function CreateSales() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

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

        if (!formData.password.trim()) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }

        if (formData.password !== formData.password_confirmation) {
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
            const payload: CreateSalesPayload = {
                name: formData.name.trim(),
                email: formData.email.trim(),
                password: formData.password,
            };

            await createSales(payload);
            toast.success("Sales created successfully");
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
                toast.error("Failed to create sales. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <PageBreadcrumb
                pageTitle="Create Sales"
                subTitle="Add a new sales member to your team"
                listBreadcrumb={["Sales", "Create"]}
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
                        <Label htmlFor="password" required>
                            Password
                        </Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Enter password (min. 8 characters)"
                            error={!!errors.password}
                            hint={errors.password}
                        />
                    </div>

                    {/* Password Confirmation */}
                    <div>
                        <Label htmlFor="password_confirmation" required>
                            Confirm Password
                        </Label>
                        <Input
                            id="password_confirmation"
                            name="password_confirmation"
                            type="password"
                            value={formData.password_confirmation}
                            onChange={handleInputChange}
                            placeholder="Confirm password"
                            error={!!errors.password_confirmation}
                            hint={errors.password_confirmation}
                        />
                    </div>
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
                        {loading ? "Creating..." : "Create Sales"}
                    </Button>
                </div>
            </form>
        </div>
    );
}





