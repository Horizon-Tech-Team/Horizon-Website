"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  MapPin,
  Users,
  Plus,
  Search,
  Filter,
  BarChart3,
  Clock,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

import { getAllEvents } from "@/app/actions/actions";
import { Event } from "@/app/events/page";
import { DeleteEventDialog } from "./DeleteEventDialog";
import { AddEventDialog } from "./AddEventDialog";
import { UpdateEventDialog } from "./UpdateEventDialog";
import LoadingLogo from "@/components/loading-logo";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedVenue, setSelectedVenue] = useState("all");
  const [deleteEvent, setDeleteEvent] = useState<Event | null>(null);
  const [updateEvent, setUpdateEvent] = useState<Event | null>(null);
  const [addEventOpen, setAddEventOpen] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await getAllEvents({ limit: 100, offset: 0 });
      setEvents(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalEvents = events.length;
    const categories = [
      ...new Set(events.map((e) => e.category || "uncategorized")),
    ];
    const venues = [...new Set(events.map((e) => e.venue || "unknown"))];

    const eventsPerCategory = categories.reduce((acc, category) => {
      acc[category] = events.filter(
        (e) => (e.category || "uncategorized") === category
      ).length;
      return acc;
    }, {} as Record<string, number>);

    const eventsPerVenue = venues.reduce((acc, venue) => {
      acc[venue] = events.filter(
        (e) => (e.venue || "unknown") === venue
      ).length;
      return acc;
    }, {} as Record<string, number>);

    const upcomingDeadlines = events
      .filter(
        (e) =>
          e.registration_deadline &&
          new Date(e.registration_deadline) > new Date()
      )
      .sort(
        (a, b) =>
          (a.registration_deadline
            ? new Date(a.registration_deadline).getTime()
            : Infinity) -
          (b.registration_deadline
            ? new Date(b.registration_deadline).getTime()
            : Infinity)
      )
      .slice(0, 5);

    return {
      totalEvents,
      categoriesCount: categories.length,
      venuesCount: venues.length,
      eventsPerCategory,
      eventsPerVenue,
      upcomingDeadlines,
    };
  }, [events]);

  // Filter events
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ??
          false);

      const matchesCategory =
        selectedCategory === "all" || event.category === selectedCategory;

      const matchesVenue =
        selectedVenue === "all" || event.venue === selectedVenue;

      return matchesSearch && matchesCategory && matchesVenue;
    });
  }, [events, searchQuery, selectedCategory, selectedVenue]);

  const handleDeleteEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((e) => e.uid !== eventId));
    setDeleteEvent(null);
  };

  const handleUpdateEvent = async () => {
    await fetchEvents();
    setUpdateEvent(null);
  };

  const getEventStatus = (event: Event) => {
    const now = new Date();
    const startTime = event.start_time ? new Date(event.start_time) : null;
    const endTime = event.end_time ? new Date(event.end_time) : null;
    const deadline = event.registration_deadline
      ? new Date(event.registration_deadline)
      : null;

    if (endTime && now > endTime)
      return { status: "completed", color: "bg-fuchsia-700" };
    if (startTime && endTime && now >= startTime && now <= endTime)
      return { status: "ongoing", color: "bg-green-500" };
    if (deadline && now > deadline)
      return { status: "registration closed", color: "bg-red-500" };
    return { status: "upcoming", color: "bg-yellow-500" };
  };

  return (
    <div className="container  max-w-7xl mx-auto py-4 md:px-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Event Management</h1>
          <p className="text-muted-foreground text-sm">
            Manage all events for Horizon Tech Fest 2025
          </p>
        </div>
        <Button onClick={() => setAddEventOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>

      {loading ? (
        <LoadingLogo />
      ) : (
        <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Events
                    </p>
                    <p className="text-2xl font-bold">{stats.totalEvents}</p>
                  </div>
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Categories
                    </p>
                    <p className="text-2xl font-bold">
                      {stats.categoriesCount}
                    </p>
                  </div>
                  <BarChart3 className="h-5 w-5 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Venues
                    </p>
                    <p className="text-2xl font-bold">{stats.venuesCount}</p>
                  </div>
                  <MapPin className="h-5 w-5 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Capacity
                    </p>
                    <p className="text-2xl font-bold">
                      {events.reduce(
                        (sum, e) => sum + (e.max_capacity ?? 0),
                        0
                      )}
                    </p>
                  </div>
                  <Users className="h-5 w-5 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Events per Category */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Events by Category</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(stats.eventsPerCategory).map(
                  ([category, count]) => (
                    <div
                      key={category}
                      className="flex items-center justify-between"
                    >
                      <span className="capitalize font-medium">{category}</span>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  )
                )}
              </CardContent>
            </Card>

            {/* Upcoming Deadlines */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Upcoming Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {stats.upcomingDeadlines.map((event) =>
                  event.registration_deadline ? (
                    <div
                      key={event.uid}
                      className="flex items-center justify-between p-2 bg-muted/50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-sm">{event.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {event.venue ?? "Unknown venue"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {format(
                            new Date(event.registration_deadline),
                            "MMM dd"
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(
                            new Date(event.registration_deadline),
                            "HH:mm"
                          )}
                        </p>
                      </div>
                    </div>
                  ) : null
                )}
                {stats.upcomingDeadlines.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No upcoming registration deadlines
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">All Events</CardTitle>
              <CardDescription>Search and filter events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search events..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-full sm:w-[160px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {Object.keys(stats.eventsPerCategory).map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedVenue} onValueChange={setSelectedVenue}>
                  <SelectTrigger className="w-full sm:w-[160px]">
                    <SelectValue placeholder="Venue" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Venues</SelectItem>
                    {Object.keys(stats.eventsPerVenue).map((venue) => (
                      <SelectItem key={venue} value={venue}>
                        {venue}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                    setSelectedVenue("all");
                  }}
                  className="w-full sm:w-auto"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>

              {/* Events List */}
              <div className="space-y-4">
                {filteredEvents.map((event) => {
                  const eventStatus = getEventStatus(event);
                  return (
                    <div
                      key={event.uid}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 mb-2">
                            <h3 className="text-lg font-semibold">
                              {event.name}
                            </h3>
                            <Badge
                              variant="outline"
                              className="capitalize w-fit"
                            >
                              {event.category}
                            </Badge>
                            <div className="flex items-center gap-1 mt-1 sm:mt-0">
                              <div
                                className={`w-2 h-2 rounded-full ${eventStatus.color}`}
                                title={eventStatus.status}
                              />
                              <span className="text-xs text-muted-foreground capitalize">
                                {eventStatus.status}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {event.description ?? "No description available"}
                          </p>
                          <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 text-sm text-muted-foreground">
                            {event.start_time && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4 shrink-0" />
                                {format(
                                  new Date(event.start_time),
                                  "MMM dd, yyyy"
                                )}
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4 shrink-0" />
                              {event.venue}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4 shrink-0" />
                              {event.max_capacity ?? 0} capacity
                            </div>

                            {event.is_team_event && (
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4 shrink-0" />
                                Team: {event.team_size_min}-
                                {event.team_size_max}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                          {/* View Button */}
                          <Button
                            size="sm"
                            variant="default"
                            asChild
                            className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                          >
                            <Link href={`/events/${event.uid}`}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Link>
                          </Button>

                          {/* Edit Button */}
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => setUpdateEvent(event)}
                            className="w-full sm:w-auto bg-amber-500 text-white hover:bg-amber-600 transition-colors cursor-pointer"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>

                          {/* Delete Button */}
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => setDeleteEvent(event)}
                            className="w-full sm:w-auto bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredEvents.length === 0 && (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No events found
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {searchQuery ||
                      selectedCategory !== "all" ||
                      selectedVenue !== "all"
                        ? "Try adjusting your search or filters"
                        : "No events have been created yet"}
                    </p>
                    <Button onClick={() => setAddEventOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Event
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Delete Event Dialog */}
          <DeleteEventDialog
            event={deleteEvent}
            onClose={() => setDeleteEvent(null)}
            onConfirm={handleDeleteEvent}
          />

          {/* Update Event Dialog */}
          <UpdateEventDialog
            event={updateEvent}
            onClose={() => setUpdateEvent(null)}
            onUpdate={handleUpdateEvent}
          />

          {/* Add Event Dialog */}
          <AddEventDialog
            open={addEventOpen}
            onClose={() => setAddEventOpen(false)}
            onAdd={async () => {
              await fetchEvents();
              setAddEventOpen(false);
            }}
          />
        </>
      )}
    </div>
  );
}
