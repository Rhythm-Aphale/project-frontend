"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { fetchProductById } from "@/utils/api";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { cn } from "@/lib/utils";
import { Heart, Star } from "lucide-react";
import toast from "react-hot-toast";

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

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();
  
  const isInWishlist = product ? wishlistItems.some(item => item.id === product.id) : false;

  useEffect(() => {
    if (!id) return;
    setError(false);
    fetchProductById(Array.isArray(id) ? id[0] : id)
      .then(setProduct)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      setIsAdding(true);
      addToCart(product);
      setTimeout(() => setIsAdding(false), 1000);
      toast.success("Added to cart!");
    }
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    if (isInWishlist) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist', { icon: '💔' });
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist', { icon: '❤️' });
    }
  };

  if (loading) {
    return <div className="text-white text-center p-10">Loading...</div>;
  }

  if (error || !product) {
    return <div className="text-white text-center p-10">❌ Product not found.</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center">
      <motion.div className="relative max-w-4xl w-full mt-40">
        <BorderGradient>
          <div className="relative bg-black p-6 md:p-8 rounded-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Image src={product.image} alt={product.title} width={300} height={300} className="mx-auto rounded-lg" />
              <div>
                <h1 className="text-3xl font-bold">{product.title}</h1>
                <p className="text-2xl font-semibold mt-2 text-indigo-400">${product.price.toFixed(2)}</p>
                <p className="text-gray-400 mt-4">{product.description}</p>
                <div className="flex items-center mt-4">
                  {Array.from({ length: Math.round(product.rating.rate) }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400" />
                  ))}
                  <span className="ml-2 text-sm text-gray-400">({product.rating.count} reviews)</span>
                </div>
                <motion.button onClick={handleAddToCart} className="mt-6 px-6 py-3 bg-indigo-600 rounded-xl">Add to Cart</motion.button>
                <motion.button onClick={handleToggleWishlist} className="ml-4 p-2 rounded-full">
                  <Heart className={cn("w-6 h-6", isInWishlist ? "fill-red-500" : "text-gray-400")} />
                </motion.button>
              </div>
            </div>
          </div>
        </BorderGradient>
      </motion.div>
    </div>
  );
}
