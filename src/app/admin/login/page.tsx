/* eslint-disable @typescript-eslint/no-explicit-any */
// app/admin/login/page.tsx
"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // On success, redirect to admin panel
      router.push("/admin");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Admin Login</h1>
      <form onSubmit={handleLogin} className="mt-4">
        <div>
          <label>Email</label>
          <input
            className="border p-1"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@iit.leo.org"
          />
        </div>
        <div className="mt-2">
          <label>Password</label>
          <input
            className="border p-1"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <button className="bg-green-600 text-white px-4 py-2 mt-4" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}
