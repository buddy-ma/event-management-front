"use client";

import EventsList from "@/app/_components/EventsList";

export default function EventPage() {
  return (
    <div className="container mx-auto py-8 px-4 mt-20">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-full md:w-1/2">
          <div className="rounded-lg overflow-hidden shadow-xl">
            <img
              src="/bg_event.jpg"
              alt="Event Creation"
              className="w-full h-auto object-cover"
              loading="lazy"
            />
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-bold mb-8">All Events</h1>

          <EventsList apiLink="getEvents" />
        </div>
      </div>
    </div>
  );
}
