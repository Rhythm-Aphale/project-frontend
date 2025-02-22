// src/app/page.tsx
"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { useWishlist } from "@/context/WishlistContext";
import toast from "react-hot-toast";
import { useProducts } from "@/context/ProductContext";

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
}

// WishlistButton Component
const WishlistButton = ({ isInWishlist, onToggle }: { isInWishlist: boolean; onToggle: () => void }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsAnimating(true);
    onToggle();
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div className="relative">
      <motion.button
        onClick={handleClick}
        whileTap={{ scale: 0.9 }}
        className="relative z-10"
        aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        <AnimatePresence>
          <motion.div
            initial={{ scale: 1 }}
            animate={{
              scale: isAnimating ? [1, 1.5, 1] : 1,
              rotate: isAnimating ? [0, 15, -15, 0] : 0
            }}
            transition={{ duration: 0.5 }}
          >
            <svg
              viewBox="0 0 24 24"
              fill={isInWishlist ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              className={`w-6 h-6 transition-colors duration-300 ${
                isInWishlist 
                  ? 'text-red-500 filter drop-shadow-glow' 
                  : 'text-gray-400 hover:text-red-400'
              }`}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </motion.div>
        </AnimatePresence>
      </motion.button>
      
      <AnimatePresence>
        {isAnimating && isInWishlist && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [1, 1.5], opacity: [1, 0] }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute inset-0 z-0"
          >
            <div className="absolute inset-0 bg-red-500 rounded-full blur-md" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

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

// ProductCard Component
interface ProductCardProps {
  product: {
    id: string;
    title: string;
    price: number;
    image: string;
    category: string;
  };
  isInWishlist: boolean;
  onToggleWishlist: () => void;
}
const ProductCard = ({ product, isInWishlist, onToggleWishlist }: ProductCardProps) => {
  return (
    <CardContainer className="inter-var">
      <BorderGradient>
        <CardBody className="relative group/card hover:shadow-2xl hover:shadow-indigo-500/30 
          w-full aspect-[3/4] rounded-2xl p-6 transition-all duration-500
          hover:-translate-y-2 hover:scale-105 flex flex-col bg-black">
          
          <CardItem
            translateZ="120"
            className="absolute top-4 right-4 z-10"
            as="div"
          >
            <WishlistButton
              isInWishlist={isInWishlist}
              onToggle={() => {
                onToggleWishlist();
                toast.success(
                  isInWishlist ? 'Removed from wishlist' : 'Added to wishlist',
                  {
                    icon: isInWishlist ? '💔' : '❤️',
                    position: 'bottom-right',
                    duration: 2000,
                  }
                );
              }}
            />
          </CardItem>

          <CardItem translateZ="100" className="w-full h-48 mb-6">
            <div className="w-full h-full relative group-hover/card:shadow-xl rounded-xl 
                        overflow-hidden flex items-center justify-center p-4 bg-black/50">
              <Image
                src={product.image}
                alt={product.title}
                width={160}
                height={160}
                className="object-contain w-40 h-40 transition-all duration-500 
                          group-hover/card:scale-110"
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
              className="text-lg font-bold text-white text-center 
                        line-clamp-2 min-h-[3rem]"
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
                className="px-2 py-1 rounded-full bg-indigo-500/10 
                  text-indigo-300 text-sm font-medium capitalize w-fit"
              >
                {product.category}
              </CardItem>
              <CardItem translateZ="30" className="w-full">
                <Link
                  href={`/product/${product.id}`}
                  className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 
                            text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 
                            text-sm font-semibold flex items-center justify-center gap-2 group"
                >
                  <span>View Details</span>
                  <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </motion.svg>
                </Link>
              </CardItem>
            </div>
          </div>
        </CardBody>
      </BorderGradient>
    </CardContainer>
  );
};

// Main HomePage Component
export default function HomePage() {
  const { products, loading } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  const toggleItem = (product: Product) => {
    const isInWishlist = wishlistItems.some(item => String(item.id) === product.id);
    if (isInWishlist) {
      removeFromWishlist(Number(product.id));
    } else {
      addToWishlist({
        id: Number(product.id),
        title: product.title,
        price: product.price,
        image: product.image
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
          className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4 md:p-8">
      <Navbar products={products} setFilteredProducts={(products: Product[]) => setFilteredProducts(products)} />
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mt-20 md:mt-24"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ProductCard
              product={product}
              isInWishlist={wishlistItems.some((item) => item.id === Number(product.id))}
              onToggleWishlist={() => toggleItem(product)}
            />
          </motion.div>
        ))}
      </motion.div>

      {filteredProducts.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-24 text-gray-400 backdrop-blur-sm bg-black/20 rounded-2xl mt-8"
        >
          <p className="text-2xl font-semibold">No products found</p>
          <p className="mt-2 text-sm">Try adjusting your search terms</p>
        </motion.div>
      )}
    </div>
  );
}