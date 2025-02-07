/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, FormEvent, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/lib/firebase";
import {
  createProject,
  deleteProject,
  getProjectsByStatus,
  getProjectsByStatus as getAllProjects,
} from "@/app/lib/firestore";

export default function AdminProjectsPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  const [projects, setProjects] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>(""); // "past" | "upcoming" or ""
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [videoUrls, setVideoUrls] = useState("");
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [status, setStatus] = useState<"past" | "upcoming">("upcoming");
  const [error, setError] = useState("");

  // Auth check
  useEffect(() => {
    if (loading) return;
    if (!user) router.push("/admin/login");
  }, [loading, user, router]);

  const fetchProjects = useCallback(async () => {
    try {
      const data = await getProjectsByStatus(statusFilter || undefined);
      setProjects(data);
    } catch (err) {
      console.error(err);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const files = imageFiles ? Array.from(imageFiles) : [];
      await createProject(
        {
          title,
          description,
          location,
          startDate,
          endDate,
          videoUrls,
          status,
        },
        files
      );
      // Clear form
      setTitle("");
      setDescription("");
      setLocation("");
      setStartDate("");
      setEndDate("");
      setVideoUrls("");
      setImageFiles(null);
      setStatus("upcoming");
      fetchProjects();
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this project?")) return;
    await deleteProject(id);
    fetchProjects();
  }

  return (
    <div className="p-4 bg-white">
      <h1 className="text-2xl font-bold mb-4">Manage Projects</h1>

      {/* FILTER BY STATUS */}
      <div className="mb-4 flex items-center space-x-2">
        <label htmlFor="statusFilter">Filter by Status: </label>
        <select
          id="statusFilter"
          className="border p-1"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="past">Past</option>
          <option value="upcoming">Upcoming</option>
        </select>
      </div>

      {/* PROJECT LIST */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Existing Projects</h2>
        <div className="space-y-2">
          {projects.map((proj) => (
            <div key={proj.id} className="border p-2 flex items-center justify-between">
              <div>
                <p className="font-bold">{proj.title}</p>
                <p className="text-sm text-gray-600">
                  Status: {proj.status} | Start: {proj.startDate?.seconds ? new Date(proj.startDate.seconds*1000).toDateString() : "N/A"}
                </p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => router.push(`/admin/projects/${proj.id}/edit`)}
                  className="bg-blue-600 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(proj.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CREATE PROJECT FORM */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Add New Project</h2>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="font-semibold">Title</label>
            <input
              type="text"
              className="border p-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold">Status</label>
            <select
              className="border p-2"
              value={status}
              onChange={(e) => setStatus(e.target.value as "past" | "upcoming")}
            >
              <option value="past">Past</option>
              <option value="upcoming">Upcoming</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="font-semibold">Location</label>
            <input
              type="text"
              className="border p-2"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold">Start Date</label>
            <input
              type="date"
              className="border p-2"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold">End Date</label>
            <input
              type="date"
              className="border p-2"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold">Video URLs (comma separated)</label>
            <input
              type="text"
              className="border p-2"
              value={videoUrls}
              onChange={(e) => setVideoUrls(e.target.value)}
            />
          </div>
          <div className="flex flex-col md:col-span-2">
            <label className="font-semibold">Description</label>
            <textarea
              className="border p-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex flex-col md:col-span-2">
            <label className="font-semibold">Images (multiple)</label>
            <input
              type="file"
              multiple
              onChange={(e) => setImageFiles(e.target.files)}
            />
          </div>
          {error && <p className="text-red-600">{error}</p>}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
