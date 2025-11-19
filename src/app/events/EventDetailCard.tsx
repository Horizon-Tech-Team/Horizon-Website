"use client";

import Image from "next/image";
import eventBanner from "@/assets/eventBanner.jpg";
import { Event } from "./page";
import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { calculateDaysRemaining, formatDate } from "@/lib/utils";

export const EventCard = ({ event }: { event: Event }) => {
  return (
    <Link href={`/events/${event.uid}`} key={event.uid} className="group">
      <Card
        className="
          h-full overflow-hidden border border-black dark:border-white
          shadow-[5px_5px_0px_0px] transition-all duration-300
          hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black
          hover:shadow-[5px_5px_0px_0px_#6c6c6c]
        "
      >
        {/* Banner Section */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={event.banner_url || eventBanner}
            alt={event.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={true}
            onError={(e) => {
              e.currentTarget.src = eventBanner.src;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Badges */}
          <div className="absolute bottom-3 left-3 flex gap-2 flex-wrap">
            <Badge variant="secondary">{event.category}</Badge>
            {event.is_team_event && (
              <Badge variant="outline" className="bg-black/50 text-white">
                Team Event
              </Badge>
            )}
          </div>

          {/* Days left */}
          {event.start_time && (
            <div className="absolute top-3 right-3 rounded-md bg-black/60 px-2 py-1 text-sm font-medium text-white">
              {calculateDaysRemaining(event.start_time)} days left
            </div>
          )}
        </div>

        {/* Content Section */}
        <CardContent className="p-4">
          <h3 className="mb-2 line-clamp-1 text-xl font-bold">{event.name}</h3>
          <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
            {event.description}
          </p>

          <div className="flex flex-col gap-2 text-sm">
            {event.start_time && (
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <span>{formatDate(event.start_time)}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{event.venue}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export const EventsComponet = ({
  total,
  events,
}: {
  total: number;
  events: Event[] | null;
}) => {
  if (!events || events.length === 0 || !total) {
    return (
      <div className="text-center text-muted-foreground py-10">
        No events available.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-muted-foreground text-sm">Total: {total}</div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard key={event.uid} event={event} />
        ))}
      </div>
    </div>
  );
};
