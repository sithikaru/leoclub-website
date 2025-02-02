/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, FormEvent } from "react";
import { useAdminAuth } from "@/app/hooks/useAdminAuth";
import { getProject, updateProject } from "@/app/lib/firestore";
import { Project } from "@/app/types/Project";
import { useRouter } from "next/navigation";

export default function EditProjectPage({ params }: any) {
  const { user, loading } = useAdminAuth(true);
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  // Form states
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<"past" | "upcoming">("upcoming");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("");
  const [images, setImages] = useState("");
  const [videos, setVideos] = useState("");

  useEffect(() => {
    if (!loading) {
      fetchData();
    }
  }, [loading]);

  async function fetchData() {
    if (!params.id) return;
    const data = await getProject(params.id);
    if (data) {
      setProject(data);
      setTitle(data.title || "");
      setDescription(data.description || "");
      setLocation(data.location || "");
      setTime(data.time || "");
      setStatus(data.status);
      setImages(data.images?.join(",") || "");
      setVideos(data.videoUrls?.join(",") || "");
    }
    setLoadingData(false);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!project) return;

    const imageArr = images
      .split(",")
      .map((s) => s.trim())
      .filter((x) => x);
    const videoArr = videos
      .split(",")
      .map((s) => s.trim())
      .filter((x) => x);

    const updatedData: Partial<Project> = {
      title,
      description,
      location,
      time,
      status,
      images: imageArr,
      videoUrls: videoArr,
      updatedAt: new Date(),
    };

    await updateProject(project.id, updatedData);
    router.push("/admin/projects");
  }

  if (loading || loadingData) {
    return <div className="p-8">Loading...</div>;
  }

  if (!project) {
    return <div className="p-8">Project not found</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Edit Project</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
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
          <label className="block mb-1">Images (comma separated URLs)</label>
          <input
            className="border w-full px-3 py-2"
            type="text"
            value={images}
            onChange={(e) => setImages(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1">Videos (comma separated URLs)</label>
          <input
            className="border w-full px-3 py-2"
            type="text"
            value={videos}
            onChange={(e) => setVideos(e.target.value)}
          />
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded" type="submit">
          Update Project
        </button>
      </form>
    </div>
  );
}
