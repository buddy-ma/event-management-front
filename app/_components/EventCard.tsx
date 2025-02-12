import Image from "next/image";
import { Badge } from "@/app/_components/ui/badge";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";
import { ConfettiButton } from "./ui/confetti";

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
}

interface EventCardProps {
    event: Event;
    token: string;
    onDelete: (id: number) => void;
}

export default function EventCard({ event }: EventCardProps) {
    const router = useRouter();
    const { data: session } = useSession();
    return (
        <div key={event.id} className="bg-white p-4 rounded-lg shadow-md space-y-2 flex gap-4 items-center">
            <div className="w-24 h-24">
                <Image src={event.image_url || "/bg_404.jpeg"} alt="Event" width={96} height={96} className="w-full h-full rounded" />
            </div>
            <div className="flex-1 space-y-2">

                <div className="flex justify-between items-center gap-2">
                    <div className="flex gap-2">
                        <Badge className="bg-primary text-white h-5">{event.category}</Badge>
                        <Badge className={`${event.is_online ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"} text-white h-5`}>{event.is_online ? "Online" : "Offline"}</Badge>
                    </div>
                    <div className="flex gap-2">
                        {!event.is_host && (

                            <div className="relative">
                                {!session?.user ? (
                                    <button onClick={() => router.push(`/login`)} className="px-4 py-2 text-xs font-medium text-blue-600 bg-blue-100 rounded-full flex gap-2 items-center justify-center hover:bg-blue-200">
                                        Join 🎉
                                    </button>
                                ) : (
                                    (event.user_id !== session?.user.id) && (
                                        <ConfettiButton
                                            className="px-4 py-2 text-xs font-medium text-blue-600 bg-blue-100 rounded-full flex gap-2 items-center justify-center hover:bg-blue-200"
                                            eventId={event.id}
                                        >
                                            Join 🎉
                                        </ConfettiButton>
                                    )
                                )}

                            </div>
                        )}
                    </div>
                </div>
                <h3 className="font-semibold">{event.title}</h3>
                <p className="text-sm text-gray-500 mt-2">
                    {new Date(event.start_date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </p>
                <p className="text-sm text-gray-500 mt-2"> {event.address} </p>

            </div>
        </div >
    );
}
