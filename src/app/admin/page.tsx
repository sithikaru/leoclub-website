"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminHomePage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  if (loading) return <div className="p-4">Checking auth...</div>;

  if (!user) {
    router.push("/admin/login");
    return null;
  }

  return (
    <div className="p-4 text-white">
      <h1 className="text-2xl font-bold mb-4 text-white">Admin Dashboard</h1>
      <div className="space-x-4 text-white">
        <Link
          href="/admin/projects"
          className="inline-block bg-green-600 text-white px-4 py-2 rounded"
        >
          Manage Projects
        </Link>
        <Link
          href="/admin/board"
          className="inline-block bg-green-600 text-white px-4 py-2 rounded"
        >
          Manage Board Members
        </Link>
      </div>
    </div>
  );
}
