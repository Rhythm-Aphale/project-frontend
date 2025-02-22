"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { FaHome, FaShoppingCart, FaHeart, FaSearch, FaBars, FaTimes, FaUser } from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";

interface NavbarProps {
  products?: any[];
  setFilteredProducts?: (products: any[]) => void;
}

const Navbar = ({ products = [], setFilteredProducts }: NavbarProps) => {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(true);
  const pathname = usePathname();
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const { user, isAdmin, logout, loading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [pathname]);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      const previous = scrollYProgress.getPrevious() || 0;
      const direction = current - previous;
      setVisible(current < 0.05 || direction < 0);
    }
  });

  const navItems = [
    { name: "Home", link: "/", icon: <FaHome className="w-5 h-5" /> },
    {
      name: "Cart",
      link: "/cart",
      icon: <FaShoppingCart className="w-5 h-5" />,
      hasItems: isMounted && cartItems.length > 0,
      count: cartItems.length,
    },
    {
      name: "Wishlist",
      link: "/wishlist",
      icon: <FaHeart className="w-5 h-5" />,
      hasItems: isMounted && wishlistItems.length > 0,
      count: wishlistItems.length,
    },
  ];

  const filterAndSortProducts = React.useCallback(() => {
    if (!products || !setFilteredProducts) return;

    let filtered = [...products].filter(({ title, category, description }) =>
      [title, category, description]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    switch (sortOption) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - b.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating.rate - a.rating.rate);
        break;
      case "popularity":
        filtered.sort((a, b) => b.rating.count - a.rating.count);
        break;
    }

    setFilteredProducts(filtered);
  }, [products, setFilteredProducts, searchQuery, sortOption]);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (products?.length && setFilteredProducts) {
        filterAndSortProducts();
      }
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [filterAndSortProducts]);

  const showProductControls = Boolean(products?.length && setFilteredProducts);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.nav
          initial={{ opacity: 1, y: -100 }}
          animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-4 inset-x-4 md:top-10 md:inset-x-0 mx-auto flex max-w-6xl border border-gray-700/50 rounded-full bg-black/80 backdrop-blur-md shadow-lg shadow-indigo-500/20 z-[5000] px-4 md:px-8 py-2"
        >
          <div className="flex items-center justify-between w-full">
            {/* Left: Navigation */}
            <div className="flex items-center space-x-2 md:space-x-4">
              {navItems.map((item, idx) => (
                <Link key={idx} href={item.link} className="relative">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      "flex items-center space-x-2 p-2 md:px-4 rounded-full transition-all duration-200",
                      pathname === item.link
                        ? "bg-blue-600 text-white shadow-md scale-105"
                        : "text-gray-300 hover:text-white hover:bg-white/10"
                    )}
                  >
                    {item.icon}
                    <span className="hidden md:block text-sm font-medium">{item.name}</span>
                    {item.hasItems && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full"
                      >
                        {item.count}
                      </motion.span>
                    )}
                  </motion.div>
                </Link>
              ))}
            </div>

            {/* Center: Search & Sort (Desktop) */}
            {showProductControls && (
              <div className="hidden md:flex items-center space-x-4 flex-1 max-w-xl mx-4">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/10 border border-gray-700/50 rounded-full py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                </div>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="bg-black/80 backdrop-blur-md border border-gray-700/50 rounded-full py-2 pl-4 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer hover:bg-white/10 transition-colors"
                >
                  <option value="" className="bg-gray-900">Sort by</option>
                  <option value="price-asc" className="bg-gray-900">Price: Low to High</option>
                  <option value="price-desc" className="bg-gray-900">Price: High to Low</option>
                  <option value="rating" className="bg-gray-900">Best Rating</option>
                  <option value="popularity" className="bg-gray-900">Most Popular</option>
                </select>
              </div>
            )}

            {/* Right: Auth & Mobile Menu */}
            <div className="flex items-center space-x-4">
              {/* Auth Section (Desktop) */}
              <div className="hidden md:block">
                {loading ? (
                  <div className="h-10 w-24 animate-pulse bg-white/10 rounded-full" />
                ) : user ? (
                  <div className="relative">
                    <button
                      onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                      className="flex items-center space-x-2 text-white hover:bg-white/10 rounded-full px-4 py-2"
                    >
                      <FaUser className="w-5 h-5" />
                      <span className="font-medium">{user.displayName || "User"}</span>
                    </button>
                    <AnimatePresence>
                      {isProfileMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-xl shadow-lg py-1 border border-gray-700/50"
                        >
                          {isAdmin && (
                            <Link
                              href="/admin"
                              className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10"
                            >
                              Admin Dashboard
                            </Link>
                          )}
                        
                          <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/10"
                          >
                            Logout
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
                  >
                    Login
                  </Link>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full"
              >
                {isMobileMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </motion.nav>
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 inset-x-4 bg-black/95 backdrop-blur-md border border-gray-700/50 rounded-2xl p-4 z-[4999] space-y-4"
          >
            {showProductControls && (
              <>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/10 border border-gray-700/50 rounded-full py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                </div>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="w-full bg-black/80 backdrop-blur-md border border-gray-700/50 rounded-full py-2 pl-4 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer hover:bg-white/10 transition-colors"
                >
                  <option value="" className="bg-gray-900">Sort by</option>
                  <option value="price-asc" className="bg-gray-900">Price: Low to High</option>
                  <option value="price-desc" className="bg-gray-900">Price: High to Low</option>
                  <option value="rating" className="bg-gray-900">Best Rating</option>
                  <option value="popularity" className="bg-gray-900">Most Popular</option>
                </select>
              </>
            )}

            {loading ? (
              <div className="h-10 bg-white/10 animate-pulse rounded-full" />
            ) : user ? (
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2 text-white p-2">
                  <FaUser className="w-5 h-5" />
                  <span className="font-medium">{user.displayName || "User"}</span>
                </div>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="block w-full bg-gray-800 text-white text-center px-4 py-2 rounded-full hover:bg-gray-700"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="block w-full bg-gray-800 text-white text-center px-4 py-2 rounded-full hover:bg-gray-700"
                >
                  Profile Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="block w-full bg-blue-600 text-white text-center px-4 py-2 rounded-full hover:bg-blue-700"
              >
                Login
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;