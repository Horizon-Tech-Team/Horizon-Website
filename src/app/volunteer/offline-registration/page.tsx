/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Search,
  User,
  Users,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  AlertCircle,
  UserPlus,
  Calendar,
  Clock,
} from "lucide-react";
import {
  findUsers,
  getEventList,
  createOfflineRegistration,
} from "@/app/actions/actions";
import { toast } from "sonner";

export default function OfflineRegistrationPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [teamName, setTeamName] = useState("");
  const [teamMembers, setTeamMembers] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Fetch events from API
  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await getEventList();
        if (res.success) {
          setEvents(res.data);
        } else {
          toast.error(res.error || "Failed to load events.");
        }
      } catch (err: any) {
        toast.error(err || "Unexpected error loading events.");
      }
    }
    fetchEvents();
  }, []);

  // Extract unique categories
  const categories = Array.from(new Set(events.map((e) => e.category)));

  // Filter events based on selected category
  const filteredEvents = selectedCategory
    ? events.filter((e) => e.category === selectedCategory)
    : [];

  // Search users using API
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await findUsers({ q: searchQuery, role: "student" });
      if (res.success && Array.isArray(res.data)) {
        setSearchResults(res.data);
        if (res.data.length === 0) {
          toast.info("No users found for your search.");
        }
      } else {
        toast.error(res.error || "Failed to search users.");
      }
    } catch (err: any) {
      toast.error(err || "Unexpected error searching users.");
    }
    setIsSearching(false);
  };

  // Handle user selection
  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
    setSearchResults([]);
    setSearchQuery("");
  };

  // Handle offline registration using API
  const handleOfflineRegistration = async () => {
    if (!selectedUser || !selectedEvent) {
      toast.error("Please select a user and event.");
      return;
    }
    setIsRegistering(true);
    const eventData = events.find(
      (e) => e.uid === selectedEvent || e.id === selectedEvent
    );
    const isTeamEvent = eventData?.is_team_event;

    // Parse team members from textarea (simple CSV: name,email,phone per line)
    const teamMembersArr: Array<{
      name: string;
      email: string;
      phone: string;
    }> = [];

    // Only parse team members if textarea is non-empty
    if (isTeamEvent && teamMembers.trim()) {
      const lines = teamMembers
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      for (const line of lines) {
        const parts = line.split(",").map((s) => s.trim());
        if (parts.length !== 3 || parts.some((p) => !p)) {
          toast.error(
            "Each team member must be entered as: Name,Email,Phone (one per line)."
          );
          setIsRegistering(false);
          return;
        }
        teamMembersArr.push({
          name: parts[0],
          email: parts[1],
          phone: parts[2],
        });
      }

      // Validate team size only if team members are provided
      if (lines.length < eventData.team_size_min) {
        toast.error(
          `Minimum team size for this event is ${eventData.team_size_min}.`
        );
        setIsRegistering(false);
        return;
      }
      if (lines.length > eventData.team_size_max) {
        toast.error(
          `Maximum team size for this event is ${eventData.team_size_max}.`
        );
        setIsRegistering(false);
        return;
      }
    }

    const payload: any = {
      user_id: selectedUser.uid, // Leader only here
      event_id: selectedEvent,
      is_team_event: isTeamEvent,
      team_name: isTeamEvent ? teamName : undefined,
      team_members: isTeamEvent ? teamMembersArr : undefined, // members only
    };

    try {
      const res = await createOfflineRegistration(payload);
      if (res.success) {
        toast.success("Registration completed successfully!");
        setRegistrationSuccess(true);
        setIsRegistering(false);
        setTimeout(() => {
          setSelectedUser(null);
          setSelectedEvent("");
          setTeamName("");
          setTeamMembers("");
          setRegistrationSuccess(false);
        }, 3000);
      } else {
        toast.error(res.error || "Registration failed. Please try again.");
        setIsRegistering(false);
      }
    } catch (err: any) {
      toast.error(err || "Unexpected error during registration.");
      setIsRegistering(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const selectedEventData = events.find(
    (e) => e.uid === selectedEvent || e.id === selectedEvent
  );

  // Set team members automatically if user is selected and event is a team event
  useEffect(() => {
    // Optionally clear team name if event changes
    if (selectedEvent && !selectedEventData?.is_team_event) {
      setTeamName("");
      setTeamMembers("");
    }
  }, [selectedUser, selectedEvent, selectedEventData?.is_team_event]);

  return (
    <div className="container max-w-5xl mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Offline Registration</h1>
        <p className="text-muted-foreground">
          Register students who are physically present at the venue
        </p>
        <Badge variant="secondary" className="text-sm">
          Special Volunteer Access
        </Badge>
      </div>

      {/* Success Alert */}
      {registrationSuccess && (
        <Alert className="border-green-200 bg-green-50 dark:bg-green-950">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            Registration completed successfully! The student has been registered
            for the event.
          </AlertDescription>
        </Alert>
      )}

      {/* Step 1: Search User */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Step 1: Search Student
          </CardTitle>
          <CardDescription>
            Search by phone number, or email to find the student
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="Enter firstname, lastname, phone, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
            >
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Search Results:</h4>
              {searchResults.map((user) => (
                <Card
                  key={user.uid || user.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSelectUser(user)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                          {getInitials(
                            user.name || user.firstName + " " + user.lastName
                          )}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">
                            {user.name || user.firstName + " " + user.lastName}
                          </h4>
                          <Badge
                            variant={user.is_verified ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {user.is_verified ? "Verified" : "Unverified"}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {user.phone}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {user.college || user.college_name}
                          </div>
                        </div>
                      </div>

                      <Button size="sm" variant="outline">
                        Select
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* No Results */}
          {searchResults.length === 0 && searchQuery && !isSearching && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No users found. If the student hasn&apos;t signed up yet, they
                need to create a verified account online first.
                <br />
                <strong>Note:</strong> Only users with verified accounts can be
                registered offline.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Step 2: Selected User Info */}
      {selectedUser && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Step 2: Selected Student
            </CardTitle>
            <CardDescription>
              Confirm student details before proceeding with registration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getInitials(
                    selectedUser.name ||
                      selectedUser.firstName + " " + selectedUser.lastName
                  )}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold">
                    {selectedUser.name ||
                      selectedUser.firstName + " " + selectedUser.lastName}
                  </h3>
                  <Badge
                    variant={selectedUser.is_verified ? "default" : "secondary"}
                  >
                    {selectedUser.is_verified ? "Verified" : "Unverified"}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {selectedUser.email}
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {selectedUser.phone}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {selectedUser.college || selectedUser.college_name}
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedUser(null)}
              >
                Change
              </Button>
            </div>

            {/* Warning for unverified users */}
            {!selectedUser.is_verified && (
              <Alert className="mt-4 border-orange-200 bg-orange-50 dark:bg-orange-950">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800 dark:text-orange-200">
                  <strong>Warning:</strong> This user account is not verified.
                  They should complete email verification before participating
                  in events.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 3: Event Registration */}
      {selectedUser && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Step 3: Event Registration
            </CardTitle>
            <CardDescription>
              Select event and fill in additional details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Event Selection */}
            <div>
              <Label htmlFor="event">Select Event *</Label>
              <div className="flex gap-4">
                {/* Category Select */}
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Choose a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Event Select (depends on category) */}
                <Select
                  value={selectedEvent}
                  onValueChange={setSelectedEvent}
                  disabled={!selectedCategory} // disable until category is chosen
                >
                  <SelectTrigger className="w-[250px]">
                    <SelectValue placeholder="Choose an event" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredEvents.map((event) => (
                      <SelectItem key={event.uid} value={event.uid}>
                        <div className="flex flex-col">
                          <span className="font-medium">{event.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {event.is_team_event
                              ? `Team (${event.team_size_min}-${event.team_size_max})`
                              : "Individual"}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Team Details (if team event) */}
            {selectedEventData?.is_team_event && (
              <div className="space-y-4 p-4 border rounded-lg">
                <h4 className="font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Team Information
                </h4>

                <div>
                  <Label htmlFor="teamName">Team Name *</Label>
                  <Input
                    id="teamName"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="Enter team name"
                  />
                </div>

                <div>
                  <Label htmlFor="teamMembers">
                    Team Members ({selectedEventData.team_size_min}-
                    {selectedEventData.team_size_max} members) *
                  </Label>
                  <Textarea
                    id="teamMembers"
                    value={teamMembers}
                    onChange={(e: any) => setTeamMembers(e.target.value)}
                    placeholder="List all team members as: name,email,phone (one per line)"
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Include the selected student and other team members. Format:{" "}
                    <br />
                    <span className="font-mono">Name,Email,Phone</span>
                  </p>
                </div>
              </div>
            )}

            {/* Registration Button */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleOfflineRegistration}
                disabled={
                  isRegistering ||
                  !selectedEvent ||
                  (selectedEventData?.is_team_event && !teamName) // only require teamName
                }
                className="flex-1"
              >
                {isRegistering ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Complete Registration
                  </>
                )}
              </Button>
            </div>

            {/* Event Details */}
            {selectedEventData && (
              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <h5 className="font-medium text-sm mb-2">Event Details:</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div>Category: {selectedEventData.category}</div>
                  <div>
                    Type:{" "}
                    {selectedEventData.is_team_event
                      ? "Team Event"
                      : "Individual Event"}
                  </div>
                  {selectedEventData.is_team_event && (
                    <div>
                      Team Size: {selectedEventData.team_size_min}-
                      {selectedEventData.team_size_max} members
                    </div>
                  )}
                  <div>
                    Deadline:{" "}
                    {selectedEventData.registration_deadline
                      ? new Date(
                          selectedEventData.registration_deadline
                        ).toLocaleDateString()
                      : ""}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 py-1 px-2 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
              1
            </div>
            <div>
              <strong>Search Student:</strong> Use first name, last name, phone
              number, or email to find the student in the system.
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 py-1 px-2 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
              2
            </div>
            <div>
              <strong>Verify Account:</strong> Ensure the student has a verified
              account. Unverified users should complete email verification
              before they can be registered for events.
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 py-1 px-2 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
              3
            </div>
            <div>
              <strong>Register for Event:</strong> Select the event and fill in
              additional details. For team events, enter the team name and list
              all team members in the required format.
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 py-1 px-2 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
              4
            </div>
            <div>
              <strong>Complete Registration:</strong> Click the button to
              finish. The system will create an offline registration entry with
              <code className="px-1 py-0.5 bg-muted rounded text-xs">
                mode=&quot;offline&quot;
              </code>
              .
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
