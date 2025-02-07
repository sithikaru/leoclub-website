/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/lib/firebase";
import { getProjectById, updateProject, deleteProject } from "@/app/lib/firestore";

export default function EditProjectPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const params = useParams();

  const projectId = params.id as string;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [videoUrls, setVideoUrls] = useState("");
  const [status, setStatus] = useState<"past" | "upcoming">("upcoming");
  const [newImageFiles, setNewImageFiles] = useState<FileList | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) router.push("/admin/login");
  }, [loading, user, router]);

  useEffect(() => {
    async function fetchProject() {
      try {
        const proj = await getProjectById(projectId);
        if (!proj) {
          setError("Project not found");
          return;
        }
        setTitle(proj.title || "");
        setDescription(proj.description || "");
        setLocation(proj.location || "");
        if (proj.startDate?.seconds) {
          const sd = new Date(proj.startDate.seconds * 1000);
          setStartDate(sd.toISOString().split("T")[0]);
        }
        if (proj.endDate?.seconds) {
          const ed = new Date(proj.endDate.seconds * 1000);
          setEndDate(ed.toISOString().split("T")[0]);
        }
        if (proj.videoUrls) {
          setVideoUrls(proj.videoUrls.join(", "));
        }
        setStatus(proj.status || "upcoming");
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    }

    fetchProject();
  }, [projectId]);

  async function handleUpdate(e: FormEvent) {
    e.preventDefault();
    try {
      const files = newImageFiles ? Array.from(newImageFiles) : [];
      await updateProject(projectId, {
        title,
        description,
        location,
        startDate,
        endDate,
        videoUrls,
        status,
      }, files);
      router.push("/admin/projects");
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this project?")) return;
    await deleteProject(projectId);
    router.push("/admin/projects");
  }

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  return (
    <div className="p-4 bg-white">
      <h1 className="text-2xl font-bold mb-4">Edit Project</h1>
      <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="font-semibold">Title</label>
          <input
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
        <div className="flex flex-col md:col-span-2">
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
          <label className="font-semibold">Add More Images</label>
          <input
            type="file"
            multiple
            onChange={(e) => setNewImageFiles(e.target.files)}
          />
        </div>
        {error && <p className="text-red-600">{error}</p>}
        <div className="md:col-span-2 flex space-x-4">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Update
          </button>
          <button
            onClick={handleDelete}
            type="button"
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  );
}
