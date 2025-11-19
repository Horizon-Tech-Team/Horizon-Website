/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  assignEventAlias,
  getAllClDashboardAction,
} from "@/app/actions/actions";
import LoadingLogo from "@/components/loading-logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import {
  Download,
  Edit,
  Eye,
  Filter,
  GraduationCap,
  Loader2,
  Mail,
  Search,
  TrendingUp,
  Trophy,
  Users,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

// Filter interfaces
interface CLFilters {
  searchTerm: string;
  colleges: string[];
  clCodes: string[];
  eventAliases: string[];
  studentsRange: { min: number; max: number };
  registrationDateRange: { from: Date | undefined; to: Date | undefined };
}

const Page = () => {
  const router = useRouter();
  const [allCLs, setAllCLs] = useState<any[]>([]); // Data from API
  const [selectedCLs, setSelectedCLs] = useState<string[]>([]);
  const [isAssignAliasOpen, setIsAssignAliasOpen] = useState(false);
  const [newEventAlias, setNewEventAlias] = useState("");

  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);

  const [clFilters, setCLFilters] = useState<CLFilters>({
    searchTerm: "",
    colleges: [],
    clCodes: [],
    eventAliases: [],
    studentsRange: { min: 0, max: 100 },
    registrationDateRange: { from: undefined, to: undefined },
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await getAllClDashboardAction();
      if (result.success) {
        setAllCLs(result.data);
      } else {
        console.error("Failed to fetch data:", result.error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // ✅ Generate unique filter options from API data
  const uniqueColleges = [
    ...new Set(allCLs.map((cl) => cl.contingent.college_name)),
  ];
  const uniqueCLCodes = [...new Set(allCLs.map((cl) => cl.contingent.cl_code))];
  const uniqueEventAliases = [
    ...new Set(
      allCLs
        .map((cl) => cl.contingent.event_alias)
        .filter((alias) => alias && alias.length > 0)
    ),
  ];

  // ✅ Filter data based on filters
  const filteredCLs = useMemo(() => {
    return allCLs.filter((cl) => {
      const fullName =
        `${cl.cl_user.firstName} ${cl.cl_user.lastName}`.toLowerCase();
      const searchMatch =
        fullName.includes(clFilters.searchTerm.toLowerCase()) ||
        cl.contingent.college_name
          .toLowerCase()
          .includes(clFilters.searchTerm.toLowerCase()) ||
        cl.cl_user.email
          .toLowerCase()
          .includes(clFilters.searchTerm.toLowerCase()) ||
        cl.contingent.cl_code
          .toLowerCase()
          .includes(clFilters.searchTerm.toLowerCase());

      const collegeMatch =
        clFilters.colleges.length === 0 ||
        clFilters.colleges.includes(cl.contingent.college_name);
      const clCodeMatch =
        clFilters.clCodes.length === 0 ||
        clFilters.clCodes.includes(cl.contingent.cl_code);
      const eventAliasMatch =
        clFilters.eventAliases.length === 0 ||
        (cl.contingent.event_alias &&
          clFilters.eventAliases.includes(cl.contingent.event_alias));
      const studentsMatch =
        cl.summary.total_students >= clFilters.studentsRange.min &&
        cl.summary.total_students <= clFilters.studentsRange.max;

      const registrationDate = new Date(cl.cl_user.created_at);
      const dateMatch =
        (!clFilters.registrationDateRange.from ||
          registrationDate >= clFilters.registrationDateRange.from) &&
        (!clFilters.registrationDateRange.to ||
          registrationDate <= clFilters.registrationDateRange.to);

      return (
        searchMatch &&
        collegeMatch &&
        clCodeMatch &&
        eventAliasMatch &&
        studentsMatch &&
        dateMatch
      );
    });
  }, [allCLs, clFilters]);

  const clearCLFilters = () => {
    setCLFilters({
      searchTerm: "",
      colleges: [],
      clCodes: [],
      eventAliases: [],
      studentsRange: { min: 0, max: 100 },
      registrationDateRange: { from: undefined, to: undefined },
    });
  };

  const handleCLClick = (cl: any) => {
    router.push(`/dashboard/cl?cl_id=${cl.cl_user.uid}`);
  };

  const handleSelectCL = (clId: string, checked: boolean) => {
    if (checked) {
      setSelectedCLs([...selectedCLs, clId]);
    } else {
      setSelectedCLs(selectedCLs.filter((id) => id !== clId));
    }
  };

  const handleAssignEventAlias = async () => {
    if (!newEventAlias || selectedCLs.length === 0) {
      toast.error("Please select at least one CL and enter an alias");
      return;
    }

    setAssigning(true); // ✅ start loading

    try {
      const results = await Promise.all(
        selectedCLs.map((clId) => assignEventAlias(clId, newEventAlias))
      );

      const failed = results.filter((r) => !r.success);
      if (failed.length > 0) {
        toast.error(failed[0].error || "Failed to assign alias for some CLs");
      } else {
        toast.success("Event alias assigned successfully!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while assigning alias.");
    } finally {
      setAssigning(false); // ✅ stop loading
      setIsAssignAliasOpen(false);
      setNewEventAlias("");
      setSelectedCLs([]);
    }
  };

  return (
    <div className="container max-w-7xl mx-auto py-4 md:px-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">PR Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            Monitor and manage College Leader performance across all events
          </p>
        </div>
        <div className="flex gap-2">
          {selectedCLs.length > 0 && (
            <Dialog
              open={isAssignAliasOpen}
              onOpenChange={setIsAssignAliasOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Assign Event Alias ({selectedCLs.length})
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Assign Event Alias</DialogTitle>
                  <DialogDescription>
                    Assign an event alias to {selectedCLs.length} selected
                    College Leader(s)
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="event-alias">Event Alias</Label>
                    <Input
                      id="event-alias"
                      value={newEventAlias}
                      onChange={(e) => setNewEventAlias(e.target.value)}
                      placeholder="Enter event alias name..."
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsAssignAliasOpen(false)}
                  >
                    Cancel
                  </Button>

                  <Button
                    onClick={handleAssignEventAlias}
                    disabled={assigning || !newEventAlias.trim()}
                  >
                    {assigning ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Assigning...
                      </>
                    ) : (
                      "Assign Alias"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>
      {loading ? (
        <LoadingLogo />
      ) : (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total CLs
                    </p>
                    <p className="text-2xl font-bold">{allCLs.length}</p>
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
                      Total Students
                    </p>
                    <p className="text-2xl font-bold">
                      {allCLs.reduce(
                        (sum, cl) => sum + cl.summary.total_students,
                        0
                      )}
                    </p>
                  </div>
                  <GraduationCap className="h-5 w-5 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total PR Points
                    </p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {allCLs
                        .reduce(
                          (sum, cl) => sum + cl.summary.total_pr_points,
                          0
                        )
                        .toLocaleString()}
                    </p>
                  </div>
                  <Trophy className="h-5 w-5 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Avg Points/CL
                    </p>
                    <p className="text-2xl font-bold text-purple-600">
                      {allCLs.length > 0
                        ? Math.round(
                            allCLs.reduce(
                              (sum, cl) => sum + cl.summary.total_pr_points,
                              0
                            ) / allCLs.length
                          )
                        : 0}
                    </p>
                  </div>
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Contingent Leaders Overview
              </CardTitle>
              <CardDescription>
                Complete breakdown of all CLs and their performance metrics{" "}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 mb-6">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, college, CL code..."
                    className="pl-9"
                    value={clFilters.searchTerm}
                    onChange={(e) =>
                      setCLFilters({ ...clFilters, searchTerm: e.target.value })
                    }
                  />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4">
                  {/* Colleges */}
                  <Select
                    value={clFilters.colleges.join(",") || "all"}
                    onValueChange={(val) => {
                      const selected = val === "all" ? [] : val.split(",");
                      setCLFilters({ ...clFilters, colleges: selected });
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="All Colleges" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Colleges</SelectItem>
                      {uniqueColleges.map((college) => (
                        <SelectItem key={college} value={college}>
                          {college}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* CL Codes */}
                  <Select
                    value={clFilters.clCodes.join(",") || "all"}
                    onValueChange={(val) => {
                      const selected = val === "all" ? [] : val.split(",");
                      setCLFilters({ ...clFilters, clCodes: selected });
                    }}
                  >
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="All CL Codes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All CL Codes</SelectItem>
                      {uniqueCLCodes.map((clCode) => (
                        <SelectItem key={clCode} value={clCode}>
                          {clCode}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Event Aliases */}
                  <Select
                    value={clFilters.eventAliases.join(",") || "all"}
                    onValueChange={(val) => {
                      const selected = val === "all" ? [] : val.split(",");
                      setCLFilters({ ...clFilters, eventAliases: selected });
                    }}
                  >
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="All Event Aliases" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Event Aliases</SelectItem>
                      {uniqueEventAliases.map((alias) => (
                        <SelectItem key={alias} value={alias}>
                          {alias}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Clear Filters */}
                  <Button variant="outline" onClick={clearCLFilters}>
                    <X className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                </div>
              </div>

              {/* Results Summary */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredCLs.length} of {allCLs.length} CLs
                </p>
                {filteredCLs.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={
                        selectedCLs.length === filteredCLs.length &&
                        filteredCLs.length > 0
                      }
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedCLs(
                            filteredCLs.map((cl) => cl.cl_user.uid)
                          );
                        } else {
                          setSelectedCLs([]);
                        }
                      }}
                    />
                    <span className="text-sm">Select All</span>
                  </div>
                )}
              </div>

              {/* CLs Table */}
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={
                            selectedCLs.length === filteredCLs.length &&
                            filteredCLs.length > 0
                          }
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedCLs(
                                filteredCLs.map((cl) => cl.cl_user.uid)
                              );
                            } else {
                              setSelectedCLs([]);
                            }
                          }}
                        />
                      </TableHead>
                      <TableHead>CL Details</TableHead>
                      <TableHead className="text-center">CL Code</TableHead>
                      <TableHead className="text-center">Event Alias</TableHead>
                      <TableHead className="text-center">College</TableHead>
                      <TableHead className="text-center">Students</TableHead>
                      <TableHead className="text-center">PR Points</TableHead>
                      <TableHead className="text-center">Events</TableHead>
                      <TableHead className="text-center">Created</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredCLs.map((cl) => (
                      <TableRow
                        key={cl.cl_user.uid}
                        className="hover:bg-muted/50 cursor-pointer"
                        onClick={() => handleCLClick(cl)}
                      >
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={selectedCLs.includes(cl.cl_user.uid)}
                            onCheckedChange={(checked) =>
                              handleSelectCL(cl.cl_user.uid, checked as boolean)
                            }
                          />
                        </TableCell>

                        {/* CL Details */}
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={cl.cl_user.avatar || undefined}
                              />
                              <AvatarFallback className="bg-blue-100 text-blue-600">
                                {cl.cl_user.firstName[0]}
                                {cl.cl_user.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-semibold">
                                {cl.cl_user.firstName} {cl.cl_user.lastName}
                              </div>
                              <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {cl.cl_user.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="text-center">
                          <Badge
                            variant="outline"
                            className="font-mono text-xs"
                          >
                            {cl.contingent.cl_code}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-center">
                          {cl.contingent.event_alias ? (
                            <Badge variant="secondary" className="text-xs">
                              {cl.contingent.event_alias}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              -
                            </span>
                          )}
                        </TableCell>

                        <TableCell className="text-center">
                          <div className="font-medium">
                            {cl.contingent.college_name}
                          </div>
                        </TableCell>

                        <TableCell className="text-center">
                          <div className="text-lg font-bold text-blue-600">
                            {cl.summary.total_students}
                          </div>
                        </TableCell>

                        <TableCell className="text-center">
                          <div className="text-lg font-bold text-yellow-600">
                            {cl.summary.total_pr_points}
                          </div>
                        </TableCell>

                        <TableCell className="text-center">
                          <div className="text-lg font-bold text-green-600">
                            {
                              cl.summary.events.filter(
                                (e: any) => e.registrations_count > 0
                              ).length
                            }
                          </div>
                        </TableCell>

                        <TableCell className="text-center">
                          <div className="text-sm">
                            {format(
                              new Date(cl.cl_user.created_at),
                              "MMM dd, yyyy"
                            )}
                          </div>
                        </TableCell>

                        <TableCell className="text-center">
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCLClick(cl);
                            }}
                            className="flex items-center gap-1"
                          >
                            <Eye className="h-3 w-3" />
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Empty State */}
                {filteredCLs.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No CLs found</h3>
                    <p>
                      {clFilters.searchTerm ||
                      clFilters.colleges.length > 0 ||
                      clFilters.clCodes.length > 0 ||
                      clFilters.eventAliases.length > 0
                        ? "Try adjusting your search or filters"
                        : "No CLs have been added yet"}
                    </p>
                    <Button
                      variant="outline"
                      onClick={clearCLFilters}
                      className="mt-2 bg-transparent"
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Page;
