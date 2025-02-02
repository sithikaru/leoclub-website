/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer, Event } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { getProjectsByStatus } from "@/app/lib/firestore";
import Link from "next/link";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

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

  if (loading) return <div className="p-4">Loading upcoming projects...</div>;

  // Convert projects to Calendar Events
  const events: Event[] = projects
    .filter((p) => p.startDate?.seconds)
    .map((p) => {
      const start = new Date(p.startDate.seconds * 1000);
      const end = p.endDate?.seconds
        ? new Date(p.endDate.seconds * 1000)
        : start; // if no endDate, same day
      return {
        title: p.title,
        start,
        end,
        allDay: true,
        resource: p.id, // store doc id in resource
      };
    });

  const handleSelectEvent = (e: Event) => {
    // user clicked an event => filter the list by that event or show details
    const projId = e.resource;
    const foundProj = projects.find((proj) => proj.id === projId);
    if (foundProj) {
      setFilteredProjects([foundProj]);
      setSelectedDate(null);
    }
  };

  const handleSelectSlot = ({ start }: { start: Date }) => {
    // user clicked on a date in the calendar => filter projects by that date
    setSelectedDate(start);
    const dayProjects = projects.filter((p) => {
      if (!p.startDate?.seconds) return false;
      const s = new Date(p.startDate.seconds * 1000);
      const sDay = s.toDateString();
      const clickedDay = start.toDateString();
      return sDay === clickedDay;
    });
    setFilteredProjects(dayProjects);
  };

  const handleShowAll = () => {
    setFilteredProjects(projects);
    setSelectedDate(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Upcoming Projects</h1>
      <div className="md:flex gap-4">
        <div className="md:w-2/3 h-[500px] border p-2 mb-4 md:mb-0">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            selectable={true}
            style={{ height: "100%" }}
          />
        </div>
        <div className="md:w-1/3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold">
              {selectedDate
                ? `Projects on ${selectedDate.toDateString()}`
                : `All Upcoming Projects`}
            </h2>
            <button
              onClick={handleShowAll}
              className="bg-green-600 text-white px-3 py-1 rounded"
            >
              Show All
            </button>
          </div>
          {filteredProjects.length === 0 ? (
            <p>No upcoming projects found.</p>
          ) : (
            <div className="space-y-4">
              {filteredProjects.map((proj) => (
                <div key={proj.id} className="bg-white shadow p-4">
                  <h3 className="text-lg font-semibold">{proj.title}</h3>
                  <p className="text-sm text-gray-600">
                    {proj.location} |{" "}
                    {proj.startDate?.seconds
                      ? new Date(proj.startDate.seconds * 1000).toDateString()
                      : ""}
                  </p>
                  <p className="text-gray-700">{proj.description}</p>
                  <Link href={`/projects/${proj.id}`} className="text-blue-600 underline text-sm">
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
