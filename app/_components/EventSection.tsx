"use client";
import Image from "next/image";
import EventsList from "./PersonalEventsList";
// import { EventList } from "@/app/_components/EventList";
export const EventSection = () => {
    return (
        <section className="container relative">
            <div className="grid place-items-center md:place-items-left lg:max-w-screen-xl gap-8 mx-auto md:mx-20 py-20 md:py-32">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <Image src="/bg_event.jpg" alt="Event List" width={500} height={500} className="rounded-lg" />
                    </div>
                    <div>
                        <EventsList title="Trending Events" link={`${process.env.NEXT_PUBLIC_API_URL}/api/v1/topEvents`} />
                    </div>
                </div>
            </div>
        </section>
    );
};
