import Image from "next/image";
import { Badge } from "@/app/_components/ui/badge";
import { Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEvents } from "@/src/hooks/useEvents";
import Swal from "sweetalert2";

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
}

interface EventCardProps {
    event: Event;
    token: string;
    onDelete: (id: number) => void;
}
const handleDelete = (id: number, token: string, onDelete: (id: number) => void) => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/events/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }).then(response => {
                console.log(response);
                if (response.ok) {
                    Swal.fire(
                        'Deleted!',
                        'Your event has been deleted.',
                        'success'
                    );
                    onDelete(id);
                } else {
                    Swal.fire(
                        'Error!',
                        'Failed to delete event.',
                        'error'
                    );
                }
            }).catch(error => {
                console.error('Error:', error);
                Swal.fire(
                    'Error!',
                    'Failed to delete event.',
                    'error'
                );
            });
        }
    });
}
export default function EventCard({ event, token, onDelete }: EventCardProps) {
    const router = useRouter();
    const { joinEvent, leaveEvent } = useEvents();

    return (
        <div key={event.id} className="bg-white p-4 rounded-lg shadow-md space-y-2 flex gap-4">
            <div className="w-24 h-24">
                <Image src={event.image_url || "/bg_404.jpeg"} alt="Event" width={96} height={96} className="w-full h-full rounded" />
            </div>
            <div className="flex-1 space-y-2">

                <div className="flex justify-between gap-2">
                    <div className="flex gap-2">
                        <Badge className="bg-primary text-white h-5">{event.category}</Badge>
                        <Badge className={`${event.is_online ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"} text-white h-5`}>{event.is_online ? "Online" : "Offline"}</Badge>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => router.push(`/events/${event.id}/edit`)} className="px-4 py-2 text-xs font-medium text-blue-600 bg-blue-100 rounded-full flex gap-2 items-center justify-center">
                            <Pencil /> Edit
                        </button>
                        <button onClick={() => handleDelete(event.id, token, onDelete)} className="px-4 py-2 text-xs font-medium text-red-600 bg-red-100 flex gap-2 items-center justify-center rounded-full">
                            <Trash /> Delete
                        </button>
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
        </div>
    );
}
