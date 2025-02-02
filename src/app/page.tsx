/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/index.tsx

"use client";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { getAllProjects } from "../app/lib/firestore"; // example import
import Link from "next/link";

const Home: NextPage = () => {
  const [featuredProject, setFeaturedProject] = useState<any>(null);
  const [upcomingProjects, setUpcomingProjects] = useState<any[]>([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    // This is a simple example that fetches all projects,
    // then filters in the client. You might prefer a Firestore query with a "where" clause.
    const all = await getAllProjects();
    const upcoming = all.filter((p) => p.status === "upcoming");

    // Pick one as "featured"
    if (upcoming.length > 0) {
      setFeaturedProject(upcoming[0]); // or some logic for "most recent"
    }
    setUpcomingProjects(upcoming.slice(0, 3)); // display first 3 upcoming
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-green-600 text-white p-8 text-center">
        <h1 className="text-4xl font-bold">Welcome to the Leo Club of IIT</h1>
        <p className="mt-2 text-lg">
          Empowering youth, building community, and making a difference.
        </p>
      </section>

      {/* Club Mission / Intro */}
      <section className="p-8 bg-gray-100">
        <h2 className="text-2xl font-semibold">Our Mission</h2>
        <p className="mt-2">
          We strive to serve our community through impactful projects and leadership development.
        </p>
      </section>

      {/* Featured Project */}
      {featuredProject && (
        <section className="p-8">
          <h2 className="text-2xl font-semibold">Featured Upcoming Project</h2>
          <div className="mt-4 bg-white shadow p-4">
            <h3 className="text-xl font-bold">{featuredProject.title}</h3>
            <p>{featuredProject.description}</p>
            <Link href={`/projects/${featuredProject.id}`} className="text-blue-600 underline mt-2 inline-block">
                Read More
            </Link>
          </div>
        </section>
      )}

      {/* Upcoming Projects Preview */}
      <section className="p-8">
        <h2 className="text-2xl font-semibold">Upcoming Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {upcomingProjects.map((proj) => (
            <div key={proj.id} className="bg-white shadow p-4">
              <h3 className="text-lg font-bold">{proj.title}</h3>
              <p>{proj.description}</p>
              <Link href={`/projects/${proj.id}`} className="text-blue-600 underline">
                View Details
              </Link>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Link href="/projects/upcoming" className="text-blue-600 underline">
              See All Upcoming Projects
          </Link>
        </div>
      </section>

      {/* Contact/Join Us */}
      <section className="p-8 bg-gray-100">
        <h2 className="text-2xl font-semibold">Join Us</h2>
        <p className="mt-2">
          Interested in becoming a member? Fill out our registration form:
        </p>
        <a
          href="https://docs.google.com/forms/d/..."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4 px-6 py-2 bg-green-600 text-white rounded"
        >
          Register Now
        </a>
      </section>
    </div>
  );
};

export default Home;
