"use client";
import { useEffect, useCallback } from "react";
import EventCard from "./EventCard";
import { Skeleton } from "./ui/skeleton";
import { useSession } from "next-auth/react";
import { useState } from "react";
interface Event {
  id: number;
  title: string;
  image_url: string;
  description: string;
  category: string;
  address: string;
  start_date: string;
  end_date: string;
  max_participants: number;
  is_published: boolean;
  is_online: boolean;
  online_url: string;
  price: number;
  tags: string[];
  created_at: string;
  updated_at: string;
  is_host: boolean;
  user_id: number;
  has_spots: boolean;
  has_joined: boolean;
}

export default function EventsList({ apiLink }: { apiLink: string }) {
  const { data: session } = useSession();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const handleSearch = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/${apiLink}${session?.user?.id ? `?user_id=${session.user.id}` : ""
        }`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Response not OK:", response.status, errorText);
        throw new Error(
          `Failed to fetch events: ${response.status} ${errorText}`
        );
      }

      const data = await response.json();

      if (!data.data || !Array.isArray(data.data)) {
        console.error("Invalid data format received:", data);
        throw new Error("Invalid data format received from API");
      }

      setEvents(data.data);
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const EventSkeleton = () => (
    <div className="bg-white p-4 rounded-lg shadow-md space-y-2 flex gap-4">
      <div className="w-24 h-24">
        <Skeleton key="skeleton-1" className="w-full h-full rounded" />
      </div>
      <div className="flex-1 space-y-2">
        <Skeleton key="skeleton-2" className="h-4 w-3/4" />
        <Skeleton key="skeleton-3" className="h-10 w-full" />
        <Skeleton key="skeleton-4" className="h-4 w-1/2" />
      </div>
    </div>
  );

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  return (
    <div className="grid grid-cols-1 gap-4">
      {loading ? (
        <>
          <EventSkeleton key="skeleton-1" />
          <EventSkeleton key="skeleton-2" />
          <EventSkeleton key="skeleton-3" />
          <EventSkeleton key="skeleton-4" />
        </>
      ) : (
        <>
          {events.map((event, index) => (
            <EventCard
              key={index + 1}
              event={event}
              token={(session?.user as any)?.token}
              onDelete={(deletedId) => {
                setEvents((prev) => prev.filter((e) => e.id !== deletedId));
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}
