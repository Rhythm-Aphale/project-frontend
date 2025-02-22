"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto p-4 min-h-screen bg-black text-white">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-40 text-gray-100 mt-20"
      >
        Your Shopping Cart
      </motion.h1>

      {cartItems.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20"
        >
          <div className="text-6xl mb-4">🛒</div>
          <p className="text-xl text-gray-400 mb-4">Your cart feels lonely...</p>
          <Link
            href="/"
            className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
          >
            Explore Products
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {cartItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <BorderGradient>
                <div className="bg-black p-6 rounded-2xl">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-start gap-6 flex-1">
                      <div className="relative group">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-32 h-32 object-contain rounded-lg bg-black/50 p-2 transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                        <p className="text-xl font-medium text-indigo-400">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="w-full md:w-auto flex items-center justify-between gap-4">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                        className="w-20 px-3 py-2 border border-indigo-500/20 rounded-md bg-indigo-500/10 text-white focus:ring-2 focus:ring-indigo-500 text-center"
                      />

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-600 font-medium flex items-center gap-1 transition-colors duration-150"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Remove</span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </BorderGradient>
            </motion.div>
          ))}

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-12 pt-8 border-t border-gray-700"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">
                  Total: ${total.toFixed(2)}
                </h2>
                <p className="text-gray-400">Shipping & taxes calculated at checkout</p>
              </div>
              <div className="w-full md:w-auto space-y-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 text-lg font-semibold"
                  onClick={() => alert("Checkout functionality not implemented yet")}
                >
                  Secure Checkout
                </motion.button>
                <Link
                  href="/"
                  className="inline-block w-full text-center text-indigo-400 hover:text-indigo-500 font-medium transition-all duration-200"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}