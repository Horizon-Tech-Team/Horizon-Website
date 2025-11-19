/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
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
  CheckCircle,
  AlertCircle,
  Calendar,
  Award,
  PlusCircle,
  Mail,
  MapPin,
} from "lucide-react";
import { findUsers, getEventList, awardPrPoints } from "@/app/actions/actions";
import { toast } from "sonner";
import { RULE_TYPES } from "@/lib/constant";

export default function AwardPrPointsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedCL, setSelectedCL] = useState<any | null>(null);

  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState("");

  const [points, setPoints] = useState("");
  const [ruleType, setRuleType] = useState("");
  const [description, setDescription] = useState("");

  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState("");

  const [isSearching, setIsSearching] = useState(false);
  const [isAwarding, setIsAwarding] = useState(false);
  const [awardSuccess, setAwardSuccess] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState("");

  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedRule, setSelectedRule] = useState("");

  // Fetch events on mount
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

  // Autofill points when rule changes
  useEffect(() => {
    let finalRuleType = ruleType;

    // If level + rule selected → combine them
    if (selectedLevel && selectedRule) {
      finalRuleType = `${selectedLevel}_${selectedRule}`;
    }

    if (finalRuleType) {
      const matchedRule = RULE_TYPES.find((r) => r.value === finalRuleType);
      if (matchedRule) {
        const defaultPoints = Array.isArray(matchedRule.points)
          ? matchedRule.points[0] // pick first (team) OR matchedRule.points[1] for individual
          : matchedRule.points;

        setPoints(String(defaultPoints));
      }
    }
  }, [selectedLevel, selectedRule, ruleType]);

  // Extract unique categories
  const categories = Array.from(new Set(events.map((e) => e.category)));

  // Filter events based on selected category
  const filteredEvents = selectedCategory
    ? events.filter((e) => e.category === selectedCategory)
    : [];

  // Search CLs
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await findUsers({
        q: searchQuery,
        role: "contingent_leader",
      });
      if (res.success && Array.isArray(res.data)) {
        setSearchResults(res.data);
        if (res.data.length === 0) {
          toast.info("No contingent leaders found for your search.");
        }
      } else {
        toast.error(res.error || "Failed to search contingent leaders.");
      }
    } catch (err: any) {
      toast.error(err || "Unexpected error searching contingent leaders.");
    }
    setIsSearching(false);
  };

  // Select CL
  const handleSelectCL = (user: any) => {
    setSelectedCL(user);
    setSearchResults([]);
    setSearchQuery("");
    setStudents([]);
    setSelectedStudent("");
    fetchStudentsUnderCL(user.uid);
  };

  // Fetch students under CL if rule requires it
  const fetchStudentsUnderCL = async (cl_id: string) => {
    try {
      const res = await findUsers({ cl_uid: cl_id, role: "student" });
      if (res.success && Array.isArray(res.data)) {
        setStudents(res.data);
      } else {
        setStudents([]);
        toast.error(res.error || "Failed to load students under CL.");
      }
    } catch (err: any) {
      setStudents([]);
      toast.error(err || "Unexpected error loading students.");
    }
  };

  // // Handle rule change
  // const handleRuleChange = (value: string) => {
  //   setRuleType(value);
  //   setSelectedStudent("");
  //   if (selectedCL && value === "participation") {
  //     fetchStudentsUnderCL(selectedCL.uid);
  //   }
  // };

  // Award PR Points
  const handleAwardPoints = async () => {
    if (!selectedCL || !points) {
      toast.error("Please fill all required fields.");
      return;
    }

    // Compose rule type (like gold_winner_1st)
    let finalRuleType = ruleType;
    if (selectedLevel && selectedRule) {
      finalRuleType = `${selectedLevel}_${selectedRule}`;
    }

    if (!finalRuleType) {
      toast.error("Please select a rule type.");
      return;
    }

    setIsAwarding(true);

    const payload = {
      cl_id: selectedCL.uid,
      member_id: selectedStudent ? selectedStudent : null,
      event_id: selectedEvent === "not_applicable" ? null : selectedEvent,
      points: Number(points),
      rule_type: finalRuleType,
      description,
    };

    try {
      const res = await awardPrPoints(payload);
      if (res.success) {
        toast.success("PR Points awarded successfully!");
        setAwardSuccess(true);
        setIsAwarding(false);
        setTimeout(() => {
          setSelectedCL(null);
          setSelectedEvent("");
          setPoints("");
          setRuleType("");
          setDescription("");
          setSelectedStudent("");
          setStudents([]);
          setSelectedLevel("");
          setSelectedRule("");
          setAwardSuccess(false);
        }, 3000);
      } else {
        toast.error(res.error || "Failed to award PR points.");
        setIsAwarding(false);
      }
    } catch (err: any) {
      toast.error(err || "Unexpected error during awarding.");
      setIsAwarding(false);
    }
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
    <div className="container max-w-7xl mx-auto py-6 md:px-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Award PR Points</h1>
        <p className="text-muted-foreground">
          Award PR points to a College Representative (Contingent Leader)
        </p>
        <Badge variant="secondary" className="text-sm">
          PR Access
        </Badge>
      </div>

      {/* Success Alert */}
      {awardSuccess && (
        <Alert className="border-green-200 bg-green-50 dark:bg-green-950">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            PR Points awarded successfully!
          </AlertDescription>
        </Alert>
      )}

      {/* Step 1: Search CL */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Step 1: Search Contingent Leader
          </CardTitle>
          <CardDescription>
            Search by phone number, email, or name to find the CL
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="Enter phone, email, or name..."
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
                  onClick={() => handleSelectCL(user)}
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
                            <Award className="h-3 w-3" />
                            {user.college || user.college_name}
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                      <Button
                        className="hidden md:block"
                        size="sm"
                        variant="outline"
                      >
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
                No contingent leaders found. Please check your search.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Selected CL Info */}
      {selectedCL && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Selected Contingent Leader
            </CardTitle>
            <CardDescription>
              Confirm CL details before awarding PR points
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getInitials(
                    selectedCL.name ||
                      selectedCL.firstName + " " + selectedCL.lastName
                  )}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold">
                    {selectedCL.name ||
                      selectedCL.firstName + " " + selectedCL.lastName}
                  </h3>
                  <Badge
                    variant={selectedCL.is_verified ? "default" : "secondary"}
                  >
                    {selectedCL.is_verified ? "Verified" : "Unverified"}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {selectedCL.email}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {selectedCL.college || selectedCL.college_name}
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedCL(null)}
              >
                Change
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Award PR Points */}
      {selectedCL && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5" />
              Step 2: Award PR Points
            </CardTitle>
            <CardDescription>
              Fill in the details to award PR points to the selected CL
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Select Event */}
            {/* Category + Event selection */}
            <div className="flex gap-4">
              {/* Category Select */}
              <div className="flex-1">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Choose a category" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Event Select (depends on category) */}
              <div className="flex-1">
                <Label htmlFor="event">Event *</Label>
                <Select
                  value={selectedEvent}
                  onValueChange={setSelectedEvent}
                  disabled={!selectedCategory}
                >
                  <SelectTrigger id="event">
                    <SelectValue placeholder="Choose an event" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    <SelectItem value="not_applicable">
                      Not Applicable
                    </SelectItem>
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

            {/* Select Rule */}
            {/* Select Rule (Level + Rule OR Extra/Negative) */}
            <div className="flex gap-4">
              {/* Level (Gold/Silver/Bronze) */}
              <div className="flex-1">
                <Label htmlFor="level">Level</Label>
                <Select
                  value={selectedLevel}
                  onValueChange={(value) => {
                    setSelectedLevel(value);
                    setRuleType(""); // disable other rules
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gold">Gold</SelectItem>
                    <SelectItem value="silver">Silver</SelectItem>
                    <SelectItem value="bronze">Bronze</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Rule (Qualified/Winner) */}
              <div className="flex-1">
                <Label htmlFor="rule">Rule</Label>
                <Select
                  value={selectedRule}
                  onValueChange={(value) => {
                    setSelectedRule(value);
                    setRuleType(""); // disable other rules
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select rule" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="qualified_round1">
                      Qualified - Round 1
                    </SelectItem>
                    <SelectItem value="qualified_round2">
                      Qualified - Round 2
                    </SelectItem>
                    <SelectItem value="winner_1st">
                      Winner - 1st Place
                    </SelectItem>
                    <SelectItem value="winner_2nd">
                      Winner - 2nd Place
                    </SelectItem>
                    <SelectItem value="winner_3rd">
                      Winner - 3rd Place
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Or Extra Rules */}
            <div>
              <Label htmlFor="ruleType">Other Rule</Label>
              <Select
                value={ruleType}
                onValueChange={(value) => {
                  setRuleType(value);
                  setSelectedLevel("");
                  setSelectedRule("");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select if applicable (extra/negative)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="extra_activity">Extra Activity</SelectItem>
                  <SelectItem value="negative_activity">
                    Negative Activity
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Always show student search */}
            <div>
              <Label htmlFor="student">Student</Label>
              <Select
                value={selectedStudent}
                onValueChange={setSelectedStudent}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a student" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  {students.map((student) => (
                    <SelectItem key={student.uid} value={student.uid}>
                      {student.name ||
                        student.firstName + " " + student.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description (optional)"
                rows={3}
              />
            </div>

            {/* Points */}
            <div>
              <Label htmlFor="points">Points *</Label>
              <Input
                id="points"
                type="number"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                placeholder="Enter points"
                min={ruleType === "negative_activity" ? undefined : 0}
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleAwardPoints}
                disabled={
                  isAwarding ||
                  !selectedEvent ||
                  !points ||
                  // require either other rule OR level+rule
                  (!ruleType && (!selectedLevel || !selectedRule)) ||
                  // require student only if you want it mandatory
                  (ruleType !== "extra_activity" &&
                    ruleType !== "negative_activity" &&
                    !selectedStudent)
                }
                className="flex-1"
              >
                {isAwarding ? (
                  <>
                    <Calendar className="h-4 w-4 mr-2 animate-spin" />
                    Awarding...
                  </>
                ) : (
                  <>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Award PR Points
                  </>
                )}
              </Button>
            </div>
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
              <strong>Search Contingent Leader:</strong> Use phone, email, or
              name to find the CL.
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 py-1 px-2 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
              2
            </div>
            <div>
              <strong>Confirm CL Details:</strong> Verify the CL’s identity
              before awarding.
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 py-1 px-2 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
              3
            </div>
            <div>
              <strong>Award PR Points:</strong> Select event (if applicable),
              rule type, student (if required), description, and enter points.
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 py-1 px-2 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
              4
            </div>
            <div>
              <strong>Complete Award:</strong> The system records awarded PR
              points under the CL (and student if selected).
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Award Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Award Rules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-sm">
          {/* Table 1: Categories */}
          <div>
            <h3 className="font-semibold mb-2">Categories</h3>
            <div className="overflow-x-auto rounded-md border dark:border-gray-700">
              <table className="w-full border-collapse text-center text-sm">
                <thead>
                  <tr>
                    <th className="border px-3 py-2 bg-yellow-300 text-black dark:bg-yellow-500 dark:text-black">
                      🥇 Gold
                    </th>
                    <th className="border px-3 py-2 bg-gray-300 text-black dark:bg-gray-500 dark:text-white">
                      🥈 Silver
                    </th>
                    <th className="border px-3 py-2 bg-amber-600 text-white dark:bg-amber-700">
                      🥉 Bronze
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="odd:bg-gray-50 even:bg-white dark:odd:bg-gray-800 dark:even:bg-gray-900">
                    <td className="border px-3 py-2">Tech Spotlight</td>
                    <td className="border px-3 py-2">Logical</td>
                    <td className="border px-3 py-2">Creative</td>
                  </tr>
                  <tr className="odd:bg-gray-50 even:bg-white dark:odd:bg-gray-800 dark:even:bg-gray-900">
                    <td className="border px-3 py-2">Technical</td>
                    <td className="border px-3 py-2">Verbal</td>
                    <td className="border px-3 py-2">Fun</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Table 2: Points */}
          <div>
            <h3 className="font-semibold mb-2">Points Distribution</h3>
            <div className="overflow-x-auto rounded-md border dark:border-gray-700">
              <table className="w-full border-collapse text-center text-sm min-w-[600px]">
                <thead>
                  <tr>
                    <th
                      rowSpan={2}
                      className="border px-3 py-2 bg-gray-100 dark:bg-gray-700"
                    ></th>
                    <th
                      colSpan={2}
                      className="border px-3 py-2 bg-yellow-300 text-black dark:bg-yellow-500 dark:text-black"
                    >
                      🥇 Gold
                    </th>
                    <th
                      colSpan={2}
                      className="border px-3 py-2 bg-gray-300 text-black dark:bg-gray-500 dark:text-white"
                    >
                      🥈 Silver
                    </th>
                    <th
                      colSpan={2}
                      className="border px-3 py-2 bg-amber-600 text-white dark:bg-amber-700"
                    >
                      🥉 Bronze
                    </th>
                  </tr>
                  <tr>
                    <th className="border px-3 py-2 bg-yellow-100 dark:bg-yellow-600">
                      online
                    </th>
                    <th className="border px-3 py-2 bg-yellow-100 dark:bg-yellow-600">
                      offline
                    </th>
                    <th className="border px-3 py-2 bg-gray-100 dark:bg-gray-600">
                      online
                    </th>
                    <th className="border px-3 py-2 bg-gray-100 dark:bg-gray-600">
                      offline
                    </th>
                    <th className="border px-3 py-2 bg-amber-100 dark:bg-amber-800">
                      online
                    </th>
                    <th className="border px-3 py-2 bg-amber-100 dark:bg-amber-800">
                      offline
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Participation", 150, 75, 100, 50, 50, 25],
                    ["Qualification", 300, 150, 200, 100, 100, 50],
                    ["1st", 800, 400, 600, 300, 400, 200],
                    ["2nd", 700, 350, 500, 250, 300, 150],
                    ["3rd", 600, 300, 400, 200, 200, 100],
                  ].map((row, i) => (
                    <tr
                      key={i}
                      className="odd:bg-gray-50 even:bg-white dark:odd:bg-gray-800 dark:even:bg-gray-900"
                    >
                      <td className="border px-3 py-2 font-medium">{row[0]}</td>
                      {row.slice(1).map((val, j) => (
                        <td key={j} className="border px-3 py-2">
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
