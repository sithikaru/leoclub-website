"use client";
import { useEffect, useState } from "react";
import { getBoardMembers } from "@/app/lib/firestore";

export default function BoardPage() {
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getBoardMembers();
      setMembers(data);
    }
    fetchData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-6">Our Board Members</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {members.map((m) => (
          <div
            key={m.id}
            className="bg-white rounded shadow p-4 flex flex-col items-center"
          >
            <img
              src={m.photoUrl}
              alt={m.name}
              className="w-24 h-24 object-cover rounded-full"
            />
            <h3 className="font-semibold">{m.name}</h3>
            <p className="text-gray-500 text-sm">{m.position}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
