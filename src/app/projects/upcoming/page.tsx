/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, dateFnsLocalizer, Event } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { getProjectsByStatus } from "@/app/lib/firestore";
import Link from "next/link";
import { ArrowLeft, Calendar as CalendarIcon } from "lucide-react";
import Image from "next/image";

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

  const eventClassGetter = (event: Event) => {
    const eventTypes = ['event-type-1', 'event-type-2', 'event-type-3', 'event-type-4'];
    const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    return {
      className: randomType
    };
  };

  const events: Event[] = projects.map((p) => ({
    title: p.title,
    start: p.startDate?.seconds ? new Date(p.startDate.seconds * 1000) : new Date(),
    end: p.endDate?.seconds ? new Date(p.endDate.seconds * 1000) : new Date(),
    allDay: true,
    resource: p.id,
  }));

  const handleSelectSlot = ({ start }: { start: Date }) => {
    setSelectedDate(start);
    const filtered = projects.filter((p) => {
      if (!p.startDate?.seconds) return false;
      return new Date(p.startDate.seconds * 1000).toDateString() === start.toDateString();
    });
    setFilteredProjects(filtered);
  };

  const handleShowAll = () => {
    setFilteredProjects(projects);
    setSelectedDate(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white/60 text-lg font-light">Loading upcoming projects...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-light mb-6"
          >
            Upcoming Projects
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-white/60 font-light"
          >
            Explore our calendar of upcoming events and join us in making a difference
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Calendar Panel */}
            <div className="lg:col-span-2">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-lg">
                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: 600 }}
                  onSelectSlot={handleSelectSlot}
                  eventPropGetter={eventClassGetter}
                  selectable
                  className="upcoming-calendar"
                />
              </div>
            </div>

            {/* Projects Panel */}
            <div>
              <div className="sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-purple-400" />
                    <h2 className="text-xl font-light">
                      {selectedDate 
                        ? format(selectedDate, 'MMMM d, yyyy')
                        : 'All Upcoming Projects'
                      }
                    </h2>
                  </div>
                  {selectedDate && (
                    <button 
                      onClick={handleShowAll}
                      className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      Show All
                    </button>
                  )}
                </div>

                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4">
                  <AnimatePresence mode="popLayout">
                    {(filteredProjects.length === 0 && selectedDate) ? (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="text-white/60 text-center py-8"
                      >
                        No projects scheduled for this date
                      </motion.div>
                    ) : (
                      filteredProjects.map((project) => (
                        <motion.div
                          key={project.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="project-card group relative overflow-hidden rounded-lg aspect-[3/2]"
                        >
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black z-10" />
                          {project.images && project.images[0] ? (
                            <Image
                              src={project.images[0]}
                              alt={project.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20" />
                          )}
                          <div className="absolute inset-0 p-6 flex flex-col justify-end z-20">
                            <h3 className="text-xl font-light mb-2">{project.title}</h3>
                            <p className="text-white/60 text-sm line-clamp-2 mb-4">
                              {project.description}
                            </p>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-purple-300">
                                {format(new Date(project.startDate.seconds * 1000), 'MMM d, yyyy')}
                              </span>
                              <Link
                                href={`/projects/${project.id}`}
                                className="text-white/80 hover:text-white transition-colors"
                              >
                                Learn More
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}