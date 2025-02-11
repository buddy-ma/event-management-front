"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import PersonalEventsList from "@/app/_components/PersonalEventsList";

export default function EventPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
            return;
        }
    }, [status, router]);

    if (status === "unauthenticated") {
        return null;
    }

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
                    <PersonalEventsList title="My Events" link={`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/events`} />
                </div>
            </div>
        </div>
    );
}