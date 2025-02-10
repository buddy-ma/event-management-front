import { useEffect, useState, useCallback } from "react";
import { useEvents } from "@/hooks/useEvents";
import { useAuth } from "@/hooks/useAuth";
import echo from "@/lib/echo";
import { Event, EventCategory } from "@/src/types/event";
import toast from "react-hot-toast";

interface EventCardProps {
  event: Event;
  onJoin: (eventId: number) => Promise<void>;
  onLeave: (eventId: number) => Promise<void>;
}

const EventCard = ({ event, onJoin, onLeave }: EventCardProps) => (
  <div className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
        <span className="inline-block px-2 py-1 text-sm rounded-full bg-purple-100 text-purple-800 mt-2">
          {event.category}
        </span>
      </div>
      <div className="text-sm text-gray-500">
        {new Date(event.start_date).toLocaleDateString()}
      </div>
    </div>

    <p className="mt-2 text-gray-600">{event.description}</p>

    <div className="mt-4 flex items-center justify-between">
      <div className="flex items-center">
        <svg
          className="w-5 h-5 text-gray-500 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <span className="text-gray-600">{event.location}</span>
      </div>
      <div className="flex items-center">
        <span className="text-sm text-gray-500 mr-4">
          {event.participants_count}/{event.max_participants} participants
        </span>
        {event.can_join ? (
          <button
            onClick={() => onJoin(event.id)}
            disabled={event.is_full}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              event.is_full
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-purple-600 text-white hover:bg-purple-700"
            }`}
          >
            {event.is_full ? "Full" : "Join"}
          </button>
        ) : (
          <button
            onClick={() => onLeave(event.id)}
            className="px-4 py-2 rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-700"
          >
            Leave
          </button>
        )}
      </div>
    </div>
  </div>
);

export default function EventsList() {
  const { events, loading, error, fetchEvents, joinEvent, leaveEvent } =
    useEvents();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | "">(
    ""
  );
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = useCallback(async () => {
    await fetchEvents({
      category: selectedCategory || undefined,
      search: searchQuery || undefined,
      page: 1,
    });
  }, [fetchEvents, selectedCategory, searchQuery]);

  const handleJoin = async (eventId: number) => {
    try {
      await joinEvent(eventId);
      toast.success("Successfully joined the event!");
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleLeave = async (eventId: number) => {
    try {
      await leaveEvent(eventId);
      toast.success("Successfully left the event");
    } catch (error) {
      // Error is handled by the hook
    }
  };

  useEffect(() => {
    handleSearch();

    const channel = echo.channel("events");

    channel.listen(".event.created", (e: { event: Event }) => {
      toast.success("New event created!");
      handleSearch();
    });

    channel.listen(".event.updated", (e: { event: Event }) => {
      toast.success("An event was updated");
      handleSearch();
    });

    channel.listen(".event.deleted", (e: { eventId: number }) => {
      toast.success("An event was deleted");
      handleSearch();
    });

    return () => {
      channel.unsubscribe();
    };
  }, [handleSearch]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8 space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">Events</h2>

        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <select
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(e.target.value as EventCategory)
            }
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Categories</option>
            <option value="social">Social</option>
            <option value="sports">Sports</option>
            <option value="education">Education</option>
            <option value="entertainment">Entertainment</option>
            <option value="other">Other</option>
          </select>

          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Search
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          Error: {error}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center text-gray-500 py-12">No events found</div>
      ) : (
        <div className="space-y-6">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onJoin={handleJoin}
              onLeave={handleLeave}
            />
          ))}
        </div>
      )}
    </div>
  );
}
