/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/lib/firebase";
import { getBoardMemberById, updateBoardMember, deleteBoardMember } from "@/app/lib/firestore";

export default function EditBoardMemberPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const params = useParams();

  const memberId = params.id as string;

  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [photoFile, setPhotoFile] = useState<FileList | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) router.push("/admin/login");
  }, [loading, user, router]);

  useEffect(() => {
    const fetchMember = async () => {
      const member = (await getBoardMemberById(memberId)) as { id: string; name: string; position: string };
      if (!member) {
        setError("Member not found.");
        return;
      }
      setName(member.name);
      setPosition(member.position);
    };
    fetchMember();
  }, [memberId]);

  async function handleUpdate(e: FormEvent) {
    e.preventDefault();
    try {
      const file = photoFile ? photoFile[0] : undefined;
      await updateBoardMember(memberId, { name, position }, file);
      router.push("/admin/board");
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this member?")) return;
    await deleteBoardMember(memberId);
    router.push("/admin/board");
  }

  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="p-4 bg-white">
      <h1 className="text-2xl font-bold mb-4">Edit Board Member</h1>
      <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="font-semibold">Name</label>
          <input
            className="border p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label className="font-semibold">Position</label>
          <input
            className="border p-2"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
        </div>
        <div className="flex flex-col md:col-span-2">
          <label className="font-semibold">New Photo</label>
          <input
            type="file"
            onChange={(e) => setPhotoFile(e.target.files)}
          />
        </div>
        <div className="md:col-span-2 flex space-x-4">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Update
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  );
}
