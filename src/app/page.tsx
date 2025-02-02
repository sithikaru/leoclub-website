"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getAllProjects } from "@/app/lib/firestore";
import { Project } from "@/app/types/Project";

export default function HomePage() {
  const [upcoming, setUpcoming] = useState<Project[]>([]);
  const [past, setPast] = useState<Project[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const allProjects = await getAllProjects();
    const upcomingProjects = allProjects.filter(
      (p) => p.status === "upcoming"
    );
    const pastProjects = allProjects.filter((p) => p.status === "past");
    // Just show a few
    setUpcoming(upcomingProjects.slice(0, 3));
    setPast(pastProjects.slice(0, 3));
  }

  return (
    <>
      {/* Hero */}
      <section className="h-[60vh] bg-gradient-to-r from-green-700 to-green-400 text-white flex items-center justify-center">
        <div className="text-center px-4">
          <img
            src="/logo.png"
            alt="Leo Club Logo"
            className="mx-auto mb-4 h-24 w-auto"
          />
          <h1 className="text-4xl font-bold mb-2">Leo Club of IIT</h1>
          <p>Empowering youth. Building communities.</p>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-6xl mx-auto p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
        <p className="text-gray-600">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique
          quas dicta libero porro maxime suscipit, tempore saepe mollitia
          molestias consectetur.
        </p>
      </section>

      {/* Upcoming Projects Preview */}
      <section className="max-w-6xl mx-auto p-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Upcoming Projects</h2>
          <Link href="/projects/upcoming" className="text-green-700 underline">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcoming.map((proj) => (
            <div key={proj.id} className="bg-white shadow p-4 rounded">
              {proj.images && proj.images[0] && (
                <img
                  src={proj.images[0]}
                  alt={proj.title}
                  className="w-full h-40 object-cover rounded mb-2"
                />
              )}
              <h3 className="font-bold text-lg">{proj.title}</h3>
              <p className="text-sm text-gray-600">{proj.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Past Projects Preview */}
      <section className="max-w-6xl mx-auto p-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Past Projects</h2>
          <Link href="/projects/past" className="text-green-700 underline">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {past.map((proj) => (
            <div key={proj.id} className="bg-white shadow p-4 rounded">
              {proj.images && proj.images[0] && (
                <img
                  src={proj.images[0]}
                  alt={proj.title}
                  className="w-full h-40 object-cover rounded mb-2"
                />
              )}
              <h3 className="font-bold text-lg">{proj.title}</h3>
              <p className="text-sm text-gray-600">{proj.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Join Us */}
      <section className="max-w-6xl mx-auto p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Join Us</h2>
        <p className="text-gray-600 mb-4">
          Interested in becoming a member? Apply now!
        </p>
        <a
          href="https://docs.google.com/forms/d/..."
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
        >
          Apply
        </a>
      </section>
    </>
  );
}
