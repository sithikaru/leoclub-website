"use client";

import { useEffect, useState } from "react";
import { getAllBoardMembers } from "@/app/lib/firestore";
import { BoardMember } from "@/app/types/BoardMember";

export default function BoardPage() {
  const [members, setMembers] = useState<BoardMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const data = await getAllBoardMembers();
      setMembers(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <div className="p-8">Loading board members...</div>;

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Our Board</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {members.map((m) => (
          <div
            key={m.id}
            className="bg-white rounded shadow p-4 flex flex-col items-center"
          >
            <img
              src={m.photoUrl}
              alt={m.name}
              className="w-24 h-24 object-cover rounded-full mb-2"
            />
            <h2 className="font-semibold">{m.name}</h2>
            <p className="text-sm text-gray-600">{m.position}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
