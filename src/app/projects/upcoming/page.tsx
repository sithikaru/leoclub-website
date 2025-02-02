/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Import animation
import { Calendar, dateFnsLocalizer, Event } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { getProjectsByStatus } from "@/app/lib/firestore";

// Localization setup
const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

export default function UpcomingProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await getProjectsByStatus("upcoming");
      setProjects(data);
      setFilteredProjects(data);
      setLoading(false);
    })();
  }, []);

  // Convert projects to Calendar Events
  const events: Event[] = projects.map((p) => ({
    title: p.title,
    start: p.startDate?.seconds ? new Date(p.startDate.seconds * 1000) : new Date(),
    end: p.endDate?.seconds ? new Date(p.endDate.seconds * 1000) : new Date(),
    allDay: true,
    resource: p.id,
  }));

  // Handle Date Selection (Add Animation)
  const handleSelectSlot = ({ start }: { start: Date }) => {
    setSelectedDate(start);
    const filtered = projects.filter((p) => {
      if (!p.startDate?.seconds) return false;
      return new Date(p.startDate.seconds * 1000).toDateString() === start.toDateString();
    });
    setFilteredProjects(filtered);

    // Add highlight class to selected cell
    document.querySelectorAll(".rbc-selected-cell").forEach((el) => {
      el.classList.remove("rbc-selected-cell");
    });

    const allCells = document.querySelectorAll(".rbc-day-bg");
    allCells.forEach((cell) => {
      if (new Date(cell.getAttribute("data-date") || "").toDateString() === start.toDateString()) {
        cell.classList.add("rbc-selected-cell");
      }
    });
  };

  // Show all projects again
  const handleShowAll = () => {
    setFilteredProjects(projects);
    setSelectedDate(null);
  };

  if (loading) return <div className="p-4 text-white text-center">Loading upcoming projects...</div>;

  return (
    <div className="min-h-screen bg-black text-white font-sans relative">
      {/* ============== HERO SECTION ============== */}
      <section className="relative flex flex-col items-center justify-center h-[70vh] pt-20">
        <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-4 tracking-wide">
            <span className="text-gray-200">Upcoming Projects</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
            Explore our calendar of upcoming events and join us in making a difference!
          </p>
        </div>
      </section>

      {/* ============== MAIN CONTENT SECTION ============== */}
      <section className="max-w-7xl mx-auto py-16 px-4">
        <div className="md:flex gap-6">
          {/* Calendar Panel */}
          <div className="md:w-2/3 bg-neutral-900 border border-neutral-800 p-4 rounded shadow mb-8 md:mb-0">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
              onSelectSlot={handleSelectSlot}
              selectable
              className="text-white bg-neutral-500"
            />
          </div>

          {/* Projects List Panel */}
          <div className="md:w-1/3 space-y-4">
            <AnimatePresence>
              {selectedDate && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className=" text-white px-4 py-2 rounded-lg text-center"
                >
                  <h2 className="text-xl font-bold">
                    Projects on {selectedDate.toDateString()}
                  </h2>
                </motion.div>
              )}
            </AnimatePresence>

            <button onClick={handleShowAll} className="bg-white text-black px-3 py-1 rounded">
              Show All
            </button>

            <AnimatePresence>
              {filteredProjects.map((proj) => (
                <motion.div
                  key={proj.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="bg-neutral-900 rounded shadow p-4 border border-neutral-800"
                >
                  <h3 className="text-lg font-semibold text-white">{proj.title}</h3>
                  <p className="mt-2 text-gray-300">{proj.description}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}
