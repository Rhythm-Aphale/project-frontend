"use client";
import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import { cn } from "@/lib/utils";
import { useProducts } from "@/context/ProductContext";

interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

// Separate ProductForm component to handle form state independently
const ProductForm = ({ 
  onSubmit, 
  initialData = null, 
  isEditing = false 
}: { 
  onSubmit: (data: Partial<Product>) => void;
  initialData?: Product | null;
  isEditing?: boolean;
}) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    price: initialData?.price || "",
    description: initialData?.description || "",
    image: initialData?.image || "",
    category: initialData?.category || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      price: parseFloat(formData.price.toString()) || 0,
      ...(initialData?.id ? { id: initialData.id } : {})
    });
    if (!isEditing) {
      setFormData({
        title: "",
        price: "",
        description: "",
        image: "",
        category: ""
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 rounded-2xl bg-black border border-gray-800"
    >
      <input
        type="text"
        name="title"
        placeholder="Product Title"
        value={formData.title}
        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
        className="block mb-4 p-2 w-full border border-gray-700 rounded bg-gray-900 text-white placeholder-gray-500"
      />
      <input
        type="number"
        name="price"
        placeholder="Price"
        value={formData.price}
        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
        className="block mb-4 p-2 w-full border border-gray-700 rounded bg-gray-900 text-white placeholder-gray-500"
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        className="block mb-4 p-2 w-full border border-gray-700 rounded bg-gray-900 text-white placeholder-gray-500"
      />
      <input
        type="text"
        name="image"
        placeholder="Image URL"
        value={formData.image}
        onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
        className="block mb-4 p-2 w-full border border-gray-700 rounded bg-gray-900 text-white placeholder-gray-500"
      />
      <input
        type="text"
        name="category"
        placeholder="Category"
        value={formData.category}
        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
        className="block mb-4 p-2 w-full border border-gray-700 rounded bg-gray-900 text-white placeholder-gray-500"
      />
      <button
        type="submit"
        className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 text-sm font-semibold"
      >
        {isEditing ? "Update Product" : "Add Product"}
      </button>
    </form>
  );
};

const AdminDashboard: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleSubmit = useCallback(async (formData: Partial<Product>) => {
    try {
      if (editingProduct?.id) {
        await updateProduct(editingProduct.id, formData);
      } else {
        await addProduct(formData as Omit<Product, "id">);
      }
      setEditingProduct(null);
    } catch (error) {
      console.error("Failed to submit product:", error);
    }
  }, [editingProduct, addProduct, updateProduct]);

  const handleEdit = useCallback((product: Product) => {
    setEditingProduct(product);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteProduct(id);
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  }, [deleteProduct]);

  // BorderGradient Component
  const BorderGradient = ({ children }: { children: React.ReactNode }) => {
    const variants = {
      initial: { backgroundPosition: "0 50%" },
      animate: { backgroundPosition: ["0, 50%", "100% 50%", "0 50%"] },
    };

    return (
      <div className="relative p-[2px] rounded-2xl group">
        <motion.div
          variants={variants}
          initial="initial"
          animate="animate"
          transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
          style={{ backgroundSize: "400% 400%" }}
          className={cn(
            "absolute inset-0 rounded-2xl z-[1]",
            "bg-[radial-gradient(circle_farthest-side_at_0_100%,#00ccb1,transparent),radial-gradient(circle_farthest-side_at_100%_0,#7b61ff,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#ffc414,transparent),radial-gradient(circle_farthest-side_at_0_0,#1ca0fb,#141316)]"
          )}
        />
        <div className="relative z-10">{children}</div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-4 text-white">Admin Dashboard</h1>

      {/* Product Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <BorderGradient>
          <ProductForm
            onSubmit={handleSubmit}
            initialData={editingProduct}
            isEditing={!!editingProduct}
          />
        </BorderGradient>
      </motion.div>

      {/* Product List */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {products.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CardContainer className="inter-var">
              <BorderGradient>
                <CardBody className="relative group/card hover:shadow-2xl hover:shadow-indigo-500/30 w-full aspect-[3/4] rounded-2xl p-6 transition-all duration-500 hover:-translate-y-2 hover:scale-105 flex flex-col bg-black">
                  <CardItem translateZ="100" className="w-full h-48 mb-6">
                    <div className="w-full h-full relative group-hover/card:shadow-xl rounded-xl overflow-hidden flex items-center justify-center p-4 bg-black/50">
                      <Image
                        src={product.image}
                        alt={product.title}
                        width={160}
                        height={160}
                        className="object-contain w-40 h-40 transition-all duration-500 group-hover/card:scale-110"
                        priority
                        quality={90}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-product.png';
                        }}
                      />
                    </div>
                  </CardItem>

                  <div className="flex flex-col flex-grow space-y-4">
                    <CardItem
                      translateZ="50"
                      className="text-lg font-bold text-white text-center line-clamp-2 min-h-[3rem]"
                    >
                      {product.title}
                    </CardItem>

                    <CardItem translateZ="40" className="flex justify-between items-center">
                      <span className="text-indigo-400 font-semibold text-xl">
                        ${product.price.toFixed(2)}
                      </span>
                    </CardItem>

                    <div className="flex flex-col space-y-4 mt-auto">
                      <CardItem
                        translateZ="30"
                        className="px-2 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-sm font-medium capitalize w-fit"
                      >
                        {product.category}
                      </CardItem>
                      <CardItem translateZ="30" className="w-full flex gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="w-full px-6 py-3 rounded-xl bg-yellow-500/10 text-yellow-300 hover:bg-yellow-600/20 transition-all duration-300 text-sm font-semibold flex items-center justify-center gap-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="w-full px-6 py-3 rounded-xl bg-red-500/10 text-red-300 hover:bg-red-600/20 transition-all duration-300 text-sm font-semibold flex items-center justify-center gap-2"
                        >
                          Delete
                        </button>
                      </CardItem>
                    </div>
                  </div>
                </CardBody>
              </BorderGradient>
            </CardContainer>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default AdminDashboard;