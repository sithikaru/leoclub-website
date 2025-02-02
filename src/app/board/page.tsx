/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { getAllBoardMembers } from "@/app/lib/firestore";

export default function BoardPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await getAllBoardMembers();
      setMembers(data);
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="p-4">Loading board members...</div>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Our Board Members</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {members.map((m) => (
          <div key={m.id} className="bg-white shadow p-4 flex flex-col items-center">
            <img
              src={m.photoUrl}
              alt={m.name}
              className="w-32 h-32 object-cover rounded mb-2"
            />
            <h2 className="text-xl font-semibold">{m.name}</h2>
            <p className="text-gray-600">{m.position}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
