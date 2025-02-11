import { useEffect, useState, useCallback } from "react";
import { useEvents } from "@/src/hooks/useEvents";
import { EventCategory } from "@/src/types/event";
import EventCard from "./EventCard";
import { Skeleton } from "./ui/skeleton";
import { useSession } from "next-auth/react";

interface EventsListProps {
  title: string;
  link: string;
}

export default function PersonalEventsList({ title, link }: EventsListProps) {
  const { events, loading, fetchEvents, setEvents } = useEvents();
  const { data: session } = useSession();
  const [selectedCategory] = useState<EventCategory | "">(
    ""
  );
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = useCallback(async () => {
    await fetchEvents({
      link: link,
      category: selectedCategory || undefined,
      search: searchQuery || undefined,
      page: 1,
    });
  }, [fetchEvents, selectedCategory, searchQuery, link]);

  const EventSkeleton = () => (
    <div className="bg-white p-4 rounded-lg shadow-md space-y-2 flex gap-4">
      <div className="w-24 h-24">
        <Skeleton className="w-full h-full rounded" />
      </div>
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );

  //call api
  useEffect(() => {
    if ((session?.user as any)?.token) {
      handleSearch();
    }
  }, [session, handleSearch]);

  return (
    <div className="grid grid-cols-1 gap-4">
      {loading ? (
        <>
          <h1 key={title} className="text-3xl font-bold mb-8">{title}</h1>
          <EventSkeleton key="skeleton-1" />
          <EventSkeleton key="skeleton-2" />
          <EventSkeleton key="skeleton-3" />
          <EventSkeleton key="skeleton-4" />
        </>
      ) : (
        <>
          <h1 key={title} className="text-3xl font-bold mb-8">{title}</h1>
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              token={(session?.user as any)?.token}
              onDelete={(deletedId) => {
                // Remove deleted event from state
                setEvents((prev) => prev.filter((e) => e.id !== deletedId));
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}
