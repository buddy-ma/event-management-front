"use client";
import { toast } from "@/app/_components/toast/ToastService";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Textarea } from "@/app/_components/ui/textarea";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { use } from "react";

export default function EditEventPage({ params }: { params: { id: number } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [event, setEvent] = useState<any>(null);
  const resolvedParams = use(params) as { id: number };

  // Redirect if not authenticated
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/events/${resolvedParams.id}`,
          {
            headers: {
              Authorization: `Bearer ${session?.user?.token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch event");
        }

        const data = await response.json();
        setEvent(data.data);
        setIsOnline(data.data.is_online);
      } catch (error) {
        toast.error("Failed to load event");
        console.error(error);
      }
    };

    if (session?.user?.token) {
      fetchEvent();
    }
  }, [resolvedParams.id, session]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const eventData = {
      title: formData.get("title"),
      description: formData.get("description"),
      start_date: formData.get("start_date"),
      end_date: formData.get("end_date"),
      address: formData.get("address"),
      max_participants: Number(formData.get("max_participants")),
      category: formData.get("category"),
      status: formData.get("status"),
      visibility: formData.get("visibility"),
      is_online: isOnline,
      online_url: isOnline ? formData.get("online_url") : null,
      tags: formData.get("tags"),
      price: Number(formData.get("price")),
      userId: session?.user?.id,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/events/${resolvedParams.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          },
          body: JSON.stringify(eventData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || "Failed to update event.";
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      toast.success("Event updated successfully.");
      router.push("/events");
    } catch (error) {
      console.error("Error updating event:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!event) {
    return <div className="container max-w-6xl mx-auto py-8 px-4 mt-20 text-center">Loading...</div>;
  }

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4 mt-20">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Left side - Image */}
        <div className="w-full md:w-1/2">
          <div className="rounded-lg overflow-hidden shadow-xl">
            <img
              src="/bg_event.jpg"
              alt="Event Creation"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-bold mb-8">Edit Event</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Event Title <span className="text-red-500">*</span>
              </label>
              <Input
                id="title"
                name="title"
                placeholder="Enter event title"
                required
                maxLength={255}
                defaultValue={event.title}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter event description"
                defaultValue={event.description}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="start_date" className="text-sm font-medium">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <Input
                  id="start_date"
                  name="start_date"
                  type="datetime-local"
                  min={new Date().toISOString().slice(0, 16)}
                  required
                  defaultValue={event.start_date?.slice(0, 16)}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="end_date" className="text-sm font-medium">
                  End Date
                </label>
                <Input
                  id="end_date"
                  name="end_date"
                  type="datetime-local"
                  min={new Date().toISOString().slice(0, 16)}
                  defaultValue={event.end_date?.slice(0, 16)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium">
                Event address <span className="text-red-500">*</span>
              </label>
              <Input
                id="address"
                name="address"
                placeholder="Enter Event address"
                required
                maxLength={255}
                defaultValue={event.address}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="price" className="text-sm font-medium">
                  Price <span className="text-red-500">*</span>
                </label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Enter event price"
                  required
                  defaultValue={event.price}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="max_participants" className="text-sm font-medium">
                  Maximum Participants <span className="text-red-500">*</span>
                </label>
                <Input
                  id="max_participants"
                  name="max_participants"
                  type="number"
                  min="1"
                  placeholder="Enter max. nbr of participants"
                  required
                  defaultValue={event.max_participants}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                className="w-full rounded-md border border-gray-300 p-2"
                required
                defaultValue={event.category}
              >
                <option value="">Select a category</option>
                <option value="social">Social</option>
                <option value="sports">Sports</option>
                <option value="education">Education</option>
                <option value="entertainment">Entertainment</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="tags" className="text-sm font-medium">
                Tags
              </label>
              <Input
                id="tags"
                name="tags"
                placeholder="Enter tags separated by commas (e.g. music, outdoor, family)"
                defaultValue={event.tags}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  className="w-full rounded-md border border-gray-300 p-2"
                  defaultValue={event.status}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="visibility" className="text-sm font-medium">
                  Visibility
                </label>
                <select
                  id="visibility"
                  name="visibility"
                  className="w-full rounded-md border border-gray-300 p-2"
                  defaultValue={event.visibility}
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isOnline}
                    onChange={(e) => setIsOnline(e.target.checked)}
                  />

                  <div className="group peer bg-white rounded-full duration-300 w-8 h-4 ring-2 ring-[#999] after:duration-300 after:bg-[#999] peer-checked:after:bg-green-500 peer-checked:ring-green-500 after:rounded-full after:absolute after:h-3 after:w-3 after:top-0.5 after:left-0.5 after:flex after:justify-center after:items-center peer-checked:after:translate-x-4 peer-hover:after:scale-95"></div>
                </label>

                <label htmlFor="is_online" className="text-sm font-medium ">
                  Is this an online event?
                </label>
              </div>
              {isOnline && (
                <div className="space-y-2">
                  <label
                    htmlFor="online_url"
                    className="text-sm font-medium leading-relaxed"
                  >
                    Online URL<span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="online_url"
                    name="online_url"
                    required
                    placeholder="Enter online URL"
                    defaultValue={event.online_url}
                  />
                </div>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Event"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
