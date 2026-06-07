import { useState } from "react";
import { Trash2, Edit, X } from "lucide-react";
import { uploadToCloudinary } from "../utils/cloudinaryUpload";

const categoryData = {
    Men: ["Shirts", "T-Shirts", "Jeans", "Jacket", "Kurta Set", "TrackSuits"],
    Women: ["Kurtis", "Lehengas", "Topwear", "Bottomwear", "Winterwear", "Sarees"],
    Kids: ["Boys", "Girls", "Babies", "Teens"],
    Accessories: ["Watches Boys", "Watches Girls", "Bag", "Sunglasses", "Wallets"],
    Footwear: ["Men Footwear", "Women Footwear", "Boys Footwear", "Babies Footwear"],
};

const defaultForm = {
    name: "",
    category: "Men",
    subCategory: "Shirts",
    price: "",
    stock: "",
    description: "",
    image: "",
    images: [],
    sizes: "",
    colors: "",
};

function AdminProducts() {
    const savedProducts = JSON.parse(localStorage.getItem("adminProducts")) || [];

    const [products, setProducts] = useState(savedProducts);
    const [form, setForm] = useState(defaultForm);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [uploading, setUploading] = useState(false);

    const saveProducts = (updatedProducts) => {
        setProducts(updatedProducts);
        localStorage.setItem("adminProducts", JSON.stringify(updatedProducts));
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        try {
            setUploading(true);

            const uploadedUrls = [];

            for (const file of files) {
                const imageUrl = await uploadToCloudinary(file);
                uploadedUrls.push(imageUrl);
            }

            setForm((prev) => {
                const allImages = [...(prev.images || []), ...uploadedUrls];

                return {
                    ...prev,
                    image: allImages[0],
                    images: allImages,
                };
            });

            alert("Images uploaded successfully");
        } catch (error) {
            alert(error.message || "Image upload failed");
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };

    const removeImage = (imageUrl) => {
        setForm((prev) => {
            const updatedImages = prev.images.filter((img) => img !== imageUrl);

            return {
                ...prev,
                images: updatedImages,
                image: updatedImages[0] || "",
            };
        });
    };

    const resetForm = () => {
        setForm(defaultForm);
        setEditId(null);
        setShowForm(false);
        setUploading(false);
    };

    const handleCategoryChange = (category) => {
        setForm({
            ...form,
            category,
            subCategory: categoryData[category][0],
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const finalImages =
            form.images && form.images.length > 0
                ? form.images
                : form.image
                    ? [form.image]
                    : [];

        if (
            !form.name ||
            !form.price ||
            !form.stock ||
            !form.description ||
            finalImages.length === 0 ||
            !form.sizes ||
            !form.colors
        ) {
            alert("Please fill all product details");
            return;
        }

        const productData = {
            id: editId || "P" + Date.now(),
            name: form.name,
            category: form.category,
            subCategory: form.subCategory,
            price: Number(form.price),
            stock: Number(form.stock),
            description: form.description,
            images: finalImages,
            sizes: form.sizes.split(",").map((item) => item.trim()).filter(Boolean),
            colors: form.colors.split(",").map((item) => item.trim()).filter(Boolean),
        };

        if (editId) {
            saveProducts(
                products.map((item) => (item.id === editId ? productData : item))
            );
            alert("Product updated successfully");
        } else {
            saveProducts([productData, ...products]);
            alert("Product added successfully");
        }

        resetForm();
    };

    const startEdit = (product) => {
        const category =
            product.category === "Winter Wear" ? "Accessories" : product.category;

        const productImages =
            product.images && product.images.length > 0 ? product.images : [];

        setEditId(product.id);

        setForm({
            name: product.name || "",
            category,
            subCategory: product.subCategory || categoryData[category]?.[0] || "",
            price: product.price || "",
            stock: product.stock ?? "",
            description: product.description || "",
            image: productImages[0] || "",
            images: productImages,
            sizes: product.sizes?.join(", ") || "",
            colors: product.colors?.join(", ") || "",
        });

        setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const deleteProduct = (id) => {
        if (!confirm("Delete this product?")) return;

        const updatedProducts = products.filter((item) => item.id !== id);
        saveProducts(updatedProducts);
    };

    return (
        <section className="p-6 md:p-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">
                <div>
                    <h1 className="text-4xl font-bold">Products</h1>
                    <p className="text-gray-500 mt-2">
                        Add, edit, delete products and manage multiple images.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => {
                        if (showForm) {
                            resetForm();
                        } else {
                            setShowForm(true);
                            setEditId(null);
                            setForm(defaultForm);
                        }
                    }}
                    className="bg-black text-white px-6 py-3 rounded-xl font-bold"
                >
                    {showForm ? "Close Form" : "+ Add Product"}
                </button>
            </div>

            {showForm && (
                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-2xl shadow p-6 mb-8 grid md:grid-cols-2 gap-4"
                >
                    <h2 className="md:col-span-2 text-2xl font-bold">
                        {editId ? "Edit Product" : "Add Product"}
                    </h2>

                    <input
                        type="text"
                        placeholder="Product Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="border rounded-xl px-4 py-3"
                    />

                    <input
                        type="number"
                        placeholder="Price"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                        className="border rounded-xl px-4 py-3"
                    />

                    <input
                        type="number"
                        placeholder="Stock Quantity"
                        value={form.stock}
                        onChange={(e) => setForm({ ...form, stock: e.target.value })}
                        className="border rounded-xl px-4 py-3"
                    />

                    <select
                        value={form.category}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="border rounded-xl px-4 py-3"
                    >
                        {Object.keys(categoryData).map((cat) => (
                            <option key={cat}>{cat}</option>
                        ))}
                    </select>

                    <select
                        value={form.subCategory}
                        onChange={(e) =>
                            setForm({ ...form, subCategory: e.target.value })
                        }
                        className="border rounded-xl px-4 py-3"
                    >
                        {categoryData[form.category].map((sub) => (
                            <option key={sub}>{sub}</option>
                        ))}
                    </select>

                    <input
                        type="text"
                        placeholder="Sizes: S, M, L, XL"
                        value={form.sizes}
                        onChange={(e) => setForm({ ...form, sizes: e.target.value })}
                        className="border rounded-xl px-4 py-3"
                    />

                    <input
                        type="text"
                        placeholder="Colors: Black, White, Blue"
                        value={form.colors}
                        onChange={(e) => setForm({ ...form, colors: e.target.value })}
                        className="border rounded-xl px-4 py-3"
                    />

                    <div className="md:col-span-2">
                        <label className="font-bold block mb-2">
                            Upload Product Images
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            className="border rounded-xl px-4 py-3 w-full"
                        />

                        {uploading && (
                            <p className="text-orange-600 font-bold mt-2">
                                Uploading images...
                            </p>
                        )}
                    </div>

                    <input
                        type="text"
                        placeholder="Main Image URL"
                        value={form.image}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                image: e.target.value,
                                images: e.target.value
                                    ? [e.target.value, ...(form.images || []).filter((img) => img !== e.target.value)]
                                    : form.images,
                            })
                        }
                        className="md:col-span-2 border rounded-xl px-4 py-3"
                    />

                    {form.images.length > 0 && (
                        <div className="md:col-span-2">
                            <p className="font-bold mb-3">Image Preview</p>

                            <div className="flex gap-4 flex-wrap">
                                {form.images.map((img, index) => (
                                    <div key={`${img}-${index}`} className="relative">
                                        <img
                                            src={img}
                                            alt="Preview"
                                            className={`w-28 h-28 object-contain bg-gray-100 rounded-xl border ${form.image === img ? "border-orange-600 border-2" : ""
                                                }`}
                                        />

                                        <button
                                            type="button"
                                            onClick={() => removeImage(img)}
                                            className="absolute -top-2 -right-2 bg-red-600 text-white w-7 h-7 rounded-full flex items-center justify-center"
                                        >
                                            <X size={16} />
                                        </button>

                                        {form.image === img && (
                                            <span className="absolute bottom-1 left-1 bg-orange-600 text-white text-[10px] px-2 py-1 rounded">
                                                Main
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <textarea
                        placeholder="Product Description"
                        value={form.description}
                        onChange={(e) =>
                            setForm({ ...form, description: e.target.value })
                        }
                        className="md:col-span-2 border rounded-xl px-4 py-3"
                        rows="4"
                    />

                    <div className="md:col-span-2 flex flex-col sm:flex-row gap-4">
                        <button
                            disabled={uploading}
                            className="bg-orange-600 text-white px-8 py-3 rounded-xl font-bold disabled:bg-gray-400"
                        >
                            {editId ? "Update Product" : "Save Product"}
                        </button>

                        <button
                            type="button"
                            onClick={resetForm}
                            className="border px-8 py-3 rounded-xl font-bold"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            <div className="bg-white rounded-2xl shadow p-6">
                {products.length === 0 ? (
                    <p className="text-gray-500">No products added yet.</p>
                ) : (
                    <div className="space-y-4">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="border rounded-xl p-4 flex gap-4 items-center"
                            >
                                <img
                                    src={product.images?.[0]}
                                    alt={product.name}
                                    className="w-20 h-20 rounded-xl object-contain bg-gray-100"
                                />

                                <div className="flex-1">
                                    <h3 className="font-bold text-lg">{product.name}</h3>

                                    <p className="text-gray-500">
                                        {product.category} / {product.subCategory || "All"}
                                    </p>

                                    <p className="text-orange-600 font-bold">
                                        ₹{product.price}
                                    </p>

                                    <p
                                        className={`font-bold ${Number(product.stock) > 0
                                                ? "text-green-600"
                                                : "text-red-600"
                                            }`}
                                    >
                                        Stock: {product.stock ?? 0}
                                    </p>

                                    <p className="text-gray-500 text-sm">
                                        Images: {product.images?.length || 0}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => startEdit(product)}
                                    className="text-blue-600"
                                >
                                    <Edit />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => deleteProduct(product.id)}
                                    className="text-red-600"
                                >
                                    <Trash2 />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

export default AdminProducts;