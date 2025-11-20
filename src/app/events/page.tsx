export interface Event {
  uid: string;
  name: string;
  description?: string;
  category?: string;
  start_time?: string; // ISO 8601 datetime string
  end_time?: string; // ISO 8601 datetime string
  venue?: string;
  max_capacity?: number;
  is_team_event?: boolean;
  team_size_min?: number;
  team_size_max?: number;
  rules?: string;
  contact_email?: string;
  contact_phone?: string;
  registration_deadline?: string; // ISO 8601 datetime string
  created_by?: string;
  banner_url?: string;
  created_at?: string; // ISO 8601 datetime string
  updated_at?: string; // ISO 8601 datetime string
}

import { Metadata } from "next";
import { getAllEvents } from "../actions/actions";
import { EventsComponet } from "./EventDetailCard";
import { EventsFilterBar } from "./EventsFilterBar";
import { Pagination } from "./Pagination";

interface EventProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    limit?: string;
    offset?: string;
  }>;
}

export const metadata: Metadata = {
  title: "Events | Horizon Tect Fest 2025",
  description:
    "Explore upcoming keynotes, workshops, and networking events at Horizon Tect Fest 2025.",
};

const Events = async ({ searchParams }: EventProps) => {
  const {
    q = "",
    category = "all",
    limit = "9",
    offset = "0",
  } = await searchParams;

  const numericLimit = parseInt(limit, 10);
  const numericOffset = parseInt(offset, 10);


  const { data } = await getAllEvents({
    q,
    category: category !== "all" ? category : undefined,
    limit: numericLimit,
    offset: numericOffset,
  });

  if (!data || typeof data.total === "undefined" || !data.data) {
    return (
      <div className="p-10 text-center text-gray-400">
        Failed to load events.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 md:py-8 max-w-7xl">
      {/* Page Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Upcoming Events</h1>
        <p className="text-muted-foreground text-base md:text-lg">
          Discover and join exciting tech events happening around you
        </p>
      </div>

      <EventsFilterBar />


      <EventsComponet total={data.total} events={data.data} />

      <Pagination
        total={data.total ?? 0}
        limit={numericLimit}
        offset={numericOffset}
      />
    </div>
  );
};

export default Events;
