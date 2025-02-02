"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { getAllBoardMembers } from "../lib/firestore"; // your helper function

const Board: NextPage = () => {
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    fetchBoardMembers();
  }, []);

  async function fetchBoardMembers() {
    const data = await getAllBoardMembers(); // implement in your lib
    setMembers(data);
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Meet Our Board</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {members.map((m) => (
          <div
            key={m.id}
            className="bg-white shadow rounded p-4 flex flex-col items-center"
          >
            <img
              src={m.photoUrl}
              alt={m.name}
              className="w-32 h-32 object-cover rounded-full mb-4"
            />
            <h2 className="text-xl font-semibold">{m.name}</h2>
            <p className="text-gray-600">{m.position}</p>
            <p className="text-sm mt-2 text-center">{m.bio}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Board;
