"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import AdminDashboard from "@/components/admin/AdminDashboard"; // Updated import

const AdminPage = () => {
  const { user, isAdmin, loginAsAdmin, logout, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push("/login");
    }
  }, [user, isAdmin, loading, router]);

  const handleLogin = async () => {
    try {
      setError(null);
      await loginAsAdmin(email, password);
    } catch (error: any) {
      setError(error.message || "Login failed. Please check your credentials.");
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user || !isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-xl font-bold">Admin Login</h2>
        <input
          type="email"
          placeholder="Admin Email"
          className="border p-2 m-2 rounded w-64"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 m-2 rounded w-64"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500">{error}</p>}
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={handleLogin}
        >
          Login as Admin
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p>Welcome, {user.email}!</p>
      <button
        className="bg-red-500 text-white px-4 py-2 mt-2 rounded hover:bg-red-600"
        onClick={logout}
      >
        Logout
      </button>
      <AdminDashboard />
    </div>
  );
};

export default AdminPage;