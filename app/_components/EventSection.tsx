"use client";
import Image from "next/image";
import EventsList from "./EventsList";
import Link from "next/link";
export const EventSection = () => {
  return (
    <section className="container relative" id="events-section">
      <div className="grid place-items-center md:place-items-left lg:max-w-screen-xl gap-8 mx-auto md:mx-20 py-20 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Image
              src="/bg_event.jpg"
              alt="Event List"
              width={500}
              height={500}
              className="rounded-lg"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-8">Trending Events</h1>
            <EventsList apiLink="topEvents" />
            <div className="flex justify-start mt-4">
              <Link
                href="/events/all"
                className="text-primary bg-secondary hover:bg-secondary/80 px-4 py-2 rounded-md font-bold cursor-pointer"
              >
                See all
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
