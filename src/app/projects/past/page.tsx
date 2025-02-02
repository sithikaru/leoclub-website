"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { getAllProjects } from "../../lib/firestore";

const PastProjects: NextPage = () => {
  const [pastProjects, setPastProjects] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const all = await getAllProjects();
    const past = all.filter((p) => p.status === "past");
    setPastProjects(past);
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Past Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pastProjects.map((project) => (
          <div key={project.id} className="bg-white p-4 shadow">
            <h2 className="text-xl font-semibold">{project.title}</h2>
            <p className="mt-2">{project.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PastProjects;
