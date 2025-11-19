/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
  downloadRegistrationReport,
  getAllRegistrations,
  updateAttendanceStatus,
  updateRegistrationStatus,
} from "@/app/actions/actions";
import { useDebounce } from "@/hooks/use-debounce";
import { useEffect, useMemo, useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  MoreHorizontal,
  Users,
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Plus,
  Trash2,
  UserCheck,
  Ban,
  Globe,
  MapPin,
  UserPlus,
  Send,
  Award,
} from "lucide-react";
import { format } from "date-fns";
import LoadingLogo from "@/components/loading-logo";
import { toast } from "sonner";

// Types based on the backend schema
interface TeamMember {
  uid: string;
  name: string;
  email: string;
  phone: string;
}

interface Event {
  name: string;
  category: string;
}

interface User {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  branch: string;
  year_of_study: number;
  college_name: string;
  fullName: string;
}

interface CL {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cl_code: string | null;
  college_name: string;
  fullName: string;
}

interface Registration {
  uid: string;
  event_id: string;
  user_id: string;
  is_team_event: boolean;
  team_name: string | null;
  status: "registered" | "submitted" | "completed" | "cancelled";
  mode: "online" | "offline";
  attendance_status: string | null;
  created_at: string;
  team_members: TeamMember[];
  event: Event;
  user: User;
  cl: CL | null;
}

// Mock API functions
// const updateRegistrationStatus = async (
//   uid: string,
//   status: Registration["status"]
// ): Promise<void> => {
//   await new Promise((resolve) => setTimeout(resolve, 1000));
//   console.log(`Updated registration ${uid} status to ${status}`);
// };

const updateRegistrationMode = async (
  uid: string,
  mode: Registration["mode"]
): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(`Updated registration ${uid} mode to ${mode}`);
};

// const updateAttendanceStatus = async (
//   uid: string,
//   attendance_status: string
// ): Promise<void> => {
//   await new Promise((resolve) => setTimeout(resolve, 1000));
//   console.log(`Updated registration ${uid} attendance to ${attendance_status}`);
// };

const updateTeamMembers = async (
  uid: string,
  team_members: TeamMember[]
): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  console.log(`Updated registration ${uid} team members`);
};

export default function ManageRegistrations() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedMode, setSelectedMode] = useState("all");
  const [selectedCL, setSelectedCL] = useState("all");
  const [selectedRegistrations, setSelectedRegistrations] = useState<string[]>(
    []
  );
  const [viewRegistration, setViewRegistration] = useState<Registration | null>(
    null
  );
  const [editRegistration, setEditRegistration] = useState<Registration | null>(
    null
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [bulkAttendanceDialog, setBulkAttendanceDialog] = useState(false);
  const [bulkStatusDialog, setBulkStatusDialog] = useState(false);

  // Edit form states
  const [editStatus, setEditStatus] =
    useState<Registration["status"]>("registered");
  const [editMode, setEditMode] = useState<Registration["mode"]>("online");
  const [editAttendance, setEditAttendance] = useState("");
  const [editTeamMembers, setEditTeamMembers] = useState<TeamMember[]>([]);

  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportType, setExportType] = useState<"all" | "event">("all");
  const [exportIncludeOnline, setExportIncludeOnline] = useState(true);
  const [exportIncludeOffline, setExportIncludeOffline] = useState(true);
  const [exportEvent, setExportEvent] = useState<string>("");

  const [currentPage, setCurrentPage] = useState(1); // Added for pagination
  const itemsPerPage = 20;

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Fetch registrations on component mount
  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        setLoading(true);
        const res = await getAllRegistrations();
        setRegistrations(res.data);
      } catch (error) {
        console.error("Error fetching registrations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  // Get unique values for filters
  const uniqueEvents = useMemo(
    () => [...new Set(registrations.map((r) => r.event.name))],
    [registrations]
  );
  const uniqueCLs = useMemo(() => {
    const cls = registrations
      .map((r) => r.cl?.fullName)
      .filter(Boolean) as string[];
    return [...new Set(cls)];
  }, [registrations]);

  // Filter registrations
  const filteredRegistrations = useMemo(() => {
    return registrations.filter((registration) => {
      const matchesSearch = registration.event.name
        .toLowerCase()
        .includes(debouncedSearchQuery.toLowerCase());

      const matchesEvent =
        selectedEvent === "all" || registration.event.name === selectedEvent;
      const matchesStatus =
        selectedStatus === "all" || registration.status === selectedStatus;
      const matchesMode =
        selectedMode === "all" || registration.mode === selectedMode;
      const matchesCL =
        selectedCL === "all" || registration.cl?.fullName === selectedCL;

      return (
        matchesSearch &&
        matchesEvent &&
        matchesStatus &&
        matchesMode &&
        matchesCL
      );
    });
  }, [
    registrations,
    debouncedSearchQuery,
    selectedEvent,
    selectedStatus,
    selectedMode,
    selectedCL,
  ]);

  // Reset page on filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    debouncedSearchQuery,
    selectedEvent,
    selectedStatus,
    selectedMode,
    selectedCL,
  ]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredRegistrations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(
    startIndex + itemsPerPage,
    filteredRegistrations.length
  );
  const currentRegistrations = filteredRegistrations.slice(
    startIndex,
    endIndex
  );

  // Calculate statistics
  const stats = useMemo(() => {
    const totalRegistrations = registrations.length;
    const registeredCount = registrations.filter(
      (r) => r.status === "registered"
    ).length;
    const submittedCount = registrations.filter(
      (r) => r.status === "submitted"
    ).length;
    const completedCount = registrations.filter(
      (r) => r.status === "completed"
    ).length;
    const cancelledCount = registrations.filter(
      (r) => r.status === "cancelled"
    ).length;
    const onlineCount = registrations.filter((r) => r.mode === "online").length;
    const offlineCount = registrations.filter(
      (r) => r.mode === "offline"
    ).length;
    const teamEventsCount = registrations.filter((r) => r.is_team_event).length;

    return {
      totalRegistrations,
      registeredCount,
      submittedCount,
      completedCount,
      cancelledCount,
      onlineCount,
      offlineCount,
      teamEventsCount,
    };
  }, [registrations]);

  // Handle registration selection
  const handleSelectRegistration = (uid: string, checked: boolean) => {
    if (checked) {
      setSelectedRegistrations((prev) => [...prev, uid]);
    } else {
      setSelectedRegistrations((prev) => prev.filter((id) => id !== uid));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRegistrations(filteredRegistrations.map((r) => r.uid));
    } else {
      setSelectedRegistrations([]);
    }
  };

  // Handle edit registration
  const handleEditRegistration = (registration: Registration) => {
    setEditRegistration(registration);
    setEditStatus(registration.status);
    setEditMode(registration.mode);
    setEditAttendance(registration.attendance_status || "");
    setEditTeamMembers([...registration.team_members]);
  };

  const handleSaveRegistration = async () => {
    if (!editRegistration) return;

    setIsUpdating(true);
    try {
      // Update status if changed
      // if (editStatus !== editRegistration.status) {
      //   await updateRegistrationStatus(editRegistration.uid, editStatus);
      // }

      // Update mode if changed
      if (editMode !== editRegistration.mode) {
        await updateRegistrationMode(editRegistration.uid, editMode);
      }

      // // Update attendance if changed
      // if (editAttendance !== (editRegistration.attendance_status || "")) {
      //   await updateAttendanceStatus(editRegistration.uid, editAttendance);
      // }

      // Update team members if changed
      if (
        JSON.stringify(editTeamMembers) !==
        JSON.stringify(editRegistration.team_members)
      ) {
        await updateTeamMembers(editRegistration.uid, editTeamMembers);
      }

      // Update local state
      setRegistrations((prev) =>
        prev.map((reg) =>
          reg.uid === editRegistration.uid
            ? {
                ...reg,
                status: editStatus,
                mode: editMode,
                attendance_status: editAttendance || null,
                team_members: editTeamMembers,
              }
            : reg
        )
      );

      setEditRegistration(null);
    } catch (error) {
      console.error("Error updating registration:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle export
  // const handleExport = async () => {
  //   setIsExporting(true);
  //   try {
  //     const result = await downloadRegistrationReport();

  //     if (!result.success) {
  //       alert("Export failed: " + result.error);
  //       return;
  //     }

  //     // Convert base64 → blob
  //     const byteCharacters = atob(result.file as string);
  //     const byteNumbers = new Array(byteCharacters.length);
  //     for (let i = 0; i < byteCharacters.length; i++) {
  //       byteNumbers[i] = byteCharacters.charCodeAt(i);
  //     }
  //     const byteArray = new Uint8Array(byteNumbers);
  //     const blob = new Blob([byteArray], {
  //       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //     });

  //     // Create download link
  //     const url = window.URL.createObjectURL(blob);
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.setAttribute("download", "registration_report.xlsx");
  //     document.body.appendChild(link);
  //     link.click();
  //     link.remove();
  //     window.URL.revokeObjectURL(url);
  //   } catch (err) {
  //     console.error("Client Download Error:", err);
  //     alert("Unexpected error while downloading");
  //   } finally {
  //     setIsExporting(false);
  //   }
  // };

  const toCSV = (rows: Registration[]) => {
    const header = [
      "Event Name",
      "User Name",
      "Team Name",
      "Mode",
      "CL Name",
      "College",
    ];

    const lines = rows.map((r) => {
      const cols = [
        r.event.name,
        r.user.fullName,
        r.team_name || "",
        r.mode,
        r.cl?.fullName || "",
        r.user.college_name,
      ];
      return cols.map((c) => `"${String(c).replaceAll('"', '""')}"`).join(",");
    });

    return [header.join(","), ...lines].join("\n");
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleExport = () => {
    setIsExporting(true);
    try {
      let rows = registrations;

      // Filter by event if selected
      if (exportType === "event" && exportEvent) {
        rows = rows.filter((r) => r.event.name === exportEvent);
      }

      // Filter by mode selections
      rows = rows.filter((r) => {
        if (r.mode === "online" && !exportIncludeOnline) return false;
        if (r.mode === "offline" && !exportIncludeOffline) return false;
        return true;
      });

      // Sort: online first, then offline
      // Within each mode, sort by cl_name
      rows = rows.sort((a, b) => {
        // Sort by mode: online first
        if (a.mode !== b.mode) {
          return a.mode === "online" ? -1 : 1;
        }
        // If mode same, sort by cl_name
        const clNameA = a.cl?.fullName || "";
        const clNameB = b.cl?.fullName || "";
        return clNameA.localeCompare(clNameB);
      });

      const csv = toCSV(rows);
      const filename =
        exportType === "event" && exportEvent
          ? `registrations_${exportEvent
              .replaceAll(" ", "_")
              .toLowerCase()}.csv`
          : "registrations_all.csv";
      downloadFile(csv, filename);
    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to export registrations");
    } finally {
      setIsExporting(false);
      setExportDialogOpen(false);
    }
  };

  const runExport = () => handleExport();

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedEvent("all");
    setSelectedStatus("all");
    setSelectedMode("all");
    setSelectedCL("all");
  };

  // Add team member
  const addTeamMember = () => {
    const newMember: TeamMember = {
      uid: `new-${Date.now()}`,
      name: "",
      email: "",
      phone: "",
    };
    setEditTeamMembers((prev) => [...prev, newMember]);
  };

  // Remove team member
  const removeTeamMember = (index: number) => {
    setEditTeamMembers((prev) => prev.filter((_, i) => i !== index));
  };

  // Update team member
  const updateTeamMember = (
    index: number,
    field: keyof TeamMember,
    value: string
  ) => {
    setEditTeamMembers((prev) =>
      prev.map((member, i) =>
        i === index ? { ...member, [field]: value } : member
      )
    );
  };

  const getStatusBadge = (status: Registration["status"]) => {
    switch (status) {
      case "registered":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <UserPlus className="h-3 w-3 mr-1" />
            Registered
          </Badge>
        );
      case "submitted":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Send className="h-3 w-3 mr-1" />
            Submitted
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <Award className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <Ban className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getAttendanceBadge = (attendance: string | null) => {
    if (!attendance) {
      return (
        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      );
    }

    switch (attendance.toLowerCase()) {
      case "present":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Present
          </Badge>
        );
      case "absent":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="h-3 w-3 mr-1" />
            Absent
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <AlertCircle className="h-3 w-3 mr-1" />
            {attendance}
          </Badge>
        );
    }
  };

  const getModeBadge = (mode: Registration["mode"]) => {
    return mode === "online" ? (
      <Badge variant="outline" className="text-blue-600">
        <Globe className="h-3 w-3 mr-1" />
        Online
      </Badge>
    ) : (
      <Badge variant="outline" className="text-green-600">
        <MapPin className="h-3 w-3 mr-1" />
        Offline
      </Badge>
    );
  };

  // Handle bulk attendance update
  const handleBulkAttendanceUpdate = async (
    attendance_status: "present" | "absent"
  ) => {
    setIsUpdating(true);
    try {
      const result = await updateAttendanceStatus({
        registration_ids: selectedRegistrations,
        attendance_status,
      });

      if (result.success) {
        // Update local state
        setRegistrations((prev) =>
          prev.map((reg) =>
            result.data.uids.includes(reg.uid)
              ? { ...reg, attendance_status: result.data.status }
              : reg
          )
        );

        setSelectedRegistrations([]);
        setBulkAttendanceDialog(false);

        toast.success(
          `Marked ${result.data.updated} student(s) as ${result.data.status}`
        );
      } else {
        toast.error(result.error || "Failed to update attendance");
      }
    } catch (error) {
      console.error("Unexpected error updating attendance:", error);
      toast.error("Unexpected error occurred while updating attendance");
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle bulk status update
  const handleBulkStatusUpdate = async (
    status: "registered" | "submitted" | "completed" | "cancelled"
  ) => {
    setIsUpdating(true);
    try {
      const result = await updateRegistrationStatus({
        registration_ids: selectedRegistrations,
        registration_status: status,
      });

      if (result.success) {
        setRegistrations((prev) =>
          prev.map((reg) =>
            result.data.uids.includes(reg.uid)
              ? { ...reg, status: result.data.status }
              : reg
          )
        );

        setSelectedRegistrations([]);
        setBulkStatusDialog(false);

        toast.success(
          `Updated ${result.data.updated} student(s) to status: ${result.data.status}`
        );
      } else {
        toast.error(result.error || "Failed to update registration status");
      }
    } catch (error) {
      console.error("Unexpected error updating status:", error);
      toast.error("Unexpected error occurred while updating status");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="container max-w-7xl mx-auto py-4 md:px-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Manage Registrations
          </h1>
          <p className="text-muted-foreground text-sm">
            Comprehensive registration management with filtering and bulk
            operations
          </p>
        </div>
        <div className="flex gap-2">
          {selectedRegistrations.length > 0 && (
            <>
              <Button
                variant="outline"
                onClick={() => setBulkAttendanceDialog(true)}
              >
                <UserCheck className="h-4 w-4 mr-2" />
                Update Attendance ({selectedRegistrations.length})
              </Button>
              <Button
                variant="outline"
                onClick={() => setBulkStatusDialog(true)}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Update Status ({selectedRegistrations.length})
              </Button>
            </>
          )}
          <Button onClick={() => setExportDialogOpen(true)}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>
      {loading ? (
        <LoadingLogo />
      ) : (
        <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Registrations
                    </p>
                    <p className="text-2xl font-bold">
                      {stats.totalRegistrations}
                    </p>
                  </div>
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Completed
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {stats.completedCount}
                    </p>
                  </div>
                  <Award className="h-5 w-5 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Team Events
                    </p>
                    <p className="text-2xl font-bold text-purple-600">
                      {stats.teamEventsCount}
                    </p>
                  </div>
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Online Mode
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      {stats.onlineCount}
                    </p>
                  </div>
                  <Globe className="h-5 w-5 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Statistics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Registered
                    </p>
                    <p className="text-xl font-bold text-blue-600">
                      {stats.registeredCount}
                    </p>
                  </div>
                  <UserPlus className="h-4 w-4 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Submitted
                    </p>
                    <p className="text-xl font-bold text-yellow-600">
                      {stats.submittedCount}
                    </p>
                  </div>
                  <Send className="h-4 w-4 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Cancelled
                    </p>
                    <p className="text-xl font-bold text-red-600">
                      {stats.cancelledCount}
                    </p>
                  </div>
                  <Ban className="h-4 w-4 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Offline Mode
                    </p>
                    <p className="text-xl font-bold text-green-600">
                      {stats.offlineCount}
                    </p>
                  </div>
                  <MapPin className="h-4 w-4 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">All Registrations</CardTitle>
              <CardDescription>
                Search and filter registrations with advanced controls
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 mb-6">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by event name..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4">
                  <Select
                    value={selectedEvent}
                    onValueChange={setSelectedEvent}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="All Events" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      <SelectItem value="all">All Events</SelectItem>
                      {uniqueEvents.map((event) => (
                        <SelectItem key={event} value={event}>
                          {event}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="registered">Registered</SelectItem>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedMode} onValueChange={setSelectedMode}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="All Modes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Modes</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedCL} onValueChange={setSelectedCL}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="All CLs" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All CLs</SelectItem>
                      {uniqueCLs.map((cl) => (
                        <SelectItem key={cl} value={cl}>
                          {cl}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button variant="outline" onClick={clearFilters}>
                    <Filter className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                </div>
              </div>

              {/* Results Summary */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredRegistrations.length} of{" "}
                  {registrations.length} registrations
                </p>
                {filteredRegistrations.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={
                        selectedRegistrations.length ===
                        filteredRegistrations.length
                      }
                      onCheckedChange={handleSelectAll}
                    />
                    <span className="text-sm">Select All</span>
                  </div>
                )}
              </div>

              {/* Registrations Table */}
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={
                            selectedRegistrations.length ===
                              filteredRegistrations.length &&
                            filteredRegistrations.length > 0
                          }
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>UID</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Mode</TableHead>
                      <TableHead>Attendance</TableHead>
                      <TableHead>CL</TableHead>
                      <TableHead>College</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="w-12">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentRegistrations.map((registration) => (
                      <TableRow key={registration.uid}>
                        <TableCell>
                          <Checkbox
                            checked={selectedRegistrations.includes(
                              registration.uid
                            )}
                            onCheckedChange={(checked) =>
                              handleSelectRegistration(
                                registration.uid,
                                checked as boolean
                              )
                            }
                          />
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {registration.uid.slice(0, 8)}...
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {registration.event.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {registration.event.category}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {registration.user.fullName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {registration.user.email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {registration.is_team_event ? (
                            <div>
                              <p className="font-medium">
                                {registration.team_name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {registration.team_members.length + 1} members
                              </p>
                            </div>
                          ) : (
                            <Badge variant="outline">Individual</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(registration.status)}
                        </TableCell>
                        <TableCell>{getModeBadge(registration.mode)}</TableCell>
                        <TableCell>
                          {getAttendanceBadge(registration.attendance_status)}
                        </TableCell>
                        <TableCell>
                          {registration.cl ? (
                            <div>
                              <p className="font-medium">
                                {registration.cl.fullName}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {registration.cl.cl_code || "No Code"}
                              </p>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">No CL</span>
                          )}
                        </TableCell>
                        <TableCell>{registration.user.college_name}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>
                              {format(
                                new Date(registration.created_at),
                                "MMM dd, yyyy"
                              )}
                            </p>
                            <p className="text-muted-foreground">
                              {format(
                                new Date(registration.created_at),
                                "HH:mm"
                              )}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  setViewRegistration(registration)
                                }
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleEditRegistration(registration)
                                }
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Registration
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {filteredRegistrations.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No registrations found
                    </h3>
                    <p className="text-muted-foreground">
                      {searchQuery ||
                      selectedEvent !== "all" ||
                      selectedStatus !== "all" ||
                      selectedMode !== "all" ||
                      selectedCL !== "all"
                        ? "Try adjusting your search or filters"
                        : "No registrations have been made yet"}
                    </p>
                  </div>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-4">
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                      >
                        Previous
                      </Button>
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          return (
                            <Button
                              key={pageNum}
                              variant={
                                currentPage === pageNum ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => setCurrentPage(pageNum)}
                            >
                              {pageNum}
                            </Button>
                          );
                        }
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}

                {/* Results Info */}
                <div className="flex justify-between items-center text-sm text-muted-foreground mt-4 pt-4 border-t">
                  <span>
                    Showing {startIndex + 1}-{endIndex} of{" "}
                    {filteredRegistrations.length} records
                  </span>
                  <Badge variant="outline" className="text-sm px-3 py-1">
                    Total: {filteredRegistrations.length} records
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* View Registration Details Dialog */}
          <Dialog
            open={!!viewRegistration}
            onOpenChange={() => setViewRegistration(null)}
          >
            <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Registration Details</DialogTitle>
                <DialogDescription>
                  Complete information for this registration
                </DialogDescription>
              </DialogHeader>
              {viewRegistration && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3">Leader Information</h3>
                      <div className="space-y-2 text-sm">
                        <p>
                          <strong>Name:</strong>{" "}
                          {viewRegistration.user.fullName}
                        </p>
                        <p>
                          <strong>Email:</strong> {viewRegistration.user.email}
                        </p>
                        <p>
                          <strong>Phone:</strong> {viewRegistration.user.phone}
                        </p>
                        <p>
                          <strong>Branch:</strong>{" "}
                          {viewRegistration.user.branch}
                        </p>
                        <p>
                          <strong>Year:</strong>{" "}
                          {viewRegistration.user.year_of_study}
                        </p>
                        <p>
                          <strong>College:</strong>{" "}
                          {viewRegistration.user.college_name}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">Event Information</h3>
                      <div className="space-y-2 text-sm">
                        <p>
                          <strong>Event:</strong> {viewRegistration.event.name}
                        </p>
                        <p>
                          <strong>Category:</strong>{" "}
                          {viewRegistration.event.category}
                        </p>
                        <p>
                          <strong>Mode:</strong>{" "}
                          {getModeBadge(viewRegistration.mode)}
                        </p>
                        <p>
                          <strong>Status:</strong>{" "}
                          {getStatusBadge(viewRegistration.status)}
                        </p>
                        <p>
                          <strong>Attendance:</strong>{" "}
                          {getAttendanceBadge(
                            viewRegistration.attendance_status
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {viewRegistration.cl && (
                    <div>
                      <h3 className="font-semibold mb-3">
                        Contact Contingent Leader
                      </h3>
                      <div className="space-y-2 text-sm">
                        <p>
                          <strong>Name:</strong> {viewRegistration.cl.fullName}
                        </p>
                        <p>
                          <strong>Email:</strong> {viewRegistration.cl.email}
                        </p>
                        <p>
                          <strong>Phone:</strong> {viewRegistration.cl.phone}
                        </p>
                        <p>
                          <strong>CL Code:</strong>{" "}
                          {viewRegistration.cl.cl_code || "Not assigned"}
                        </p>
                        <p>
                          <strong>College:</strong>{" "}
                          {viewRegistration.cl.college_name}
                        </p>
                      </div>
                    </div>
                  )}

                  {viewRegistration.is_team_event && (
                    <div>
                      <h3 className="font-semibold mb-3">Team Information</h3>
                      <div className="space-y-2 text-sm">
                        <p>
                          <strong>Team Name:</strong>{" "}
                          {viewRegistration.team_name}
                        </p>
                        <p>
                          <strong>Team Size:</strong>{" "}
                          {viewRegistration.team_members.length + 1} members
                        </p>
                      </div>
                      {viewRegistration.team_members.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-medium mb-2">Team Members:</h4>
                          <div className="space-y-2">
                            {viewRegistration.team_members.map(
                              (member, index) => (
                                <div
                                  key={member.uid}
                                  className="p-3 bg-muted/50 rounded-lg"
                                >
                                  <p className="font-medium">{member.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {member.email}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {member.phone}
                                  </p>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold mb-3">Registration Details</h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>UID:</strong> {viewRegistration.uid}
                      </p>
                      <p>
                        <strong>Created:</strong>{" "}
                        {format(
                          new Date(viewRegistration.created_at),
                          "EEEE, MMMM dd, yyyy 'at' HH:mm"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setViewRegistration(null)}
                >
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Registration Dialog */}
          <Dialog
            open={!!editRegistration}
            onOpenChange={() => setEditRegistration(null)}
          >
            <DialogContent className="sm:max-w-4xl">
              <DialogHeader>
                <DialogTitle>Edit Registration</DialogTitle>
                <DialogDescription>
                  Update registration details and team members
                </DialogDescription>
              </DialogHeader>
              {editRegistration && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={editStatus}
                          onValueChange={(value) =>
                            setEditStatus(value as Registration["status"])
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="registered">
                              Registered
                            </SelectItem>
                            <SelectItem value="submitted">Submitted</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="mode">Mode</Label>
                        <Select
                          value={editMode}
                          onValueChange={(value) =>
                            setEditMode(value as Registration["mode"])
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="online">Online</SelectItem>
                            <SelectItem value="offline">Offline</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="attendance">Attendance Status</Label>
                        <Input
                          id="attendance"
                          value={editAttendance}
                          onChange={(e) => setEditAttendance(e.target.value)}
                          placeholder="e.g., present, absent, late"
                        />
                      </div>
                    </div>
                  </div>

                  {editRegistration.is_team_event && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">Team Members</h3>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addTeamMember}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Member
                        </Button>
                      </div>
                      <div className="space-y-4">
                        {editTeamMembers.map((member, index) => (
                          <div
                            key={member.uid}
                            className="p-4 border rounded-lg space-y-3"
                          >
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">
                                Member {index + 1}
                              </h4>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeTeamMember(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div>
                                <Label>Name</Label>
                                <Input
                                  value={member.name}
                                  onChange={(e) =>
                                    updateTeamMember(
                                      index,
                                      "name",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Full name"
                                />
                              </div>
                              <div>
                                <Label>Email</Label>
                                <Input
                                  value={member.email}
                                  onChange={(e) =>
                                    updateTeamMember(
                                      index,
                                      "email",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Email address"
                                />
                              </div>
                              <div>
                                <Label>Phone</Label>
                                <Input
                                  value={member.phone}
                                  onChange={(e) =>
                                    updateTeamMember(
                                      index,
                                      "phone",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Phone number"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setEditRegistration(null)}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveRegistration} disabled={isUpdating}>
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Bulk Attendance Update Dialog */}
          <Dialog
            open={bulkAttendanceDialog}
            onOpenChange={setBulkAttendanceDialog}
          >
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Update Attendance</DialogTitle>
                <DialogDescription>
                  Update attendance for {selectedRegistrations.length} selected
                  registrations
                </DialogDescription>
              </DialogHeader>
              <div className="flex gap-4 justify-center py-4">
                <Button
                  onClick={() => handleBulkAttendanceUpdate("present")}
                  disabled={isUpdating}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark Present
                </Button>
                <Button
                  onClick={() => handleBulkAttendanceUpdate("absent")}
                  disabled={isUpdating}
                  variant="destructive"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Mark Absent
                </Button>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setBulkAttendanceDialog(false)}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Bulk Status Update Dialog */}
          <Dialog open={bulkStatusDialog} onOpenChange={setBulkStatusDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Update Status</DialogTitle>
                <DialogDescription>
                  Update status for {selectedRegistrations.length} selected
                  registrations
                </DialogDescription>
              </DialogHeader>
              <div className="flex gap-2 justify-center py-4 flex-wrap">
                <Button
                  onClick={() => handleBulkStatusUpdate("registered")}
                  disabled={isUpdating}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Registered
                </Button>
                <Button
                  onClick={() => handleBulkStatusUpdate("submitted")}
                  disabled={isUpdating}
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Submitted
                </Button>
                <Button
                  onClick={() => handleBulkStatusUpdate("completed")}
                  disabled={isUpdating}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Award className="h-4 w-4 mr-2" />
                  Completed
                </Button>
                <Button
                  onClick={() => handleBulkStatusUpdate("cancelled")}
                  disabled={isUpdating}
                  variant="destructive"
                >
                  <Ban className="h-4 w-4 mr-2" />
                  Cancelled
                </Button>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setBulkStatusDialog(false)}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Export Report Dialog: All registrations or Event-wise */}
          <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Export Registrations Report</DialogTitle>
                <DialogDescription>
                  Choose export type and include online/offline registrations as
                  needed
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Export Type Selection */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={exportType === "all" ? "default" : "outline"}
                    onClick={() => setExportType("all")}
                  >
                    All Registrations
                  </Button>
                  <Button
                    type="button"
                    variant={exportType === "event" ? "default" : "outline"}
                    onClick={() => setExportType("event")}
                  >
                    Event-wise
                  </Button>
                </div>

                {/* Event Selector (shown only if 'event' type is selected) */}
                {exportType === "event" && (
                  <div>
                    <Label>Select Event</Label>
                    <Select value={exportEvent} onValueChange={setExportEvent}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Choose an event" />
                      </SelectTrigger>
                      <SelectContent className="max-h-50 overflow-y-auto">
                        {uniqueEvents.map((eventName) => (
                          <SelectItem key={eventName} value={eventName}>
                            {eventName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Mode Filters */}
                <div className="space-y-2">
                  <Label>Include Modes</Label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={exportIncludeOnline}
                        onCheckedChange={(checked) =>
                          setExportIncludeOnline(checked === true)
                        }
                      />
                      <span className="text-sm flex items-center gap-1">
                        <Globe className="h-3 w-3" /> Online
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={exportIncludeOffline}
                        onCheckedChange={(checked) =>
                          setExportIncludeOffline(checked === true)
                        }
                      />
                      <span className="text-sm flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> Offline
                      </span>
                    </div>
                  </div>
                </div>

                {/* Included Columns Info */}
                <div className="rounded-md border p-3 text-xs text-muted-foreground">
                  <p className="mb-1 font-medium text-foreground">
                    Included columns
                  </p>
                  <p>
                    UID, Event, Category, User, Email, Team, Team size, Status,
                    Mode, Attendance, CL Name, CL Code, College, Created Date,
                    Created Time
                  </p>
                </div>
              </div>

              {/* Dialog Footer with actions */}
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setExportDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={runExport}
                  disabled={exportType === "event" && !exportEvent}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
