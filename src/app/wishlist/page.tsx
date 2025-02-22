"use client";

import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext"; // Import useCart
import Link from "next/link";
import Image from "next/image";
import { FaTrash, FaArrowLeft, FaShoppingCart } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface WishlistItem {
  id: number;
  title: string;
  price: number;
  image: string;
}

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
        className="absolute inset-0 rounded-2xl z-[1] bg-[radial-gradient(circle_farthest-side_at_0_100%,#00ccb1,transparent),radial-gradient(circle_farthest-side_at_100%_0,#7b61ff,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#ffc414,transparent),radial-gradient(circle_farthest-side_at_0_0,#1ca0fb,#141316)]"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart(); // Get addToCart function
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleRemoveItem = (item: WishlistItem) => {
    removeFromWishlist(item.id);
    toast.success("Removed from wishlist", {
      icon: "🗑️",
      position: "bottom-right",
      style: { background: "#1f2937", color: "white" },
    });
  };

  const calculateTotal = () => {
    return wishlistItems.reduce((acc, item) => acc + item.price, 0);
  };

  const handleAddAllToCart = () => {
    if (wishlistItems.length === 0) return;
    wishlistItems.forEach((item) => addToCart({ ...item, quantity: 1 })); // Add each item to the cart with default quantity 1
    wishlistItems.forEach((item) => removeFromWishlist(item.id)); // Clear wishlist after adding
    toast.success("All items added to cart!", {
      icon: "🛒",
      position: "bottom-right",
      style: { background: "#1f2937", color: "white" },
    });
  };

  return (
    <div className="container mx-auto p-4 min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto mt-20">
        <div className="flex items-center justify-between mb-10">
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <FaArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
          <div className="text-lg font-medium text-gray-300">
            {wishlistItems.length} item{wishlistItems.length !== 1 && "s"}
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-12 text-gray-100">Your Wishlist</h1>

        <AnimatePresence>
          {wishlistItems.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center py-20">
              <div className="text-6xl mb-4 animate-pulse">💔</div>
              <p className="text-xl text-gray-400 mb-6">Your wishlist feels lonely...</p>
              <Link href="/" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200">
                Discover Amazing Products
                <FaArrowLeft className="h-4 w-4 rotate-180" />
              </Link>
            </motion.div>
          ) : (
            <>
              <motion.div className="space-y-6">
                <AnimatePresence>
                  {wishlistItems.map((item, index) => (
                    <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                      <BorderGradient>
                        <div className="bg-black p-6 rounded-2xl flex justify-between items-start md:items-center gap-6">
                          <div className="flex items-start gap-6 flex-1">
                            <div className="w-32 h-32 relative rounded-lg bg-gray-800 p-2 border border-gray-700">
                              <Image src={item.image} alt={item.title} fill className="object-contain" sizes="(max-width: 128px)" />
                            </div>
                            <div className="space-y-2">
                              <h3 className="text-lg font-semibold text-gray-100">{item.title}</h3>
                              <p className="text-xl font-medium text-blue-400">${item.price.toFixed(2)}</p>
                            </div>
                          </div>

                          <button onClick={() => handleRemoveItem(item)} className="text-red-500 hover:text-red-600 font-medium flex items-center gap-2 transition-colors duration-150">
                            <FaTrash className="h-5 w-5" />
                            <span className="hidden md:inline">Remove</span>
                          </button>
                        </div>
                      </BorderGradient>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-12 p-6 bg-gray-800 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-medium">Total Value:</span>
                  <span className="text-2xl font-bold text-green-400">${calculateTotal().toFixed(2)}</span>
                </div>
              </motion.div>

              <motion.button
                onClick={handleAddAllToCart}
                className={`mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  wishlistItems.length === 0
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
                disabled={wishlistItems.length === 0}
              >
                <FaShoppingCart className="h-5 w-5" />
                Add All to Cart
              </motion.button>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
