"use client";

import { useEffect, useState } from "react";
import { getAllProjects } from "@/app/lib/firestore";
import { Project } from "@/app/types/Project";

export default function PastProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const all = await getAllProjects();
      const past = all.filter((p) => p.status === "past");
      setProjects(past);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <div className="p-8">Loading past projects...</div>;

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Past Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((proj) => (
          <div key={proj.id} className="bg-white shadow rounded p-4">
            {proj.images && proj.images[0] && (
              <img
                src={proj.images[0]}
                alt={proj.title}
                className="w-full h-40 object-cover rounded mb-2"
              />
            )}
            <h2 className="text-xl font-bold">{proj.title}</h2>
            <p className="text-sm text-gray-600">{proj.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
