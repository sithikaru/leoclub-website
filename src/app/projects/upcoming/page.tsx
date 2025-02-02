/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { useEffect, useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { getAllProjects } from "@/app/lib/firestore";
import { Project } from "@/app/types/Project";

import { enUS } from "date-fns/locale/en-US";

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
  const [projects, setProjects] = useState<Project[]>([]);
  const [events, setEvents] = useState<any[]>([]); // React Big Calendar events
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const all = await getAllProjects();
    const upcoming = all.filter((p) => p.status === "upcoming");
    setProjects(upcoming);

    // Convert to RBC event objects
    const rbcEvents = upcoming.map((proj) => {
      // If you store time as a string, parse it here
      // If you store as a timestamp, convert it
      let eventDate = new Date();
      if (proj.time) {
        eventDate = new Date(proj.time); 
      }
      return {
        title: proj.title,
        start: eventDate,
        end: eventDate, // if single-day
        resource: proj, // keep a reference to the full project
      };
    });
    setEvents(rbcEvents);
    setFilteredProjects(upcoming);
    setLoading(false);
  }

  function handleSelectSlot(slotInfo: any) {
    // If user clicks an empty slot, we can filter by that day
    if (!slotInfo || !slotInfo.start) return;
    const clickedDate = slotInfo.start as Date;
    setSelectedDate(clickedDate);
    filterProjectsByDate(clickedDate);
  }

  function handleSelectEvent(e: any) {
    if (!e.resource) return;
    
    // Set the selected date from the event
    setSelectedDate(e.start);
    
    // Filter to show only this specific project
    setFilteredProjects([e.resource]);
  }

  function filterProjectsByDate(date: Date) {
    const filtered = projects.filter((proj) => {
      if (!proj.time) return false;
      const projDate = new Date(proj.time);
      return (
        projDate.toDateString() === date.toDateString()
      );
    });
    setFilteredProjects(filtered);
  }

  function showAll() {
    setSelectedDate(null);
    setFilteredProjects(projects);
  }

  if (loading) {
    return <div className="p-8">Loading upcoming projects...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Upcoming Projects</h1>

      {/* Big Calendar */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        {selectedDate ? (
          <p className="font-semibold">
            Showing events on {selectedDate.toDateString()}
          </p>
        ) : (
          <p className="font-semibold">Showing all upcoming events</p>
        )}
        <button
          onClick={showAll}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Show All
        </button>
      </div>

      {/* List of Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((proj) => (
          <div key={proj.id} className="bg-white p-4 shadow rounded">
            {proj.images && proj.images[0] && (
              <img
                src={proj.images[0]}
                alt={proj.title}
                className="w-full h-40 object-cover rounded mb-2"
              />
            )}
            <h2 className="text-xl font-bold">{proj.title}</h2>
            {proj.location && (
              <p className="text-sm text-gray-600">Location: {proj.location}</p>
            )}
            {proj.time && (
              <p className="text-sm text-gray-600">
                Time: {new Date(proj.time).toLocaleString()}
              </p>
            )}
            <p className="text-sm mt-2">{proj.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
