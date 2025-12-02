// filepath: src/app/events/EventDetailCard.tsx (or wherever your events component lives)
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

// utility helpers
import { calculateDaysRemaining, formatDate } from "@/lib/utils";

// Event type import (adjust path if different)
import type { Event } from "@/lib/types";

import { Button } from "@/components/ui/button";

export const EventCard: React.FC<{ event: Event }> = ({ event }) => {
  return (
    <Card className="group h-full overflow-hidden bg-card/50 backdrop-blur-sm transition-all flex flex-col">
      <Link href={`/events/${event.uid}`} className="block relative h-48 overflow-hidden">
        <Image
          src={event.banner_url || "/placeholder_event.jpg"}
          alt={event.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 33vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-3 left-3 flex gap-2">
          <Badge variant="secondary" className="bg-background/80 backdrop-blur-md">
            {event.category}
          </Badge>
          {event.is_team_event && (
            <Badge variant="outline" className="bg-black/50 text-white border-white/20 backdrop-blur-md">
              Team Event
            </Badge>
          )}
        </div>

        {event.start_time && (
          <div className="absolute top-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-md border border-white/10">
            {calculateDaysRemaining(event.start_time)} days left
          </div>
        )}
      </Link>

      <CardContent className="p-5 flex flex-col flex-grow">
        <Link href={`/events/${event.uid}`} className="block">
          <h3 className="mb-2 line-clamp-1 text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
            {event.name}
          </h3>
        </Link>
        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground flex-grow">
          {event.description}
        </p>

        <div className="flex flex-col gap-4 mt-auto">
          <div className="flex flex-col gap-2.5 text-sm text-muted-foreground">
            {event.start_time && (
              <div className="flex items-center gap-2.5">
                <CalendarDays className="h-4 w-4 text-primary" />
                <span>{formatDate(event.start_time)}</span>
              </div>
            )}
            <div className="flex items-center gap-2.5">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{event.venue}</span>
            </div>
          </div>

          <Button asChild className="w-full" size="sm">
            <Link href={event.registration_link || "#"} target="_blank" rel="noopener noreferrer">
              Enroll
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Note: I kept your original exported name but corrected the spelling here.
// If you prefer the prior (typo) name, swap accordingly.
export const EventsComponent: React.FC<{ total: number; events: Event[] }> = ({
  total,
  events,
}) => {
  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <CalendarDays className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">No events found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search or filters to find what you&apos;re looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
      {events.map((event) => (
        <EventCard key={event.uid} event={event} />
      ))}
    </div>
  );
};
