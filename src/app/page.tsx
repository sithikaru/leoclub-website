/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  getProjectsByStatus,
  getAllBoardMembers,
  getStats,
} from "@/app/lib/firestore";

export default function HomePage() {
  const [stats, setStats] = useState<any>({});
  const [upcomingProjects, setUpcomingProjects] = useState<any[]>([]);
  const [pastProjects, setPastProjects] = useState<any[]>([]);
  const [boardPreview, setBoardPreview] = useState<any[]>([]);

  // States for the overlay menu
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const statsData = await getStats(); // Ensure your Firestore data includes 'completedProjects' & 'plannedProjects'
      const upcoming = await getProjectsByStatus("upcoming");
      const past = await getProjectsByStatus("past");
      const board = await getAllBoardMembers();

      setStats(statsData);
      setUpcomingProjects(upcoming.slice(0, 3));
      setPastProjects(past.slice(0, 3));
      setBoardPreview(board.slice(0, 4));
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans relative">
      

      {/* FULL-PAGE OVERLAY MENU */}
      <nav
        className={`fixed inset-0 z-60 bg-black bg-opacity-95 p-8 transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          onClick={() => setMenuOpen(false)}
          className="text-white text-2xl absolute top-8 right-8 focus:outline-none"
        >
          &times;
        </button>
        <div className="mt-16 flex flex-col items-center space-y-8 text-xl font-semibold">
          <Link href="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link href="/projects/upcoming" onClick={() => setMenuOpen(false)}>
            Upcoming Projects
          </Link>
          <Link href="/projects/past" onClick={() => setMenuOpen(false)}>
            Past Projects
          </Link>
          <Link href="/board" onClick={() => setMenuOpen(false)}>
            Our Board
          </Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)}>
            Contact Us
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative flex flex-col items-center justify-center h-[90vh] pt-20">
        {/* Large Hero Background Image or Gradient */}
        <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-4 tracking-wide">
            Empowering Youth.<br className="hidden md:block" />
            <span className="text-gray-200">Inspiring Change.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-8">
            Together we serve, together we grow, and together we lead our communities
            towards a brighter future.
          </p>
          <Link
            href="#mission"
            className="inline-block bg-white text-black font-semibold px-6 py-3 hover:bg-gray-300 transition-all rounded-md"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* MISSION SECTION */}
      <section
        id="mission"
        className="max-w-6xl mx-auto py-20 px-4 text-center border-b border-neutral-800"
      >
        <h2 className="text-4xl font-bold mb-6 tracking-wider uppercase">Our Mission</h2>
        <p className="text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto">
          We are dedicated to empowering youth to lead impactful change in our communities
          through collaboration, leadership, and service. Our club aims to foster responsible
          citizens and leaders who strive to make a positive difference in every step they
          take.
        </p>
      </section>

      {/* STATISTICS SECTION (Animated Counters) */}
      <section
        id="impact"
        className="max-w-6xl mx-auto py-20 px-4 border-b border-neutral-800 text-center"
      >
        <h2 className="text-4xl font-bold mb-8 tracking-wider uppercase">Our Impact</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <CounterCard
            endValue={stats.completedProjects || 0}
            label="Projects Completed"
          />
          <CounterCard
            endValue={stats.plannedProjects || 0}
            label="Projects Planned"
          />
        </div>
      </section>

      {/* UPCOMING PROJECTS */}
      <ProjectsSection
        title="Upcoming Projects"
        projects={upcomingProjects}
        link="/projects/upcoming"
      />

      {/* PAST PROJECTS */}
      <ProjectsSection
        title="Past Projects"
        projects={pastProjects}
        link="/projects/past"
      />

      {/* MEET OUR BOARD */}
      <BoardSection members={boardPreview} />

      {/* CONTACT US SECTION */}
      <section id="contact" className="max-w-6xl mx-auto py-20 px-4 border-t border-neutral-800">
        <h2 className="text-4xl font-bold text-center mb-8 tracking-wider uppercase">
          Contact Us
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="relative overflow-hidden rounded-lg bg-neutral-800 shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31686.658329217243!2d79.84997434862616!3d6.8795309827192295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae25bc8a3c64b17%3A0x6471b91e2d1235e0!2sGP%20Square%2C%20Bambalapitiya!5e0!3m2!1sen!2slk!4v1639181376576!5m2!1sen!2slk"
              className="w-full h-[320px] md:h-full"
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>

          <form
            className="flex flex-col space-y-4 bg-neutral-900 p-8 rounded-lg shadow-lg"
            onSubmit={(e) => {
              e.preventDefault();
              // Handle Firebase email sending logic
            }}
          >
            <h3 className="text-xl font-semibold mb-2">Drop Us a Message</h3>
            <input
              type="text"
              placeholder="Your Name"
              className="border border-neutral-700 rounded-md p-3 bg-black text-white placeholder-gray-400 focus:border-gray-500 focus:outline-none"
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              className="border border-neutral-700 rounded-md p-3 bg-black text-white placeholder-gray-400 focus:border-gray-500 focus:outline-none"
              required
            />
            <textarea
              placeholder="Your Message"
              className="border border-neutral-700 rounded-md p-3 bg-black text-white placeholder-gray-400 focus:border-gray-500 focus:outline-none"
              rows={4}
              required
            ></textarea>
            <button
              type="submit"
              className="bg-white text-black py-3 rounded-md font-semibold hover:bg-gray-200 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 border-t border-neutral-800 bg-black text-center text-gray-400">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Leo Club of IIT. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

/* ====================================================== */
/* ========== SUB COMPONENTS ============================ */
/* ====================================================== */

/**
 * ProjectsSection
 * Displays a title, a list of projects, and a link to more.
 */
function ProjectsSection({ title, projects, link }: any) {
  return (
    <section className="max-w-6xl mx-auto py-20 px-4 border-b border-neutral-800">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold tracking-wider">{title}</h2>
        <Link href={link} className="text-gray-300 hover:text-gray-100 transition underline">
          View All
        </Link>
      </div>

      {projects.length === 0 ? (
        <p className="text-gray-500">No projects found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((project: any) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </div>
      )}
    </section>
  );
}

/**
 * ProjectCard
 * Displays a single project's image, title, and summary.
 */
function ProjectCard({ id, title, description, images }: any) {
  return (
    <div className="bg-neutral-900 rounded-lg shadow-lg p-6 hover:shadow-xl transition flex flex-col">
      <div className="relative w-full h-48 mb-4 overflow-hidden rounded-md bg-black">
        {images && images[0] ? (
          <Image
            src={images[0]}
            alt={title}
            fill
            className="object-cover hover:scale-105 transition-transform"
          />
        ) : (
          <div className="flex items-center justify-center h-full w-full text-gray-500">
            No Image
          </div>
        )}
      </div>
      <h3 className="text-lg font-bold mb-2 text-gray-100">{title}</h3>
      <p className="text-gray-400 text-sm line-clamp-3 flex-grow">{description}</p>
      <Link
        href={`/projects/${id}`}
        className="mt-4 inline-block text-sm text-white underline hover:text-gray-200"
      >
        Read More
      </Link>
    </div>
  );
}

/**
 * BoardSection
 * Displays a grid of board members.
 */
function BoardSection({ members }: any) {
  return (
    <section className="max-w-6xl mx-auto py-20 px-4 border-b border-neutral-800">
      <h2 className="text-4xl font-bold text-center mb-8 tracking-wider uppercase">
        Meet Our Board
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {members.map((member: any) => (
          <BoardCard key={member.id} {...member} />
        ))}
      </div>
    </section>
  );
}

/**
 * BoardCard
 * Displays a single board member's name, position, and photo.
 */
function BoardCard({ name, position, photoUrl }: any) {
  return (
    <div className="bg-neutral-900 rounded-lg shadow-lg p-6 flex flex-col items-center text-center">
      <div className="relative w-20 h-20 mb-4 overflow-hidden rounded-full bg-black">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={name}
            fill
            className="object-cover hover:scale-105 transition-transform"
          />
        ) : (
          <Image
            src="/default-user.png"
            alt={name}
            fill
            className="object-cover hover:scale-105 transition-transform"
          />
        )}
      </div>
      <h4 className="font-semibold text-white">{name}</h4>
      <p className="text-sm text-gray-400">{position}</p>
    </div>
  );
}

/**
 * CounterCard
 * Simple animated counter from 0 to `endValue`.
 */
function CounterCard({ endValue, label }: { endValue: number; label: string }) {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    let current = 0;
    const increment = Math.ceil(endValue / 10); 
    // 50 steps in this example. Adjust as desired.

    const timer = setInterval(() => {
      current += increment;
      if (current >= endValue) {
        clearInterval(timer);
        setCount(endValue);
      } else {
        setCount(current);
      }
    }, 300); // 30ms interval for smoother animation

    return () => clearInterval(timer);
  }, [endValue]);

  return (
    <div className="bg-neutral-900 rounded-lg p-8 shadow-lg flex flex-col items-center justify-center">
      <h3 className="text-6xl font-extrabold text-white mb-2">{count}</h3>
      <p className="text-gray-400 text-lg uppercase tracking-wider">{label}</p>
    </div>
  );
}
