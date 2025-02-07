/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getProjectById } from "@/app/lib/firestore";
import Image from "next/image";

export default function ProjectDetailsPage() {
  const params = useParams();
  const projectId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;

    const fetchProject = async () => {
      try {
        const data = await getProjectById(projectId);
        if (!data) {
          // If no project found, show a "not found" state
          setProject(null);
        } else {
          setProject(data);
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white/60 text-lg font-light">Loading project details...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white/60 text-lg font-light">Project not found.</p>
      </div>
    );
  }

  const { title, location, startDate, description, images, videoUrls } = project;

  // Format date if available
  const formattedDate = startDate?.seconds
    ? new Date(startDate.seconds * 1000).toDateString()
    : null;

  // Use the first image (if any) as the hero image
  const heroImage = images && images.length > 0 ? images[0] : null;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 
        ===================
        HERO SECTION
        ===================
      */}
      <section className="relative h-[60vh] w-full overflow-hidden flex items-center justify-center">
        {/* Hero Background Image or Placeholder */}
        {heroImage ? (
          <Image
            src={heroImage}
            alt="Hero Image"
            fill
            className="object-cover object-center"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20" />
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black z-10" />

        {/* Hero Text */}
        <div className="relative z-20 text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-light mb-4"
          >
            {title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm text-white/60 font-light"
          >
            {location || "No location available"}
            {formattedDate && ` | ${formattedDate}`}
          </motion.p>
        </div>
      </section>

      {/* 
        ===================
        CONTENT SECTION
        ===================
      */}
      <section className="px-4 py-16 max-w-6xl mx-auto justify-around">
        {/* 
          DESCRIPTION
        */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <p className="text-white/80 font-medium leading-relaxed text-xl w-4/5 text-justify">
            {description || "No description available."}
          </p>
        </motion.div>

        {/* 
          IMAGES (excluding hero image if you want to avoid duplication)
          We'll show the rest of the images in a grid.
        */}
        {images && images.length > 1 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <AnimatePresence mode="popLayout">
              {images.slice(1).map((imgUrl: string, index: number) => (
                <motion.div
                  key={imgUrl}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-white/5"
                >
                  {/* Gradient Overlay on the image */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black z-10 pointer-events-none" />

                  {/* Project Image */}
                  <Image
                    src={imgUrl}
                    alt={`Project image ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          // If no extra images
          <div className="mb-12">
            {(!images || images.length === 0) && (
              <div className="aspect-[16/9] bg-gradient-to-r from-purple-600/20 to-blue-600/20 flex items-center justify-center rounded-lg">
                <p className="text-white/60">No images available</p>
              </div>
            )}
          </div>
        )}

        {/* 
          VIDEOS 
        */}
        {videoUrls && videoUrls.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {videoUrls.map((vidUrl: string, index: number) => (
                <motion.div
                  key={vidUrl}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="relative aspect-video bg-white/5 overflow-hidden rounded-lg"
                >
                  <iframe
                    src={vidUrl}
                    allowFullScreen
                    title={`Video ${index + 1}`}
                    className="w-full h-full"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div >
            
          </div>
        )}
      </section>
    </div>
  );
}
