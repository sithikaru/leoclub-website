/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { getProjectById } from "@/app/lib/firestore";
import Image from "next/image";

export default function ProjectDetailsPage() {
  const params = useParams();
  const projectId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // State for expanded image
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Close the expanded image on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedImage(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!projectId) return;

    const fetchProject = async () => {
      try {
        const data = await getProjectById(projectId);
        if (!data) {
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

  // Parallax setup
  const { scrollYProgress } = useScroll();
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const headerY = useTransform(scrollYProgress, [0, 1], [0, 100]);

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
  const formattedDate = startDate?.seconds
    ? new Date(startDate.seconds * 1000).toDateString()
    : null;
  const heroImage = images && images.length > 0 ? images[0] : null;

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* 
        ===================
        HERO SECTION
        ===================
      */}
      <section className="relative h-[60vh] w-full flex items-center justify-center overflow-hidden">
        <motion.div
          style={{ y: parallaxY }}
          className="absolute inset-0 will-change-transform"
        >
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
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black" />
        </motion.div>

        <motion.div
          className="relative z-20 text-center px-4"
          style={{ y: headerY }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-4xl md:text-5xl font-light mb-4"
          >
            {title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xs sm:text-sm text-white/60 font-light"
          >
            {location || "No location available"}
            {formattedDate && ` | ${formattedDate}`}
          </motion.p>
        </motion.div>
      </section>

      {/* 
        ===================
        CONTENT SECTION
        ===================
      */}
      <section className="w-full py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <p className="text-white/80 font-medium leading-relaxed text-xl w-full">
            {description || "No description available."}
          </p>
        </motion.div>

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
                  onClick={() => setSelectedImage(imgUrl)}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/30 z-10 pointer-events-none" />
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
          <div className="mb-12">
            {(!images || images.length === 0) && (
              <div className="aspect-[16/9] bg-gradient-to-r from-purple-600/20 to-blue-600/20 flex items-center justify-center rounded-lg">
                <p className="text-white/60">No images available</p>
              </div>
            )}
          </div>
        )}

        {/* Expanded Photo View */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              key="expanded-image-modal"
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
            >
              <motion.div
                className="relative max-w-3xl w-full"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-black/40 text-white rounded-full px-3 py-1"
                  onClick={() => setSelectedImage(null)}
                >
                  Close
                </button>
                <div className="relative aspect-[4/3]">
                  <Image
                    src={selectedImage}
                    fill
                    alt="Expanded"
                    className="object-contain"
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
          <div></div>
        )}
      </section>
    </div>
  );
}