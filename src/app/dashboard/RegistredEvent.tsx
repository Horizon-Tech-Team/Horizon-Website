"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, User, Users } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { RegisteredEvent } from "@/lib/types";
import { motion } from "framer-motion";

type Props = { registeredEvents: RegisteredEvent[] | null };

const RegistredEvent = ({ registeredEvents }: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeTab, setActiveTab] = useState("registered");

  return (
    <motion.div
      initial={{ x: "-50%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="lg:col-span-2"
    >
      <Tabs
        defaultValue="registered"
        className="w-full"
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="registered">Registered Events</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
        </TabsList>

        <TabsContent value="registered" className="space-y-6">
          <h2 className="text-xl font-semibold mb-4">Your Registered Events</h2>

          {registeredEvents ? (
            registeredEvents.map((registration) => (
              <Card key={registration.uid} className="mb-4">
                <CardHeader className="pb-2">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
                    {/* Left side: Event info */}
                    <div>
                      <CardTitle className="text-xl">
                        {registration.event.name}
                      </CardTitle>
                      <CardDescription className="flex flex-wrap items-center gap-2 mt-1">
                        <Badge variant="outline">
                          {registration.event.category}
                        </Badge>
                        {registration.is_team_event && (
                          <Badge variant="secondary">Team Event</Badge>
                        )}
                      </CardDescription>
                    </div>

                    {/* Right side: Badges with colored dots */}
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Status Badge */}
                      {(() => {
                        let dotColor = "";
                        switch (registration.status) {
                          case "submitted":
                            dotColor = "bg-yellow-400";
                            break;
                          case "registered":
                            dotColor = "bg-blue-500";
                            break;
                          case "completed":
                            dotColor = "bg-green-500";
                            break;
                          case "cancelled":
                            dotColor = "bg-red-500";
                            break;
                          default:
                            dotColor = "bg-gray-400";
                        }
                        return (
                          <Badge
                            variant="outline"
                            className="capitalize flex items-center gap-2"
                          >
                            <div
                              className={`w-2 h-2 rounded-full ${dotColor}`}
                            ></div>
                            {registration.status}
                          </Badge>
                        );
                      })()}

                      {/* Mode Badge */}
                      {registration.mode && (
                        <Badge
                          variant="outline"
                          className="capitalize flex items-center gap-2"
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              registration.mode === "online"
                              ? "bg-green-500"
                              : "bg-primary"
                            }`}
                          ></div>
                          {registration.mode}
                        </Badge>
                      )}

                      {/* Attendance Badge */}
                      {(() => {
                        let dotColor = "";
                        switch (registration.attendance_status) {
                          case "present":
                            dotColor = "bg-green-500";
                            break;
                          case "absent":
                            dotColor = "bg-red-500";
                            break;
                          default:
                            dotColor = "bg-gray-400";
                        }
                        return (
                          <Badge
                            variant="outline"
                            className="capitalize flex items-center gap-2"
                          >
                            <div
                              className={`w-2 h-2 rounded-full ${dotColor}`}
                            ></div>
                            {registration.attendance_status ?? "pending"}
                          </Badge>
                        );
                      })()}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pb-2">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Registered on {formatDate(registration.created_at)}
                      </span>
                    </div>

                    {registration.is_team_event && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>Team: {registration.team_name}</span>
                        </div>

                        <div className="pl-6 space-y-1">
                          <p className="text-xs text-muted-foreground">
                            Team Members:
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div className="flex items-center gap-2 text-sm bg-muted p-2 rounded-md">
                              <User className="h-3 w-3" />
                              <span>You (Team Leader)</span>
                            </div>

                            {registration.team_members.map((member) => (
                              <div
                                key={member.uid}
                                className="flex items-center gap-2 text-sm bg-muted p-2 rounded-md"
                              >
                                <User className="h-3 w-3" />
                                <span>{member.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="pt-2">
                  <Link
                    href={`/events/${registration.event_id}`}
                    className="w-full"
                  >
                    <button className="primary-btn">View Event</button>
                  </Link>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 bg-muted/50 rounded-lg">
              <h3 className="text-lg font-medium mb-2">No registered events</h3>
              <p className="text-muted-foreground mb-4">
                You haven&apos;t registered for any upcoming events yet.
              </p>
              <Link href="/events">
                <button className="primary-btn">Browse Events</button>
              </Link>
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-6">
          <h2 className="text-xl font-semibold mb-4">Your Past Events</h2>
          <div className="text-center py-12 bg-muted/50 rounded-lg">
            <h3 className="text-lg font-medium mb-2">No past events</h3>
            <p className="text-muted-foreground">
              You haven&apos;t participated in any past events yet.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default RegistredEvent;
