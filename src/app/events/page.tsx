import { Metadata } from "next";
import { getAllEvents } from "../actions/actions";
import { EventsComponet } from "./EventDetailCard";
import { EventsFilterBar } from "./EventsFilterBar";
import { Pagination } from "./Pagination";
import { staticEvents } from "@/lib/utils";
import { Event } from "@/lib/types";
import { BrochureCard } from "./BrochureCard";

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

  let filtered = staticEvents;

  if (q) filtered = filtered.filter(e =>
    e.name.toLowerCase().includes(q.toLowerCase())
  );

  if (category !== "all")
    filtered = filtered.filter(e => e.category === category);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Upcoming Events</h1>
          <p className="text-gray-400 text-lg">
            Discover and join exciting tech events happening around you.
          </p>
        </div>
        <div className="w-full lg:w-auto">
          <BrochureCard />
        </div>
      </div>

      <EventsFilterBar />

      <EventsComponet total={filtered.length} events={filtered} />

      <Pagination
        total={filtered.length}
        limit={parseInt(limit)}
        offset={parseInt(offset)}
      />
    </div>
  );
};

export default Events;
