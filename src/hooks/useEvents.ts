import { useState, useCallback } from "react";
import api from "@/lib/axios";
import {
  Event,
  EventsResponse,
  CreateEventData,
  UpdateEventData,
  EventFilters,
} from "@/src/types/event";
import toast from "react-hot-toast";

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<EventsResponse["meta"]>({
    total: 0,
    page: 1,
    last_page: 1,
  });

  const fetchEvents = useCallback(async (filters?: EventFilters) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters?.category) params.append("category", filters.category);
      if (filters?.search) params.append("search", filters.search);
      if (filters?.page) params.append("page", filters.page.toString());
      if (filters?.per_page)
        params.append("per_page", filters.per_page.toString());
      if (filters?.start_date) params.append("start_date", filters.start_date);
      if (filters?.end_date) params.append("end_date", filters.end_date);

      const response = await api.get<EventsResponse>(
        `${filters?.link}?${params.toString()}`
      );
      setEvents(response.data.data);
      setMeta(response.data.meta);
      return response.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch events";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createEvent = useCallback(async (eventData: CreateEventData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post<{ data: Event }>("/events", eventData);
      setEvents((prev) => [response.data.data, ...prev]);
      toast.success("Event created successfully");
      return response.data.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to create event";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateEvent = useCallback(async (eventData: UpdateEventData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.put<{ data: Event }>(
        `/events/${eventData.id}`,
        eventData
      );
      setEvents((prev) =>
        prev.map((event) =>
          event.id === eventData.id ? response.data.data : event
        )
      );
      toast.success("Event updated successfully");
      return response.data.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to update event";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteEvent = useCallback(async (eventId: number) => {
    try {
      setLoading(true);
      setError(null);
      await api.delete(`/events/${eventId}`);
      setEvents((prev) => prev.filter((event) => event.id !== eventId));
      toast.success("Event deleted successfully");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to delete event";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const joinEvent = useCallback(async (eventId: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post<{ data: Event }>(
        `/events/${eventId}/join`
      );
      setEvents((prev) =>
        prev.map((event) => (event.id === eventId ? response.data.data : event))
      );
      toast.success("Successfully joined event");
      return response.data.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to join event";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const leaveEvent = useCallback(async (eventId: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post<{ data: Event }>(
        `/events/${eventId}/leave`
      );
      setEvents((prev) =>
        prev.map((event) => (event.id === eventId ? response.data.data : event))
      );
      toast.success("Successfully left event");
      return response.data.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to leave event";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    events,
    setEvents,
    loading,
    error,
    meta,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    joinEvent,
    leaveEvent,
  };
};
