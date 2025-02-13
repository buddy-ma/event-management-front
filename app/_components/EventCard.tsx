import Image from "next/image";
import { Badge } from "@/app/_components/ui/badge";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Confetti, ConfettiButton, type ConfettiRef } from "./ui/confetti";
import { useRef, useState } from "react";
import { toast } from "@/app/_components/toast/ToastService";

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

interface EventCardProps {
  event: Event;
  token: string;
  onDelete: (id: number) => void;
}

export default function EventCard({ event, token }: EventCardProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const confettiRef = useRef<ConfettiRef>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [joinedEventIds, setJoinedEventIds] = useState<number[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("joinedEvents");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  const handleClick = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/events/${event.id}/join`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 422) {
        const data = await res.json();
        toast.error(data.message);
        return;
      }

      if (!res.ok) {
        toast.error("Whoops! something went wrong");
        throw new Error("Failed to join event");
      }

      toast.success("You are now a participant of this event");
      setShowConfetti(true);
      confettiRef.current?.fire({});

      // Save joined event in localStorage
      const existingJoined = JSON.parse(
        localStorage.getItem("joinedEvents") || "[]"
      );
      if (!existingJoined.includes(event.id)) {
        localStorage.setItem(
          "joinedEvents",
          JSON.stringify([...existingJoined, event.id])
        );
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setJoinedEventIds((prev) => [...prev, event.id]);
      setShowConfetti(false);

    } catch (error) {
      toast.error("Failed to join event");
      setShowConfetti(false);
    }
  };

  return (
    <div
      key={event.id}
      className="bg-white p-4 rounded-lg shadow-md space-y-2 flex gap-4 items-center"
    >
      {showConfetti && (
        <Confetti
          ref={confettiRef}
          className="absolute left-0 top-0 z-0 size-full"
        />
      )
      }
      <div className="w-24 h-24">
        <Image
          src={event.image_url || "/bg_404.jpeg"}
          alt="Event"
          width={96}
          height={96}
          className="w-full h-full rounded"
        />
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex justify-between items-center gap-2">
          <div className="flex gap-2">
            <Badge className="bg-primary text-white h-5">
              {event.category}
            </Badge>
            <Badge
              className={`${event.is_online
                ? "bg-green-500 hover:bg-green-600"
                : "bg-red-500 hover:bg-red-600"
                } text-white h-5`}
            >
              {event.is_online ? "Online" : "Offline"}
            </Badge>
          </div>
          <div className="flex gap-2">
            {event.has_spots ? (
              <div className="relative">
                {!session?.user?.id ? (
                  <button
                    onClick={() => router.push(`/login`)}
                    className="px-4 py-2 text-xs font-medium text-blue-600 bg-blue-100 rounded-full flex gap-2 items-center justify-center hover:bg-blue-200"
                  >
                    Login
                  </button>
                ) : (
                  <div>
                    {event.user_id !== Number(session?.user.id) &&
                      !joinedEventIds.includes(event.id) &&
                      !JSON.parse(
                        localStorage.getItem("joinedEvents") || "[]"
                      ).includes(event.id) && (
                        <button
                          onClick={() => handleClick()}
                          className="px-4 py-2 text-xs font-medium text-blue-600 bg-blue-100 rounded-full flex gap-2 items-center justify-center hover:bg-blue-200"
                        >
                          Join 🎉
                        </button>
                      )}
                  </div>
                )}
              </div>
            ) : event.has_joined || joinedEventIds.includes(event.id) ? (
              <Badge className="bg-primary/30 text-white h-5">Joined</Badge>
            ) : (
              <Badge className="bg-primary/30 text-white h-5">No Spots</Badge>
            )}
          </div>
        </div>
        <h3 className="font-semibold">{event.title}</h3>
        <p className="text-sm text-gray-500 mt-2">
          {new Date(event.start_date).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <p className="text-sm text-gray-500 mt-2"> {event.address} </p>
      </div>
    </div>
  );
}
