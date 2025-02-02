import "./globals.css";
import { Metadata } from "next";
import Link from "next/link";

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
        <header className="bg-white border-b sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img
                src="/logo.png"
                alt="Leo Club Logo"
                className="h-8 w-auto"
              />
              <span className="font-bold text-lg">Leo Club of IIT</span>
            </div>
            <nav className="space-x-4 hidden md:block">
              <Link href="/">Home</Link>
              <Link href="/board">Board</Link>
              <Link href="/projects/past">Past</Link>
              <Link href="/projects/upcoming">Upcoming</Link>
              <Link href="/achievements">Achievements</Link>
            </nav>
          </div>
        </header>

        <main className="min-h-screen">{children}</main>

        <footer className="bg-white border-t">
          <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Leo Club of IIT. All rights reserved.
            </p>
            <div className="space-x-4">
              <a
                href="https://instagram.com/YourInstagramHandle"
                className="text-gray-600 hover:text-green-700 transition"
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </a>
              <a
                href="mailto:info@leoclubiit.com"
                className="text-gray-600 hover:text-green-700 transition"
              >
                Email
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
