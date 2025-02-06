/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getProjectsByStatus } from "@/app/lib/firestore";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";

export default function PastProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const data = await getProjectsByStatus("past");
      setProjects(data);
      setFilteredProjects(data);
      setLoading(false);
    })();
  }, []);

  const years = [...new Set(projects.map(p => 
    new Date(p.startDate.seconds * 1000).getFullYear()
  ))].sort((a, b) => b - a);

  const handleYearFilter = (year: number | null) => {
    setSelectedYear(year);
    if (year === null) {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter(p => 
        new Date(p.startDate.seconds * 1000).getFullYear() === year
      );
      setFilteredProjects(filtered);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white/60 text-lg font-light">Loading past projects...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed w-full z-50 bg-black/90 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-light mb-6"
          >
            Past Projects
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-white/60 font-light"
          >
            Explore our history of successful projects and their impact
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Year Filter */}
          <div className="flex items-center gap-4 mb-12 overflow-x-auto pb-4">
            <button
              onClick={() => handleYearFilter(null)}
              className={`px-6 py-2 rounded-full border transition-all ${
                selectedYear === null
                  ? 'border-purple-500 text-purple-400'
                  : 'border-white/10 text-white/60 hover:border-white/20'
              }`}
            >
              All Years
            </button>
            {years.map(year => (
              <button
                key={year}
                onClick={() => handleYearFilter(year)}
                className={`px-6 py-2 rounded-full border transition-all ${
                  selectedYear === year
                    ? 'border-purple-500 text-purple-400'
                    : 'border-white/10 text-white/60 hover:border-white/20'
                }`}
              >
                {year}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-white/5"
                >
                  {/* Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black z-10" />
                  
                  {/* Project Image */}
                  {project.images && project.images[0] ? (
                    <Image
                      src={project.images[0]}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20" />
                  )}
                  
                  {/* Content Overlay */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end z-20">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-purple-300">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(project.startDate.seconds * 1000), 'MMMM d, yyyy')}
                      </div>
                      <h3 className="text-xl font-light group-hover:text-purple-300 transition-colors">
                        {project.title}
                      </h3>
                      {project.location && (
                        <p className="text-sm text-white/60">
                          {project.location}
                        </p>
                      )}
                      <p className="text-sm text-white/60 line-clamp-2">
                        {project.description}
                      </p>
                      <Link
                        href={`/projects/${project.id}`}
                        className="inline-block text-sm text-white/80 hover:text-white transition-colors mt-4"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-white/60">No projects found for this period</p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}