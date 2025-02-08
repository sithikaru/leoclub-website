"use client"
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { getAllBoardMembers } from "@/app/lib/firestore";
import { BoardMember } from "@/app/types/BoardMember";

export default function BoardPage() {
  const [members, setMembers] = useState<BoardMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data: BoardMember[] = await getAllBoardMembers();
      // Sort members by priority in ascending order
      const sortedMembers = data.sort((a: BoardMember, b: BoardMember) => a.priority - b.priority);
      setMembers(sortedMembers);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-white/60 text-lg font-light">
          Loading board members...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 
        ======================
        HERO SECTION
        ======================
      */}
      <section className="pt-32 pb-16 px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-light mb-4"
        >
          Our Board Members
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-white/60 font-light text-lg"
        >
          Meet the dedicated members who lead our organization
        </motion.p>
      </section>

      {/* 
        ======================
        MEMBERS GRID
        ======================
      */}
      <section className="px-4 pb-16 max-w-7xl mx-auto">
        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {members.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                {/* Card Design */}
                <div className="group relative overflow-hidden rounded-lg aspect-[3/4]">
                  {/* An invisible overlay that can be used if you want 
                      a background gradient or to detect hover */}
                  <div className="absolute inset-0 transition-colors z-10" />
                  
                  {/* Member Photo or Default */}
                  {member.photoUrl ? (
                    <Image
                      src={member.photoUrl}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <Image
                      src="/default-user.png"
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}

                  {/* Name & Position */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end z-20 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                    <h4 className="text-xl font-light mb-2">{member.name}</h4>
                    <p className="text-sm text-gray-300 line-clamp-3">
                      {member.position}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        {/* If no members found */}
        {members.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-white/60">No board members found</p>
          </motion.div>
        )}
      </section>
    </div>
  );
}