"use client";

import {
  CalendarDays,
  Clock,
  MapPin,
  Users,
  Mail,
  Phone,
  AlertTriangle,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import type { Event } from "@/lib/types";
import { useState } from "react";
import { calculateDaysRemaining, formatDate, formatTime } from "@/lib/utils";
import RegistrationModal from "./registration-modal";
import { useAuth } from "@/app/AuthProvider";
import { useRouter } from "next/navigation";

export default function EventFullInfo({ event }: { event: Event }) {
  const [copied, setCopied] = useState(false);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const eventUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/events/${event.uid}`
      : "";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(eventUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        const shareData: ShareData = {
          title: event.name,
          text: event.description,
          url: eventUrl,
        };

        // Try adding banner if supported
        if (
          event.banner_url &&
          navigator.canShare &&
          navigator.canShare({ files: [] })
        ) {
          const response = await fetch(event.banner_url);
          const blob = await response.blob();
          const file = new File([blob], "banner.jpg", { type: blob.type });
          shareData.files = [file];
        }

        await navigator.share(shareData);
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      // fallback: copy link
      try {
        await navigator.clipboard.writeText(eventUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        alert("Link copied to clipboard!");
      } catch (err) {
        console.error("Clipboard write failed:", err);
      }
    }
  };

  const daysRemaining = calculateDaysRemaining(event.start_time!);
  const isRegistrationOpen =
    new Date() < new Date(event.registration_deadline!);
  const registrationDeadlineFormatted = formatDate(
    event.registration_deadline!
  );

  const registrationClick = () => {
    if (!isRegistrationOpen) return;
    if (!user) {
      router.push("/login"); // redirect to login
    } else {
      setIsRegistrationModalOpen(true); // open modal
    }
  };

  return (
    <div className="container mx-auto md:px-4 py-4 md:py-8 max-w-7xl">
      {/* Hero Section */}
      <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-xl overflow-hidden mb-6 md:mb-8">
        <Image
          src={event.banner_url || "/placeholder.svg"}
          alt={event.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4 md:p-8">
          <Badge className="mb-2 w-fit" variant="secondary">
            {event.category}
          </Badge>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
            {event.name}
          </h1>
          <div className="flex flex-wrap gap-2 md:gap-4 text-white text-sm md:text-base">
            <div className="flex items-center gap-1">
              <CalendarDays className="h-3 w-3 md:h-4 md:w-4" />
              <span>{formatDate(event.start_time!)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 md:h-4 md:w-4" />
              <span>
                {formatTime(event.start_time!)} - {formatTime(event.end_time!)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3 md:h-4 md:w-4" />
              <span>{event.venue}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Event Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Countdown and Registration */}
          <Card className="bg-muted/50">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <h3 className="text-base md:text-lg font-semibold mb-1">
                    Event starts in
                  </h3>
                  <div className="text-2xl md:text-3xl font-bold">
                    {daysRemaining} days
                  </div>
                </div>
                <Button
                  size="lg"
                  className="w-full sm:w-auto"
                  disabled={!isRegistrationOpen}
                  onClick={registrationClick}
                >
                  {isRegistrationOpen ? "Register Now" : "Registration Closed"}
                </Button>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground mt-2">
                Registration deadline: {registrationDeadlineFormatted}
              </p>
            </CardContent>
          </Card>

          {/* Description */}
          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">
              About This Event
            </h2>
            <p className="text-base md:text-lg leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Rules */}
          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">
              Rules & Guidelines
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                <p>{event.rules}</p>
              </div>
              <div className="flex items-start gap-2">
                <Trophy className="h-5 w-5 text-yellow-500 mt-0.5" />
                <p>Exciting prizes for winning teams!</p>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">
              Event Schedule
            </h2>
            <div className="space-y-4">
              {/* Stage 1 */}
              {event.start_time && (
                <div className="flex flex-col border-l-2 border-primary pl-4 pb-4">
                  <span className="text-sm text-muted-foreground">
                    {formatDate(event.start_time)},{" "}
                    {formatTime(event.start_time)}
                  </span>
                  <h3 className="font-semibold">Opening Session</h3>
                  <p className="text-sm">
                    Welcome note and overview of the event proceedings.
                  </p>
                </div>
              )}

              {/* Stage 2 */}
              {event.start_time && (
                <div className="flex flex-col border-l-2 border-primary pl-4 pb-4">
                  <span className="text-sm text-muted-foreground">
                    {formatDate(event.start_time)},{" "}
                    {formatTime(event.start_time)}
                  </span>
                  <h3 className="font-semibold">Main Program Begins</h3>
                  <p className="text-sm">
                    Participants engage in scheduled event activities.
                  </p>
                </div>
              )}

              {/* Stage 3 */}
              {event.end_time && (
                <div className="flex flex-col border-l-2 border-primary pl-4 pb-4">
                  <span className="text-sm text-muted-foreground">
                    {formatDate(event.end_time)}, {formatTime(event.end_time)}
                  </span>
                  <h3 className="font-semibold">Main Program Ends</h3>
                  <p className="text-sm">
                    Participants wrap up their activities and prepare for
                    closing.
                  </p>
                </div>
              )}

              {/* Stage 4 */}
              {event.end_time && (
                <div className="flex flex-col border-l-2 border-primary pl-4">
                  <span className="text-sm text-muted-foreground">
                    {formatDate(event.end_time)}, {formatTime(event.end_time)}
                  </span>
                  <h3 className="font-semibold">Closing Remarks</h3>
                  <p className="text-sm">
                    Concluding address, feedback, and acknowledgments.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Event Details Card */}
          <Card>
            <CardContent className="p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">
                Event Details
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CalendarDays className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium">Date & Time</h4>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(event.start_time!)},{" "}
                      {formatTime(event.start_time!)} to
                      <br />
                      {formatDate(event.end_time!)},{" "}
                      {formatTime(event.end_time!)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium">Location</h4>
                    <p className="text-sm text-muted-foreground">
                      {event.venue}
                    </p>
                  </div>
                </div>
                {event.is_team_event && (
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium">Team Size</h4>
                      <p className="text-sm text-muted-foreground">
                        {event.team_size_min} to {event.team_size_max} members
                        per team
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium">Capacity</h4>
                    <p className="text-sm text-muted-foreground">
                      Maximum {event.max_capacity} participants
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardContent className="p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">
                Contact Organizers
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium">Email</h4>
                    <a
                      href={`mailto:${event.contact_email}`}
                      className="text-sm text-primary hover:underline"
                    >
                      {event.contact_email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium">Phone</h4>
                    <a
                      href={`tel:${event.contact_phone}`}
                      className="text-sm text-primary hover:underline"
                    >
                      {event.contact_phone}
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Share Event */}
          <Card>
            <CardContent className="p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">
                Share Event
              </h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={handleCopyLink}
                >
                  {copied ? "Copied!" : "Copy Link"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={handleShare}
                >
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Registration Modal */}
      <RegistrationModal
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
        isTeamEvent={event.is_team_event!}
        teamSizeMin={event.team_size_min}
        teamSizeMax={event.team_size_max}
        eventName={event.name}
        event_id={event.uid}
      />
    </div>
  );
}
