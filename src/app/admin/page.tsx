"use client";

import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useAdminAuth } from "../hooks/useAdminAuth";
import Link from "next/link";

export default function AdminDashboard() {
  const { user, loading } = useAdminAuth(true);

  if (loading) return <div className="p-8">Loading...</div>;

  async function handleLogout() {
    await signOut(auth);
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p>Welcome, {user?.email}!</p>
      <div className="mt-4 space-x-4">
        <Link
          href="/admin/board"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Manage Board
        </Link>
        <Link
          href="/admin/projects"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Manage Projects
        </Link>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
