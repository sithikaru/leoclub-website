/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSearchParams } from "next/navigation"; // or just use the "params" prop from layout if you prefer
import { useEffect, useState } from "react";
import { getProject } from "@/app/lib/firestore";
import { Project } from "@/app/types/Project";

export default function ProjectDetails({ params }: any) {
  const projectId = params.id;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const data = await getProject(projectId);
      setProject(data);
      setLoading(false);
    }
    fetchData();
  }, [projectId]);

  if (loading) return <div className="p-8">Loading project...</div>;
  if (!project) return <div className="p-8">Project not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold">{project.title}</h1>
      <p className="text-sm text-gray-600">{project.status.toUpperCase()} Project</p>

      {project.location && (
        <p className="mt-2">Location: {project.location}</p>
      )}
      {project.time && (
        <p className="mt-1">
          Time: {new Date(project.time).toLocaleString()}
        </p>
      )}
      <p className="mt-4">{project.description}</p>

      {/* Images */}
      {project.images && project.images.length > 0 && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {project.images.map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt={`Project Image ${idx}`}
              className="w-full h-auto rounded"
            />
          ))}
        </div>
      )}

      {/* Videos */}
      {project.videoUrls && project.videoUrls.length > 0 && (
        <div className="mt-4 space-y-4">
          {project.videoUrls.map((vid, idx) => (
            <div key={idx} className="aspect-w-16 aspect-h-9">
              <iframe
                src={vid}
                title={`Project Video ${idx}`}
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
