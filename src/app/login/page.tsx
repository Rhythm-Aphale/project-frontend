"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const { user, isAdmin, loginWithGoogle, loginAsAdmin, logout, loading } = useAuth(); // Include isAdmin here
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      router.push(isAdmin ? "/admin" : "/"); // Use isAdmin from top-level useAuth
    }
  }, [user, isAdmin, loading, router]); // Add isAdmin to dependencies

  const handleGoogleLogin = async () => {
    try {
      setError(null);
      await loginWithGoogle();
    } catch (error: any) {
      setError(error.message || "Failed to login with Google.");
    }
  };

  const handleAdminLogin = async () => {
    try {
      setError(null);
      await loginAsAdmin(email, password);
    } catch (error: any) {
      setError(error.message || "Failed to login.");
    }
  };

  const handleLogout = async () => {
    try {
      setError(null);
      await logout();
    } catch (error: any) {
      setError(error.message || "Failed to logout.");
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      {user ? (
        <>
          <p className="text-lg">Welcome, {user.displayName || "User"}!</p>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={handleLogout}
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={handleGoogleLogin}
          >
            Login with Google
          </button>
          <input
            type="email"
            placeholder="Admin Email"
            className="border p-2 rounded w-64"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-2 rounded w-64"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={handleAdminLogin}
          >
            Login as Admin
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </>
      )}
    </div>
  );
};

export default LoginPage;