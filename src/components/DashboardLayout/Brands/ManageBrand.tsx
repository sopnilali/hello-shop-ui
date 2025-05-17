"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { MdDeleteOutline } from "react-icons/md";
import { FaPen } from "react-icons/fa6";
import { useAllbrandsQuery, useDeleteBrandMutation, useCreateBrandMutation } from "@/components/Redux/features/brands/brandsApi";
import BrandUpdateModal from "./BrandUpdateModal";
import Image from "next/image";

interface Brand {
    id: string;
    name: string;
    description: string;
    logo: string;
}

const ManageBrand = () => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [brandToDelete, setBrandToDelete] = useState<string | null>(null);
    const [brandToUpdate, setBrandToUpdate] = useState<Brand | null>(null);
    const { data: brands, isError, isLoading } = useAllbrandsQuery(undefined);
    const [deleteBrand] = useDeleteBrandMutation();
    const [createBrand] = useCreateBrandMutation();
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const allBrands = brands?.data;

    const getImageUrl = (imageData: string) => {
        if (!imageData) return '/default-brand.png'; // You should add a default image
        if (imageData.startsWith('data:image')) {
            return imageData;
        }
        if (imageData.startsWith('http')) {
            return imageData;
        }
        return `/api/images/${imageData}`; // Adjust this based on your API endpoint
    };

    const handleDelete = (brandId: string) => {
        setBrandToDelete(brandId);
        setIsDeleteModalOpen(true);
    };

    const handleUpdate = (brand: Brand) => {
        setBrandToUpdate(brand);
        setIsUpdateModalOpen(true);
    };

    const handleAdd = () => {
        setIsAddModalOpen(true);
    };

    const confirmDelete = async () => {
        if (brandToDelete) {
            const toastId = toast.loading("Deleting Brand...");
            try {
                await deleteBrand(brandToDelete);
                toast.success("Brand deleted successfully!", { id: toastId });
            } catch (error) {
                console.error("Error deleting brand:", error);
                toast.error("Failed to delete brand. Please try again.", { id: toastId });
            } finally {
                setIsDeleteModalOpen(false);
                setBrandToDelete(null);
            }
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error("Please select an image file");
                e.target.value = '';
                setPreviewImage(null);
                setImageFile(null);
                return;
            }
            
            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image size should be less than 5MB");
                e.target.value = '';
                setPreviewImage(null);
                setImageFile(null);
                return;
            }

            // Store the file for upload
            setImageFile(file);

            // Create object URL for preview
            const objectUrl = URL.createObjectURL(file);
            setPreviewImage(objectUrl);

            // Log for debugging
            console.log('Image file selected:', file);
            console.log('Preview URL created:', objectUrl);
        } else {
            setPreviewImage(null);
            setImageFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    // Cleanup object URL when component unmounts or preview changes
    useEffect(() => {
        return () => {
            if (previewImage && previewImage.startsWith('blob:')) {
                URL.revokeObjectURL(previewImage);
            }
        };
    }, [previewImage]);

    const confirmAdd = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const toastId = toast.loading("Adding Brand...");
        const form = e.currentTarget;
        const formData = new FormData();

        const brandData = {
            name: (form.elements.namedItem('name') as HTMLInputElement).value,
            description: (form.elements.namedItem('description') as HTMLTextAreaElement).value,
        };

        // Append the file directly
        if (imageFile) {
            formData.append("file", imageFile);
        } else {
            toast.error("Please select a logo image", { id: toastId });
            return;
        }

        formData.append("data", JSON.stringify(brandData));

        try {
            const res = await createBrand(formData);
            if ('data' in res && res.data?.success) {
                toast.success("Brand added successfully!", { id: toastId });
                setIsAddModalOpen(false);
                setPreviewImage(null);
                setImageFile(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            } else {
                toast.error("Failed to add brand.", { id: toastId });
            }
        } catch (error) {
            console.error("Error adding brand:", error);
            toast.error("Failed to add brand. Please try again.", { id: toastId });
        }
    };

    // Cleanup on modal close
    const handleModalClose = () => {
        setIsAddModalOpen(false);
        setPreviewImage(null);
        setImageFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        // Cleanup object URL
        if (previewImage && previewImage.startsWith('blob:')) {
            URL.revokeObjectURL(previewImage);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error loading brands</div>;
    }

    return (
        <div className="max-h-screen overflow-auto">
            <div className="max-w-full mx-auto">
                <div className="flex justify-between items-center gap-3 mb-8">
                    <h1 className="md:text-3xl text-xl font-bold bg-gray-300 bg-clip-text text-transparent">
                        Sub Category
                    </h1>
                    <button
                        onClick={handleAdd}
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                    >
                        Add Brand
                    </button>
                </div>

                <div className="rounded-xl border border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-800 transition-colors">
                                <tr>
                                    <th className="px-6 py-4 text-left">Image</th>
                                    <th className="px-6 py-4 text-left">Name</th>
                                    <th className="px-6 py-4 text-left">Description</th>
                                    <th className="px-6 py-4 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allBrands && allBrands.map((brand: Brand) => (
                                    <motion.tr
                                        key={brand.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="border-t border-gray-700 hover:bg-gray-800/50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="w-10 h-10 relative rounded overflow-hidden">
                                                <Image 
                                                    src={getImageUrl(brand.logo)}
                                                    alt={brand.name}
                                                    fill
                                                    className="object-cover"
                                                    sizes="40px"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = '/default-brand.png'; // Fallback image
                                                    }}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{brand.name}</td>
                                        <td className="px-6 py-4">{brand.description}</td>
                                        <td className="px-6 py-4 text-2xl flex gap-3">
                                            <MdDeleteOutline
                                                className="cursor-pointer hover:text-red-500 transition-colors"
                                                onClick={() => handleDelete(brand.id)}
                                            />
                                            <FaPen
                                                className="cursor-pointer hover:text-blue-500 text-xl transition-colors"
                                                onClick={() => handleUpdate(brand)}
                                            />
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isDeleteModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full"
                        >
                            <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
                            <p className="mb-6">Are you sure you want to delete this brand? This action cannot be undone.</p>
                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <BrandUpdateModal
                isOpen={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                brand={brandToUpdate}
            />

            <AnimatePresence>
                {isAddModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full"
                        >
                            <h3 className="text-xl font-semibold mb-4">Add New Brand</h3>
                            <form onSubmit={confirmAdd} className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Brand Name</label>
                                    <input 
                                        type="text" 
                                        id="name" 
                                        name="name" 
                                        required 
                                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                    />
                                </div>
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                    <textarea 
                                        id="description" 
                                        name="description" 
                                        required 
                                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Logo</label>
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-24 h-24 border-2 border-dashed border-gray-400 rounded-lg overflow-hidden">
                                            {previewImage ? (
                                                <div className="w-full h-full">
                                                    <img 
                                                        src={previewImage}
                                                        alt="Preview" 
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center w-full h-full text-gray-400">
                                                    No image
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleImageChange}
                                                accept="image/*"
                                                className="hidden"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="w-full px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                                            >
                                                Choose Image
                                            </button>
                                            <p className="mt-1 text-xs text-gray-400">Max size: 5MB. Supported formats: PNG, JPG, JPEG</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-4 mt-6">
                                    <button
                                        type="button"
                                        onClick={handleModalClose}
                                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                    >
                                        Add Brand
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageBrand;
