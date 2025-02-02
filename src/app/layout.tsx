/* eslint-disable react/jsx-no-undef */
import "./globals.css";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Leo Club of IIT",
  description: "Official website for the Leo Club of IIT",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans bg-gray-50 text-gray-800">
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-sm bg-black/70 border-b border-neutral-800">
        {/* Logo / Title */}
        <Link href="/">
          <div className="flex items-center space-x-2 cursor-pointer">
        <Image src="/logo.png" alt="Leo Club Logo" width={40} height={40} />
        <span className="text-xl font-bold tracking-widest uppercase text-white">Leo Club of IIT</span>
          </div>
        </Link>

        <nav className="flex space-x-8 text-xl font-semibold text-white items-center">
          <Link href="/" >
        Home
          </Link>
          <Link href="/projects/upcoming">
        Upcoming Projects
          </Link>
          <Link href="/projects/past" >
        Past Projects
          </Link>
          <Link href="/board" >
        Our Board
          </Link>
          <Link href="/contact" >
        Contact Us
          </Link>
        </nav>
      </header>

        <main className="min-h-screen">{children}</main>

        

        <footer className="py-8 border-t border-neutral-800 bg-black text-center text-gray-400">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Leo Club of IIT. All rights reserved.
        </p>
      </footer>
      </body>
    </html>
  );
}
