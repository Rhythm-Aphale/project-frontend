"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged, User } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { auth, db, signInWithGoogle, logout as firebaseLogout } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginAsAdmin: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const checkAdminStatus = async (uid: string): Promise<boolean> => {
  try {
    const adminRef = doc(db, "admins", uid);
    const adminSnap = await getDoc(adminRef);
    return adminSnap.exists() && adminSnap.data()?.isAdmin === true;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const adminStatus = await checkAdminStatus(currentUser.uid);
        setIsAdmin(adminStatus);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = useCallback(async () => {
    try {
      const user = await signInWithGoogle(); // Use lib/firebase.ts function
      if (user) {
        setUser(user); // Update state manually since signInWithGoogle doesn’t trigger onAuthStateChanged immediately
        const adminStatus = await checkAdminStatus(user.uid);
        setIsAdmin(adminStatus);
      }
    } catch (error) {
      console.error("Google login failed:", error);
      throw error;
    }
  }, []);

  const loginAsAdmin = async (email: string, password: string) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      setUser(user);
      const adminStatus = await checkAdminStatus(user.uid);
      setIsAdmin(adminStatus);
    } catch (error) {
      console.error("Admin Login Error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await firebaseLogout(); // Use lib/firebase.ts function
      setUser(null);
      setIsAdmin(false);
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, loginWithGoogle, loginAsAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};