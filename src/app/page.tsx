/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  getProjectsByStatus,
  getAllBoardMembers,
} from "@/app/lib/firestore"; // Adjust as needed

export default function HomePage() {
  // State to store data from Firestore
  const [upcomingProjects, setUpcomingProjects] = useState<any[]>([]);
  const [pastProjects, setPastProjects] = useState<any[]>([]);
  const [boardPreview, setBoardPreview] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      // Fetch only a few upcoming projects
      const upcoming = await getProjectsByStatus("upcoming");
      // For example, limit to the first 3
      const upcomingLimited = upcoming.slice(0, 3);

      // Fetch only a few past projects
      const past = await getProjectsByStatus("past");
      const pastLimited = past.slice(0, 3);

      // Fetch board members, limit to 4 for preview
      const boardData = await getAllBoardMembers();
      const boardLimited = boardData.slice(0, 4);

      setUpcomingProjects(upcomingLimited);
      setPastProjects(pastLimited);
      setBoardPreview(boardLimited);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="p-8">Loading homepage data...</div>;
  }

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative flex items-center justify-center h-[60vh] bg-gradient-to-r from-green-700 to-green-500 text-white">
        <div className="text-center px-4 max-w-2xl">
          {/* Centered Logo and Text */}
          <div className="flex flex-col items-center">
            {/* Replace /logo.png with your actual logo path */}
            <Image
              src="/logo.png"
              alt="Leo Club Logo"
              width={100}
              height={100}
              className="mb-4 animate-fadeIn"
              priority
            />
            <h1 className="text-4xl font-bold mb-2 animate-fadeInDown">
              Leo Club of IIT
            </h1>
            <p className="max-w-xl mt-2 animate-fadeInUp">
              Empowering youth to create positive change in our communities.
            </p>
          </div>
        </div>
      </section>

      {/* MISSION / ABOUT SNIPPET */}
      <section className="max-w-5xl mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold text-center mb-6">Our Mission</h2>
        <p className="text-center text-gray-600 leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Maiores
          dolorem laboriosam cum tempore! Quo atque vero facere dicta,
          reiciendis amet nulla ipsum commodi obcaecati quas hic veniam
          exercitationem soluta necessitatibus. Praesentium officiis quas
          tempore amet minus dicta odio magni recusandae error, totam
          asperiores.
        </p>
      </section>

      {/* UPCOMING PROJECTS PREVIEW */}
      <section className="max-w-5xl mx-auto py-12 px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Upcoming Projects</h2>
          <Link
            href="/projects/upcoming"
            className="text-green-600 hover:text-green-800 underline"
          >
            View All
          </Link>
        </div>
        {upcomingProjects.length === 0 ? (
          <p className="text-gray-600">No upcoming projects at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingProjects.map((proj) => (
              <ProjectCard key={proj.id} project={proj} />
            ))}
          </div>
        )}
      </section>

      {/* PAST PROJECTS PREVIEW */}
      <section className="max-w-5xl mx-auto py-12 px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Past Projects</h2>
          <Link
            href="/projects/past"
            className="text-green-600 hover:text-green-800 underline"
          >
            View All
          </Link>
        </div>
        {pastProjects.length === 0 ? (
          <p className="text-gray-600">No past projects found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pastProjects.map((proj) => (
              <ProjectCard key={proj.id} project={proj} />
            ))}
          </div>
        )}
      </section>

      {/* BOARD MEMBERS PREVIEW */}
      <section className="max-w-5xl mx-auto py-12 px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Meet Our Board</h2>
          <Link
            href="/board"
            className="text-green-600 hover:text-green-800 underline"
          >
            View Full Board
          </Link>
        </div>
        {boardPreview.length === 0 ? (
          <p className="text-gray-600">No board members found.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {boardPreview.map((member) => (
              <BoardCard key={member.id} member={member} />
            ))}
          </div>
        )}
      </section>

      {/* INSTAGRAM FEED SECTION (Placeholder) */}
      <section className="max-w-5xl mx-auto py-12 px-4">
        <h2 className="text-2xl font-bold mb-6">Follow Us on Instagram</h2>
        {/* Replace with actual Instagram embed code or library */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InstagramEmbedPost embedUrl="https://www.instagram.com/p/POST_ID_1" />
          <InstagramEmbedPost embedUrl="https://www.instagram.com/p/POST_ID_2" />
          <InstagramEmbedPost embedUrl="https://www.instagram.com/p/POST_ID_3" />
        </div>
      </section>

      {/* JOIN US CTA */}
      <section className="max-w-5xl mx-auto py-12 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Join the Leo Club?</h2>
        <p className="mb-4">Become a member and make a difference!</p>
        <a
          href="https://docs.google.com/forms/d/YOUR_FORM_ID"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700 transition"
        >
          Apply Now
        </a>
      </section>
    </>
  );
}

// =============== SMALLER COMPONENTS ===============

function ProjectCard({ project }: { project: any }) {
  const { id, title, description, images, location } = project;
  return (
    <div className="bg-white rounded shadow p-4 hover:shadow-md transition hover:scale-[1.01]">
      {/* Show first image as thumbnail if available */}
      {images && images.length > 0 && (
        // Using <Image> for optimization, or you can use <img> if you prefer
        <img
          src={images[0]}
          alt={title}
          className="w-full h-40 object-cover rounded mb-2"
        />
      )}
      <h3 className="text-lg font-bold mb-1">{title}</h3>
      {location && <p className="text-sm text-gray-600 mb-1">{location}</p>}
      <p className="text-sm text-gray-700 line-clamp-3">{description}</p>

      <Link
        href={`/projects/${id}`}
        className="text-green-600 underline text-sm mt-2 block"
      >
        Read More
      </Link>
    </div>
  );
}

function BoardCard({ member }: { member: any }) {
  const { name, position, photoUrl } = member;
  return (
    <div className="bg-white rounded shadow p-4 flex flex-col items-center hover:scale-[1.01] transition transform">
      <img
        src={photoUrl || "/default-user.png"}
        alt={name}
        className="w-24 h-24 object-cover rounded mb-2"
      />
      <h3 className="font-semibold">{name}</h3>
      <p className="text-sm text-gray-600">{position}</p>
    </div>
  );
}

// Minimal Instagram embed component
function InstagramEmbedPost({ embedUrl }: { embedUrl: string }) {
  return (
    <div className="bg-white rounded shadow p-4">
      {/* For real embed, see a library like 'react-instagram-embed' or the official IG embed code */}
      <iframe
        src={embedUrl}
        className="w-full"
        height="450"
        scrolling="no"
        allow="autoplay; encrypted-media"
        allowFullScreen
      />
    </div>
  );
}
