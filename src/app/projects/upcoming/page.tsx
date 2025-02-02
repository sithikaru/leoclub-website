/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { getAllProjects } from "../../lib/firestore";
import Link from "next/link";

function UpcomingProjects() {
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const all = await getAllProjects();
    const filtered = all.filter((p) => p.status === "upcoming");
    setUpcoming(filtered);
  }

  // You could highlight days that have events:
  function tileContent({ date, view }: { date: Date; view: string }) {
    if (view === "month") {
      // check if any project starts on this date (assuming project.startDate is a real JS Date or converted from Timestamp)
      const dayHasEvent = upcoming.find((proj) => {
        const projDate = new Date(proj.startDate.seconds * 1000); // if using Firestore Timestamp
        return (
          projDate.getDate() === date.getDate() &&
          projDate.getMonth() === date.getMonth() &&
          projDate.getFullYear() === date.getFullYear()
        );
      });
      if (dayHasEvent) {
        return <div className="bg-green-600 text-white rounded-full px-2">Event</div>;
      }
    }
    return null;
  }

  function onDateChange(date: Date) {
    setSelectedDate(date);
  }

  // Filter to show events happening on the selected date
  const eventsOnSelectedDate = upcoming.filter((proj) => {
    const projDate = new Date(proj.startDate.seconds * 1000);
    return selectedDate &&
      projDate.toDateString() === selectedDate.toDateString();
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Upcoming Projects</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <Calendar
          onChange={onDateChange}
          value={selectedDate}
          tileContent={tileContent}
        />
        <div className="flex-1">
          {selectedDate ? (
            <>
              <h2 className="text-xl font-semibold mb-2">
                Events on {selectedDate.toDateString()}
              </h2>
              {eventsOnSelectedDate.length > 0 ? (
                eventsOnSelectedDate.map((proj) => (
                  <div key={proj.id} className="mb-4 bg-white p-4 shadow">
                    <h3 className="text-lg font-bold">{proj.title}</h3>
                    <p>{proj.description}</p>
                    <Link href={`/projects/${proj.id}`}>
                      <a className="text-blue-600 underline">View Details</a>
                    </Link>
                  </div>
                ))
              ) : (
                <p>No events on this date.</p>
              )}
            </>
          ) : (
            <p>Select a date on the calendar to see events.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default UpcomingProjects;
