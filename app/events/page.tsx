'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { FaSearch, FaTrashAlt, FaCalendarPlus, FaMoon, FaSun } from 'react-icons/fa';

type Event = {
  id: number;
  name: string;
  date: string;
};

export default function EventsDashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedEvents = localStorage.getItem('events');
      if (storedEvents) setEvents(JSON.parse(storedEvents));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('events', JSON.stringify(events));
    }
  }, [events]);

  const handleAddEvent = (e: FormEvent) => {
    e.preventDefault();
    if (!eventName.trim() || !eventDate) return alert('Event Name and Date are required.');
    const newEvent: Event = { id: Date.now(), name: eventName.trim(), date: eventDate };
    setEvents([...events, newEvent]);
    setEventName('');
    setEventDate('');
  };

  const handleDeleteEvent = (id: number) =>
    setEvents(events.filter(event => event.id !== id));

  // Upcoming and past events
  const upcomingEvents = events
    .filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastEvents = events
    .filter(e => new Date(e.date) < new Date())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Filter events based on search term
  const searchedUpcomingEvents = upcomingEvents.filter(e =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const searchedPastEvents = pastEvents.filter(e =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Combined searched events for empty state check
  const totalSearchedEvents = [...searchedUpcomingEvents, ...searchedPastEvents];

  return (
    <div
      className={`${
        darkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-50 text-gray-900'
      } min-h-screen py-10 px-4 sm:px-6 lg:px-20 transition-colors duration-500`}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1
            className={`text-4xl font-extrabold tracking-tight ${
              darkMode ? 'text-gray-100' : 'text-gray-800'
            }`}
          >
            Mini Event Manager
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-700 dark:text-gray-200" />}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-6 rounded-2xl shadow-lg transform transition-transform hover:-translate-y-1 hover:shadow-2xl">
            <p className="text-gray-100/90">Total Events</p>
            <p className="text-2xl font-bold mt-2">{events.length}</p>
          </div>
          <div className="bg-gradient-to-r from-green-400 to-green-600 text-white p-6 rounded-2xl shadow-lg transform transition-transform hover:-translate-y-1 hover:shadow-2xl">
            <p className="text-gray-100/90">Upcoming Events</p>
            <p className="text-2xl font-bold mt-2">{upcomingEvents.length}</p>
          </div>
          <div className="bg-gradient-to-r from-red-400 to-red-600 text-white p-6 rounded-2xl shadow-lg transform transition-transform hover:-translate-y-1 hover:shadow-2xl">
            <p className="text-gray-100/90">Past Events</p>
            <p className="text-2xl font-bold mt-2">{pastEvents.length}</p>
          </div>
        </div>

        {/* Search Box */}
        <div className="flex items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md mb-6 border border-gray-200 dark:border-gray-700">
          <FaSearch className="text-gray-400 dark:text-gray-300 mr-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search events..."
            className="w-full p-3 focus:outline-none placeholder-gray-400 dark:placeholder-gray-300 dark:bg-gray-800 dark:text-gray-200"
          />
        </div>

        {/* Event Creation Form */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mb-10 hover:shadow-xl transition-all">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-gray-800 dark:text-gray-100">
            <FaCalendarPlus className="text-blue-600 dark:text-blue-400" /> Create New Event
          </h2>
          <form onSubmit={handleAddEvent} className="space-y-5">
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="Event Name"
              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition-colors duration-200 dark:bg-gray-700 dark:text-gray-200"
              required
            />
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 dark:bg-gray-700 dark:text-gray-200"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-4 rounded-xl hover:bg-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg"
            >
              Add Event
            </button>
          </form>
        </div>

        {/* Upcoming Events */}
        {searchedUpcomingEvents.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Next Upcoming Events</h2>
            <div className="space-y-3">
              {searchedUpcomingEvents.slice(0, 3).map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-4 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all transform hover:-translate-y-1"
                >
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">{event.name}</p>
                    <span className="inline-block mt-1 px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-200 text-sm font-medium">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-600 p-2 rounded-full transition-colors duration-200"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Past Events */}
        {searchedPastEvents.length > 0 && (
          <div className="space-y-4">
            {searchedPastEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-600 transition-all hover:shadow-md"
              >
                <div>
                  <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{event.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-300">
                    {new Date(event.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteEvent(event.id)}
                  className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-600 p-2 rounded-full transition-colors duration-200"
                >
                  <FaTrashAlt />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Empty / No Results State */}
        {totalSearchedEvents.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 text-center py-10 text-lg">
            {events.length === 0 ? 'No events added yet. Create one above!' : 'No events match your search.'}
          </p>
        )}
      </div>
    </div>
  );
}
