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
import { BoardMember } from "./types/BoardMember";

export default function HomePage() {
  const [stats, setStats] = useState<any>({});
  const [upcomingProjects, setUpcomingProjects] = useState<any[]>([]);
  const [pastProjects, setPastProjects] = useState<any[]>([]);
  const [boardPreview, setBoardPreview] = useState<any[]>([]);
  const [, setScrolled] = useState(false);

  useEffect(() => {
    fetchData();

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  async function fetchData() {
    try {
      const statsData = await getStats();
      const upcoming = await getProjectsByStatus("upcoming");
      const past = await getProjectsByStatus("past");
      const board = await getAllBoardMembers();

      console.log("Upcoming projects:", upcoming);
      console.log("Past projects:", past);

      setStats(statsData);
      setUpcomingProjects(upcoming.slice(0, 1));
      setPastProjects(past.slice(0, 2));
      setBoardPreview((board as BoardMember[]).sort((a, b) => a.priority - b.priority).slice(0, 4));
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans relative">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('/bg.jpeg')] bg-cover bg-center bg-fixed opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/60 to-black" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-light mb-8 leading-tight">
            Empowering Youth Through
            <span className="block mt-2 font-normal">Service & Leadership</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 font-light leading-relaxed">
            We believe in the power of young minds to create meaningful change
            in our communities.
          </p>
          <Link
            href="https://forms.gle/wRw6KXsh9E8tPVb18"
            className="inline-block border border-white/20 bg-white/5 backdrop-blur-sm text-white px-8 py-4 text-lg hover:bg-white/10 transition-colors rounded-full"
          >
            Join IIT Leos
          </Link>
        </div>
      </section>

     {/* Impact Stats */}
<section className="py-32 px-4 bg-white/5">
  <div className="max-w-5xl mx-auto">
    <h2 className="text-4xl font-light text-center mb-16">Our Impact</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
      <div>
        <svg
          className="w-16 h-16 mx-auto mb-6 text-white/80"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
        <CounterCard
          endValue={stats.completedProjects || 0}
          label="Projects Completed"
        />
      </div>
      <div>
        <svg
          className="w-16 h-16 mx-auto mb-6 text-white/80"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
        <CounterCard endValue={256} label="Active Members" />
      </div>
      <div>
        <svg
          className="w-16 h-16 mx-auto mb-6 text-white/80"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <CounterCard endValue={stats.plannedProjects|| 0} label="Upcoming Projects" />
      </div>
    </div>
  </div>
</section>

      {/* Mission Section */}
      <section id="mission" className="py-16 md:py-24 px-4">
        {" "}
        <div className="max-w-5xl mx-auto text-center border border-white/10 p-6 md:p-12 lg:p-20 rounded-lg">
          {" "}
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4 md:mb-8 lg:mb-12">
            Our Mission
          </h2>{" "}
          <p className="text-base md:text-lg lg:text-xl text-gray-300 leading-relaxed font-light">
            {" "}
            We are dedicated to fostering leadership and service among youth,
            creating positive change through collaborative initiatives that
            address community needs. Our approach combines innovative thinking
            with practical action, ensuring lasting impact in everything we do.{" "}
          </p>{" "}
        </div>{" "}
      </section>

      {/* Projects Preview */}
      <section className="py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-light text-center mb-16">
            Featured Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pastProjects.map((project: any) => (
              <ProjectCard key={project.id} {...project} />
            ))}
            {upcomingProjects.map((project: any) => (
              <ProjectCard key={project.id} {...project} />
            ))}
            
          </div>
        </div>
      </section>

      {/* Board Preview */}
      <section className="py-32 px-4 bg-white/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-light text-center mb-16">
            Our Leadership
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {boardPreview.map((member: any) => (
              <BoardCard key={member.id} {...member} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/board"
              className="inline-block border border-white/20 bg-white/5 text-white px-8 py-4 text-lg hover:bg-white/10 transition-colors rounded-full"
            >
              View All Members
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-32 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-light text-center mb-16">
            Get in Touch
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="h-[400px] rounded-lg overflow-hidden border border-white/5">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.9606310673216!2d79.85310937566368!3d6.895312593103874!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae25bdee494e9d3%3A0x629c2df0a6d82f99!2sIIT%20School%20Of%20Computing!5e0!3m2!1sen!2slk!4v1738821128972!5m2!1sen!2slk"
                className="w-full h-full"
                style={{ border: "none" }}
                allowFullScreen
                loading="lazy"
              />
            </div>
            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <input
                type="text"
                placeholder="Your Name"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-6 py-4 text-white placeholder:text-gray-400 focus:outline-none focus:border-white/20"
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-6 py-4 text-white placeholder:text-gray-400 focus:outline-none focus:border-white/20"
                required
              />
              <textarea
                placeholder="Your Message"
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-6 py-4 text-white placeholder:text-gray-400 focus:outline-none focus:border-white/20"
                required
              />
              <button
                type="submit"
                className="w-full border border-white/20 bg-white/5 text-white px-8 py-4 rounded-lg hover:bg-white/10 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

// Sub-components remain mostly the same but with updated styling
function ProjectCard({ id, title, description, images }: any) {
  return (
    <div className="group relative overflow-hidden rounded-lg aspect-[3/4]">
      <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors z-10" />
      {images && images[0] ? (
        <Image
          src={images[0]}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="absolute inset-0 bg-white/5" />
      )}
      <div className="absolute inset-0 p-6 flex flex-col justify-end z-20">
        <h3 className="text-xl font-light mb-2">{title}</h3>
        <p className="text-sm text-gray-300 line-clamp-3">{description}</p>
        <Link
          href={`/projects/${id}`}
          className="mt-4 inline-block text-sm border-b border-white/20 hover:border-white transition-colors pb-1"
        >
          More Details.
        </Link>
      </div>
    </div>
  );
}

function BoardCard({ name, position, photoUrl }: any) {
  return (
    <div className="group relative overflow-hidden rounded-lg aspect-[3/4]">
      <div className="absolute inset-0 transition-colors z-10" />
      {photoUrl ? (
        <Image
          src={photoUrl}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <Image
          src="/default-user.png"
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      )}
      <div className="absolute inset-0 p-6 flex flex-col justify-end z-20">
        <h4 className="text-xl font-light mb-2">{name}</h4>
        <p className="text-sm text-gray-300 line-clamp-3">{position}</p>
      </div>
    </div>
  );
}

function CounterCard({ endValue, label }: { endValue: number; label: string }) {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    let current = 0;
    const increment = Math.ceil(endValue / 50);
    const timer = setInterval(() => {
      current += increment;
      if (current >= endValue) {
        clearInterval(timer);
        setCount(endValue);
      } else {
        setCount(current);
      }
    }, 40);

    return () => clearInterval(timer);
  }, [endValue]);

  return (
    <div className="text-center">
      <h3 className="text-6xl font-light mb-4">{count}</h3>
      <p className="text-gray-400 text-lg font-light">{label}</p>
    </div>
  );
}