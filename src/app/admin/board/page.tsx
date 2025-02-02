"use client";

import { useState, useEffect, FormEvent } from "react";
import { useAdminAuth } from "@/app/hooks/useAdminAuth";
import {
  getAllBoardMembers,
  addBoardMember,
  updateBoardMember,
  deleteBoardMember,
} from "@/app/lib/firestore";
import { BoardMember } from "@/app/types/BoardMember";

export default function AdminBoardPage() {
  const { user, loading } = useAdminAuth(true);
  const [members, setMembers] = useState<BoardMember[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Form states
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading) {
      fetchData();
    }
  }, [loading]);

  async function fetchData() {
    setLoadingData(true);
    const data = await getAllBoardMembers();
    setMembers(data);
    setLoadingData(false);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name || !position || !photoUrl) return;

    if (editId) {
      // Update
      await updateBoardMember(editId, { name, position, photoUrl });
    } else {
      // Add new
      await addBoardMember({ name, position, photoUrl });
    }

    setName("");
    setPosition("");
    setPhotoUrl("");
    setEditId(null);
    await fetchData();
  }

  function handleEdit(member: BoardMember) {
    setEditId(member.id);
    setName(member.name);
    setPosition(member.position);
    setPhotoUrl(member.photoUrl);
  }

  async function handleDelete(id: string) {
    await deleteBoardMember(id);
    await fetchData();
  }

  if (loading || loadingData) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Manage Board</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mb-6">
        <div>
          <label className="block mb-1">Name</label>
          <input
            className="border w-full px-3 py-2"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1">Position</label>
          <input
            className="border w-full px-3 py-2"
            type="text"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1">Photo URL</label>
          <input
            className="border w-full px-3 py-2"
            type="text"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {editId ? "Update" : "Add"} Member
        </button>
      </form>

      {/* List existing members */}
      <table className="min-w-full bg-white shadow rounded">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Position</th>
            <th className="p-2 text-left">Photo</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.id}>
              <td className="p-2">{m.name}</td>
              <td className="p-2">{m.position}</td>
              <td className="p-2">
                <img
                  src={m.photoUrl}
                  alt={m.name}
                  className="w-16 h-16 object-cover rounded"
                />
              </td>
              <td className="p-2 space-x-2">
                <button
                  className="bg-blue-600 text-white px-2 py-1 rounded"
                  onClick={() => handleEdit(m)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(m.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
