/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { getProjectsByStatus } from "@/app/lib/firestore";

export default function PastProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await getProjectsByStatus("past");
      setProjects(data);
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="p-4">Loading past projects...</div>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Past Projects</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {projects.map((proj) => (
          <div key={proj.id} className="bg-white shadow p-4">
            {proj.images?.length > 0 && (
              <img
                src={proj.images[0]}
                alt={proj.title}
                className="w-full h-40 object-cover mb-2"
              />
            )}
            <h2 className="text-xl font-bold">{proj.title}</h2>
            <p className="text-sm text-gray-600 mb-2">{proj.location}</p>
            <p className="text-gray-700">{proj.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
