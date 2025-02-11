import { User } from "./auth";

export type EventCategory =
  | "social"
  | "sports"
  | "education"
  | "entertainment"
  | "other";

export interface Event {
  id: number;
  title: string;
  description: string | null;
  category: EventCategory;
  location: string;
  latitude: number | null;
  longitude: number | null;
  start_date: string;
  end_date: string | null;
  max_participants: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  host: User;
  participants: User[];
  participants_count: number;
  is_full: boolean;
  can_join: boolean;
}

export interface EventsResponse {
  data: Event[];
  meta: {
    total: number;
    page: number;
    last_page: number;
  };
}

// Additional useful types for events
export interface CreateEventData {
  title: string;
  description?: string;
  category: EventCategory;
  location: string;
  latitude?: number;
  longitude?: number;
  start_date: string;
  end_date?: string;
  max_participants: number;
  is_published?: boolean;
}

export interface UpdateEventData extends Partial<CreateEventData> {
  id: number;
}

export interface EventFilters {
  link?: string;
  category?: EventCategory;
  search?: string;
  page?: number;
  per_page?: number;
  start_date?: string;
  end_date?: string;
}
