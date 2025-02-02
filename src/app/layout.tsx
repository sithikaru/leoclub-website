import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export const metadata: Metadata = {
  title: "IIT Leo",
  description: "The official website of the Leo Club of IIT",
};


export default function Layout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body>
        <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow p-4">
        <nav className="container mx-auto flex gap-4">
          <Link href="/">Home</Link>
          <Link href="/board">Board</Link>
          <Link href="/projects/past">Past Projects</Link>
          <Link href="/projects/upcoming">Upcoming Projects</Link>
          <Link href="/achievements">Achievements</Link>
        </nav>
      </header>

      <main className="flex-grow container mx-auto p-4">
        {children}
      </main>

      <footer className="bg-gray-200 p-4">
        <div className="container mx-auto">
          {/* Social media icons, feeds, etc. */}
          <p>© 2025 Leo Club of IIT</p>
        </div>
      </footer>
    </div>
      </body>
    </html>
  );
}
