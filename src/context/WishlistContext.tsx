"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define types
interface WishlistItem {
  id: number;
  title: string;
  price: number;
  image: string; // Ensure image is used, not thumbnail
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: number) => void;
}

// Create context
const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

// Provider component
export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      setWishlistItems(JSON.parse(savedWishlist));
    }
  }, []);

  // Save wishlist to localStorage on change
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // Add item to wishlist
  const addToWishlist = (item: WishlistItem) => {
    setWishlistItems((prev) => {
      if (!prev.find((wishlistItem) => wishlistItem.id === item.id)) {
        return [...prev, item];
      }
      return prev; // Prevent duplicates
    });
  };

  // Remove item from wishlist
  const removeFromWishlist = (id: number) => {
    console.log("Removing item with ID:", id); // Debug log
    setWishlistItems((prev) => {
      const updatedWishlist = prev.filter((item) => item.id !== id);
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist)); // Ensure localStorage updates
      return updatedWishlist;
    });
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

// Hook to use the wishlist context
export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
