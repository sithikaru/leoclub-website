/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/lib/firebase";
import {
  createBoardMember,
  deleteBoardMember,
  getAllBoardMembers,
} from "@/app/lib/firestore";

export default function AdminBoardPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  const [members, setMembers] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [priority, setPriority] = useState<number>(1);
  const [photoFile, setPhotoFile] = useState<FileList | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push("/admin/login");
  }, [loading, user, router]);

  useEffect(() => {
    fetchMembers();
  }, []);

  async function fetchMembers() {
    const data = await getAllBoardMembers();
    setMembers(data);
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    if (!photoFile || photoFile.length === 0) {
      alert("Please select a photo file for the board member.");
      return;
    }
    const file = photoFile[0];
    await createBoardMember({ name, position, priority }, file);
    setName("");
    setPosition("");
    setPriority(1);
    setPhotoFile(null);
    fetchMembers();
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this member?")) return;
    await deleteBoardMember(id);
    fetchMembers();
  }

  return (
    <div className="p-4 bg-white">
      <h1 className="text-2xl font-bold mb-4">Manage Board Members</h1>

      {/* LIST */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Current Board Members</h2>
        <div className="space-y-2">
          {members.map((m) => (
            <div key={m.id} className="border p-2 flex items-center justify-between">
              <div>
                <p className="font-bold">{m.name}</p>
                <p className="text-sm text-gray-400">{m.position}</p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => router.push(`/admin/board/${m.id}/edit`)}
                  className="bg-blue-600 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(m.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CREATE FORM */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Add New Member</h2>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="font-semibold">Name</label>
            <input
              type="text"
              className="border p-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold">Position</label>
            <input
              type="text"
              className="border p-2"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold">Priority (1 is highest)</label>
            <input
              type="number"
              className="border p-2"
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value))}
              required
            />
          </div>
          <div className="flex flex-col md:col-span-2">
            <label className="font-semibold">Photo</label>
            <input
              type="file"
              onChange={(e) => setPhotoFile(e.target.files)}
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Create Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}