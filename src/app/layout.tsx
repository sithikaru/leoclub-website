"use client";

import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useState } from "react";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <html lang="en">
      <body className="font-sans bg-black text-gray-800">
        {/* HEADER */}
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-sm bg-black/70 border-b border-neutral-800">
          {/* Logo / Title */}
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/logo.png" alt="Leo Club Logo" width={40} height={40} />
            <span className="text-xl font-bold tracking-widest uppercase text-white">
              Leo Club of IIT
            </span>
          </Link>

          {/* Hamburger Button (Mobile Only) */}
          <button
            type="button"
            className="text-white md:hidden"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle Menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-12 text-white items-center">
            <Link href="/">Home</Link>
            <Link href="/projects/upcoming">Upcoming Projects</Link>
            <Link href="/projects/past">Past Projects</Link>
            <Link href="/board">Our Board</Link>
          </nav>
        </header>

        {/* Mobile Menu Overlay */}
        {menuOpen && (
          <nav className="md:hidden fixed top-[64px] left-0 right-0 bg-black/90 border-t border-neutral-800 z-40">
            <ul className="flex flex-col space-y-4 p-6 text-white text-lg">
              <li>
                <Link
                  href="/"
                  onClick={() => setMenuOpen(false)}
                  className="hover:text-gray-300 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/projects/upcoming"
                  onClick={() => setMenuOpen(false)}
                  className="hover:text-gray-300 transition-colors"
                >
                  Upcoming Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/projects/past"
                  onClick={() => setMenuOpen(false)}
                  className="hover:text-gray-300 transition-colors"
                >
                  Past Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/board"
                  onClick={() => setMenuOpen(false)}
                  className="hover:text-gray-300 transition-colors"
                >
                  Our Board
                </Link>
              </li>
            </ul>
          </nav>
        )}

        {/* MAIN CONTENT */}
        <main className="pt-20 min-h-screen">{children}</main>

        {/* FOOTER */}
        <footer className="py-8 border-t border-neutral-800 bg-black text-center text-gray-400">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Leo Club of IIT. All rights
            reserved.
          </p>
          <p><span className="text-sm">Developed by</span> Sithija Karunasena</p>
        </footer>
      </body>
    </html>
  );
}
