import { useState } from "react";
import { toast } from "sonner";
import { router } from "@inertiajs/react";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import FileInput from "../../../components/form/input/FileInput";
import TextArea from "../../../components/form/input/TextArea";
import Select from "../../../components/form/Select";
import { createProduct, type CreateProductPayload } from "../../../api/features/dashboard/products";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import Button from "../../../components/ui/button/Button";
import { X } from "lucide-react";

const unitOptions = [
    { value: "pcs", label: "Pcs" },
    { value: "box", label: "Box" },
    { value: "kg", label: "Kg" },
    { value: "gram", label: "Gram" },
    { value: "liter", label: "Liter" },
    { value: "ml", label: "Ml" },
    { value: "meter", label: "Meter" },
    { value: "cm", label: "Cm" },
];

export default function CreateProduct() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        sku: "",
        stock: "",
        price: "",
        unit: "",
        brand: "",
        description: "",
        is_active: true,
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
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

    const handleTextAreaChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            description: value,
        }));
        if (errors.description) {
            setErrors((prev) => ({
                ...prev,
                description: "",
            }));
        }
    };

    const handleSelectChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            unit: value,
        }));
        if (errors.unit) {
            setErrors((prev) => ({
                ...prev,
                unit: "",
            }));
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                toast.error("Please select an image file");
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                toast.error("Image size must be less than 2MB");
                return;
            }
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = "Product name is required";
        }

        if (!formData.sku.trim()) {
            newErrors.sku = "SKU is required";
        }

        if (!formData.stock.trim()) {
            newErrors.stock = "Stock is required";
        } else if (isNaN(Number(formData.stock)) || Number(formData.stock) < 0) {
            newErrors.stock = "Stock must be a valid number greater than or equal to 0";
        }

        if (!formData.price.trim()) {
            newErrors.price = "Price is required";
        } else if (isNaN(Number(formData.price)) || Number(formData.price) < 0) {
            newErrors.price = "Price must be a valid number greater than or equal to 0";
        }

        if (!formData.unit) {
            newErrors.unit = "Unit is required";
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
            const payload: CreateProductPayload = {
                name: formData.name.trim(),
                sku: formData.sku.trim(),
                stock: Number(formData.stock),
                price: Number(formData.price),
                unit: formData.unit,
                is_active: Boolean(formData.is_active),
                brand: formData.brand.trim() || null,
                description: formData.description.trim() || null,
                image: imageFile || null,
            };


            await createProduct(payload);
            toast.success("Product created successfully");
            router.visit("/dashboard/product");
        } catch (error: any) {
            if (error.message) {
                const errorMessage = error.message;

                // Try to parse field-specific errors
                if (errorMessage.includes("name")) {
                    setErrors((prev) => ({ ...prev, name: errorMessage }));
                } else if (errorMessage.includes("sku")) {
                    setErrors((prev) => ({ ...prev, sku: errorMessage }));
                } else if (errorMessage.includes("stock")) {
                    setErrors((prev) => ({ ...prev, stock: errorMessage }));
                } else if (errorMessage.includes("price")) {
                    setErrors((prev) => ({ ...prev, price: errorMessage }));
                } else if (errorMessage.includes("unit")) {
                    setErrors((prev) => ({ ...prev, unit: errorMessage }));
                } else {
                    toast.error(errorMessage);
                }
            } else {
                toast.error("Failed to create product. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <PageBreadcrumb
                pageTitle="Create Product"
                subTitle="Add a new product to your inventory"
                listBreadcrumb={["Products", "Create"]}
            />

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Product Name */}
                    <div>
                        <Label htmlFor="name" required>
                            Product Name
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter product name"
                            error={!!errors.name}
                            hint={errors.name}
                        />
                    </div>

                    {/* SKU */}
                    <div>
                        <Label htmlFor="sku" required>
                            SKU
                        </Label>
                        <Input
                            id="sku"
                            name="sku"
                            type="text"
                            value={formData.sku}
                            onChange={handleInputChange}
                            placeholder="Enter SKU"
                            error={!!errors.sku}
                            hint={errors.sku}
                        />
                    </div>

                    {/* Stock */}
                    <div>
                        <Label htmlFor="stock" required>
                            Stock
                        </Label>
                        <Input
                            id="stock"
                            name="stock"
                            type="number"
                            value={formData.stock}
                            onChange={handleInputChange}
                            placeholder="Enter stock quantity"
                            min="0"
                            error={!!errors.stock}
                            hint={errors.stock}
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <Label htmlFor="price" required>
                            Price
                        </Label>
                        <Input
                            id="price"
                            name="price"
                            type="number"
                            value={formData.price}
                            onChange={handleInputChange}
                            placeholder="Enter price"
                            min="0"
                            step="0.01"
                            error={!!errors.price}
                            hint={errors.price}
                        />
                    </div>

                    {/* Unit */}
                    <div>
                        <Label htmlFor="unit" required>
                            Unit
                        </Label>
                        <Select
                            options={unitOptions}
                            placeholder="Select unit"
                            onChange={handleSelectChange}
                            defaultValue={formData.unit}
                        />
                        {errors.unit && (
                            <p className="mt-1.5 text-xs text-error-500">{errors.unit}</p>
                        )}
                    </div>

                    {/* Brand */}
                    <div>
                        <Label htmlFor="brand">Brand</Label>
                        <Input
                            id="brand"
                            name="brand"
                            type="text"
                            value={formData.brand}
                            onChange={handleInputChange}
                            placeholder="Enter brand name (optional)"
                        />
                    </div>
                </div>

                {/* Description */}
                <div>
                    <Label htmlFor="description">Description</Label>
                    <TextArea
                        value={formData.description}
                        onChange={handleTextAreaChange}
                        rows={4}
                        placeholder="Enter product description (optional)"
                    />
                </div>

                {/* Image */}
                <div>
                    <Label htmlFor="image">Product Image</Label>
                    <div className="space-y-3">
                        {imagePreview && (
                            <div className="relative inline-block">
                                <img
                                    src={imagePreview}
                                    alt="Product Preview"
                                    className="h-32 w-auto rounded-lg border border-gray-200 dark:border-gray-700 object-contain bg-gray-50 dark:bg-gray-800 p-2"
                                />
                                {imageFile && (
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center rounded-full bg-error-500 text-white hover:bg-error-600 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        )}
                        <FileInput onChange={handleImageChange} className="accept-image" />
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Recommended: PNG, JPG, JPEG, GIF. Max size: 2MB
                        </p>
                    </div>
                </div>

                {/* Is Active */}
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        id="is_active"
                        checked={formData.is_active}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                is_active: e.target.checked,
                            }))
                        }
                        className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800"
                    />
                    <Label htmlFor="is_active" className="mb-0">
                        Active
                    </Label>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.visit("/dashboard/product")}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" disabled={loading}>
                        {loading ? "Creating..." : "Create Product"}
                    </Button>
                </div>
            </form>
        </div>
    );
}






