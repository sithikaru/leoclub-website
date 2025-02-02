"use client";

import { useState, useEffect, FormEvent } from "react";
import { useAdminAuth } from "@/app/hooks/useAdminAuth";
import {
  getAllProjects,
  addProject,
  deleteProject,
} from "@/app/lib/firestore";
import { Project } from "@/app/types/Project";
import Link from "next/link";

export default function AdminProjectsPage() {
  const { user, loading } = useAdminAuth(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Form
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<"past" | "upcoming">("upcoming");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [time, setTime] = useState(""); // or a date-time pick
  const [images, setImages] = useState<string>("");
  const [videos, setVideos] = useState<string>("");

  useEffect(() => {
    if (!loading) {
      fetchData();
    }
  }, [loading]);

  async function fetchData() {
    setLoadingData(true);
    const data = await getAllProjects();
    setProjects(data);
    setLoadingData(false);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // Split images by commas
    const imageUrls = images
      .split(",")
      .map((s) => s.trim())
      .filter((x) => x);
    const videoUrls = videos
      .split(",")
      .map((s) => s.trim())
      .filter((x) => x);

    const newProject: Omit<Project, "id"> = {
      title,
      description,
      location,
      time,
      status,
      images: imageUrls,
      videoUrls,
      createdAt: new Date(),
    };
    await addProject(newProject);

    // Reset form
    setTitle("");
    setDescription("");
    setLocation("");
    setTime("");
    setStatus("upcoming");
    setImages("");
    setVideos("");

    await fetchData();
  }

  async function handleDelete(id: string) {
    await deleteProject(id);
    await fetchData();
  }

  if (loading || loadingData) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Manage Projects</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mb-6">
        <div>
          <label className="block mb-1">Title</label>
          <input
            className="border w-full px-3 py-2"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1">Status</label>
          <select
            className="border w-full px-3 py-2"
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as "past" | "upcoming")
            }
          >
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">Description</label>
          <textarea
            className="border w-full px-3 py-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1">Location</label>
          <input
            className="border w-full px-3 py-2"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1">Time (date/time string)</label>
          <input
            className="border w-full px-3 py-2"
            type="text"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1">
            Images (comma separated URLs)
          </label>
          <input
            className="border w-full px-3 py-2"
            type="text"
            value={images}
            onChange={(e) => setImages(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1">
            Videos (comma separated embed URLs)
          </label>
          <input
            className="border w-full px-3 py-2"
            type="text"
            value={videos}
            onChange={(e) => setVideos(e.target.value)}
          />
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded" type="submit">
          Add Project
        </button>
      </form>

      {/* Existing Projects */}
      <table className="min-w-full bg-white shadow rounded">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 text-left">Title</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <tr key={p.id}>
              <td className="p-2">{p.title}</td>
              <td className="p-2 capitalize">{p.status}</td>
              <td className="p-2 space-x-2">
                <Link
                  href={`/admin/projects/${p.id}/edit`}
                  className="bg-blue-600 text-white px-2 py-1 rounded"
                >
                  Edit
                </Link>
                <button
                  className="bg-red-600 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(p.id)}
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
