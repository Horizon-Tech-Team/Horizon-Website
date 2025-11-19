"use client";

import { useAuth } from "@/app/AuthProvider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CLStudentsResponse } from "@/lib/types";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Mail,
  Phone,
  Search,
  Users,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

// Helper to get initials from a full name
const getUserInitials = (name: string) => {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return parts[0].charAt(0).toUpperCase() + parts[1].charAt(0).toUpperCase();
};

type ManageStudentsProps = {
  students: CLStudentsResponse;
  cl_code: string;
};

const STUDENTS_PER_PAGE = 5;
const ManageStudents = ({ students, cl_code }: ManageStudentsProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [filterStatus, setFilterStatus] = useState("all");
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [studentsCurrentPage, setStudentsCurrentPage] = useState(1);
  const [copied, setCopied] = useState(false);
  const [showAllEvents, setShowAllEvents] = useState(false);

  const { user } = useAuth();
  // Calculate totals from students data
  const totalStudents = students.length;

  // Filter students
  const filteredStudents: CLStudentsResponse = students.filter((student) => {
    const matchesSearch =
      searchTerm === "" ||
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());

    // You can add filterStatus logic here if needed later
    return matchesSearch;
  });

  // Total participation = sum of each student's unique event registrations
  const totalParticipation = students.reduce(
    (sum, student) =>
      sum + new Set(student.registrations.map((r) => r.event_id)).size,
    0
  );

  // Total unique events across all students
  const totalEvents = new Set(
    students.flatMap((student) => student.registrations.map((r) => r.event_id))
  ).size;

  const totalStudentsPages = Math.ceil(
    filteredStudents.length / STUDENTS_PER_PAGE
  );
  const studentsStartIndex = (studentsCurrentPage - 1) * STUDENTS_PER_PAGE;
  const studentsEndIndex = studentsStartIndex + STUDENTS_PER_PAGE;
  const currentPageStudents = filteredStudents.slice(
    studentsStartIndex,
    studentsEndIndex
  );

  // Reset pagination when search changes
  useEffect(() => {
    setStudentsCurrentPage(1);
  }, [searchTerm, filterStatus]);

  // Prepare clData for display
  const clData = {
    avatar: user?.avatar || "/placeholder.svg",
    name:
      `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "CL User",
    email: user?.email ?? "No email",
    college: user?.college_name ?? "Unknown College",
    totalStudents,
    totalParticipation,
    totalEvents,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(cl_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Manage Students
          </h1>
          <p className="text-muted-foreground text-sm">
            View, update, and manage your registered students.
          </p>
        </div>

        {/* CL Code with Copy Button */}
        <div className="mt-4 md:mt-0 flex items-center gap-2">
          <span className="px-3 py-1 rounded-md bg-primary/90 text-primary-foreground font-mono font-semibold text-lg shadow-sm">
            {cl_code}
          </span>
          <button
            onClick={handleCopy}
            className="p-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
            title="Copy CL Code"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
      </div>

      {/* CL Profile Card */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Avatar */}
            <Avatar className="h-24 w-24 border-4 border-white flex-shrink-0">
              <AvatarImage src={clData.avatar} alt={clData.name} />
              <AvatarFallback className="text-lg border border-primary">
                {getUserInitials(clData.name)}
              </AvatarFallback>
            </Avatar>

            {/* Name & Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold mb-1">{clData.name}</h2>
              <p className="text-muted-foreground mb-2 truncate">
                {clData.email}
              </p>
              <Badge variant="default" className="mb-3">
                Contingent Leader
              </Badge>
              <p className="text-sm text-muted-foreground truncate">
                {clData.college}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 min-w-[200px] text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {clData.totalStudents}
                </div>
                <p className="text-xs text-muted-foreground">Students</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {clData.totalParticipation}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total Participation
                </p>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {clData.totalEvents}
                </div>
                <p className="text-xs text-muted-foreground">Unique Events</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Students Management
              </CardTitle>
              <CardDescription>
                Manage and track your students&apos; progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Students List */}
              <div className="space-y-4">
                {currentPageStudents.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No students found matching your criteria.
                  </div>
                ) : (
                  currentPageStudents.map((student) => (
                    <Card
                      key={student.uid}
                      className="border-l-4 border-l-primary"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <Avatar className="h-12 w-12 border-2 border-white flex-shrink-0">
                              <AvatarImage
                                src={student.avatar||"/placeholder.svg"}
                                alt={`${student.firstName} ${student.lastName}`.trim()}
                              />
                              <AvatarFallback className="border border-primary">
                                {getUserInitials(
                                  `${student.firstName} ${student.lastName}`
                                )}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h3 className="font-semibold">
                                {student.firstName + " " + student.lastName}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {student.email}
                              </p>
                              <div className="flex items-center gap-4 mt-1">
                                <span className="text-xs text-muted-foreground">
                                  {student.registrations.length} Events
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setExpandedStudent(
                                expandedStudent === student.uid
                                  ? null
                                  : student.uid
                              )
                            }
                          >
                            {expandedStudent === student.uid ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </div>

                        {/* Expanded Details */}
                        {expandedStudent === student.uid && (
                          <div className="mt-4 pt-4 border-t">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-4 w-4 text-primary" />
                                <span>{student.phone}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-4 w-4 text-primary" />
                                <span>{student.email}</span>
                              </div>
                            </div>

                            <div className="mb-4">
                              <h4 className="font-medium mb-2">
                                Event Participation
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
                                <div className="text-center p-2 bg-muted rounded">
                                  <div className="font-semibold">
                                    {student.registrations.length}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Total Events
                                  </div>
                                </div>
                                <div className="text-center p-2 bg-muted rounded">
                                  <div className="font-semibold text-green-600">
                                    {
                                      student.registrations.filter(
                                        (reg) => reg.is_team_event
                                      ).length
                                    }
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Team Events
                                  </div>
                                </div>
                                <div className="text-center p-2 bg-muted rounded">
                                  <div className="font-semibold text-blue-600">
                                    {
                                      student.registrations.filter(
                                        (reg) => !reg.is_team_event
                                      ).length
                                    }
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Individual
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="mb-4">
                              <h4 className="font-medium mb-2">
                                Participated Events
                              </h4>
                              <div className="space-y-2">
                                {(showAllEvents
                                  ? student.registrations
                                  : student.registrations.slice(0, 3)
                                ).map((reg, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between text-sm"
                                  >
                                    <span>{reg.event.name}</span>
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {reg.event.category}
                                    </Badge>
                                  </div>
                                ))}

                                {student.registrations.length > 3 && (
                                  <button
                                    onClick={() =>
                                      setShowAllEvents(!showAllEvents)
                                    }
                                    className="text-xs text-blue-600 hover:underline mt-1"
                                  >
                                    {showAllEvents ? "Show Less" : "Show More"}
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>

              {/* Students Pagination */}
              {totalStudentsPages > 1 && (
                <div className="flex justify-center mt-6">
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={studentsCurrentPage === 1}
                      onClick={() =>
                        setStudentsCurrentPage(studentsCurrentPage - 1)
                      }
                    >
                      Previous
                    </Button>

                    {Array.from(
                      { length: Math.min(5, totalStudentsPages) },
                      (_, i) => {
                        let pageNum;
                        if (totalStudentsPages <= 5) {
                          pageNum = i + 1;
                        } else if (studentsCurrentPage <= 3) {
                          pageNum = i + 1;
                        } else if (
                          studentsCurrentPage >=
                          totalStudentsPages - 2
                        ) {
                          pageNum = totalStudentsPages - 4 + i;
                        } else {
                          pageNum = studentsCurrentPage - 2 + i;
                        }

                        return (
                          <Button
                            key={pageNum}
                            variant={
                              studentsCurrentPage === pageNum
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            className="px-3"
                            onClick={() => setStudentsCurrentPage(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        );
                      }
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={studentsCurrentPage === totalStudentsPages}
                      onClick={() =>
                        setStudentsCurrentPage(studentsCurrentPage + 1)
                      }
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}

              {/* Results Info */}
              <div className="flex justify-between items-center text-sm text-muted-foreground mt-4 pt-4 border-t">
                <span>
                  Showing {studentsStartIndex + 1}-
                  {Math.min(studentsEndIndex, filteredStudents.length)} of{" "}
                  {filteredStudents.length} students
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ManageStudents;
