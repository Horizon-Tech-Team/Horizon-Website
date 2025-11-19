"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate, formatTime } from "@/lib/utils";
import {
  Award,
  Calendar,
  Filter,
  Star,
  Target,
  Trophy,
  User,
  Users,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import { PRPointRecord, PR_History } from "@/lib/types";

type Props = {
  data: PRPointRecord[] | PR_History[];
  role: "contingent_leader" | "public_relation";
};

export default function PRHistoryList({ data, role }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRuleType, setFilterRuleType] = useState("all");
  const [filterMonth, setFilterMonth] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterCL, setFilterCL] = useState("all");

  const itemsPerPage = 3;

  // Derived data
  const ruleTypes = useMemo(() => {
    const types = new Set(data.map((r) => r.rule_type));
    return Array.from(types).map((type) => ({ value: type, label: type }));
  }, [data]);

  const uniqueDays = useMemo(() => {
    const days = new Set(
      data.map((r) =>
        new Date(r.created_at).toLocaleString("default", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      )
    );
    return Array.from(days);
  }, [data]);

  const uniqueCLs = useMemo(() => {
    if (role !== "public_relation") return [];
    const cls = new Map<string, string>();
    (data as PR_History[]).forEach((r) => {
      if (r.cl) {
        cls.set(
          r.cl.uid,
          `${r.cl.firstName} ${r.cl.lastName} (${r.cl.college_name})`
        );
      }
    });
    return Array.from(cls.entries()).map(([id, label]) => ({
      value: id,
      label,
    }));
  }, [data, role]);

  const filteredPRPoints = useMemo(() => {
    return data.filter((r) => {
      const matchesSearch =
        searchTerm.trim() === "" ||
        r.rule_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.event?.name?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRuleType =
        filterRuleType !== "all" ? r.rule_type === filterRuleType : true;

      const matchesMonth =
        filterMonth !== "all"
          ? new Date(r.created_at).toLocaleString("default", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }) === filterMonth
          : true;

      const matchesCL =
        role === "public_relation" && filterCL !== "all"
          ? (r as PR_History).cl?.uid === filterCL
          : true;

      return matchesSearch && matchesRuleType && matchesMonth && matchesCL;
    });
  }, [data, searchTerm, filterRuleType, filterMonth, filterCL, role]);

  const totalPages = Math.ceil(filteredPRPoints.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredPRPoints.length);
  const currentPagePRPoints = filteredPRPoints.slice(startIndex, endIndex);

  const totalPRPoints = data.reduce((sum, record) => sum + record.points, 0);

  // Allocators/Contingent Leaders
  const uniqueAllocators =
    role === "contingent_leader"
      ? new Set((data as PRPointRecord[]).map((r) => r?.awarded_by)).size
      : new Set((data as PR_History[]).map((r) => r?.cl_id)).size;

  const uniqueEvents = new Set(
    data.filter((r) => r.event).map((r) => r.event!.name)
  ).size;

  const getRuleTypeIcon = (ruleType: string) => {
    switch (ruleType) {
      case "winner_1st":
        return <Trophy className="h-4 w-4" />;
      case "on_spot_participation":
        return <Zap className="h-4 w-4" />;
      case "Event_position":
        return <Target className="h-4 w-4" />;
      case "Base_points":
        return <Star className="h-4 w-4" />;
      default:
        return <Award className="h-4 w-4" />;
    }
  };

  const getRuleTypeColor = (ruleType: string) => {
    switch (ruleType) {
      case "winner_1st":
        return "bg-yellow-500";
      case "on_spot_participation":
        return "bg-blue-500";
      case "Event_position":
        return "bg-green-500";
      case "Base_points":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  console.log(data);

  console.log("Filter values:", {
    filterRuleType,
    filterMonth,
    searchTerm,
    total: data.length,
  });
  console.log("Filtered records:", filteredPRPoints);

  return (
    <Card>
      <CardHeader>
        <CardTitle>PR Points History</CardTitle>
        <CardDescription>
          Track your{" "}
          {role === "contingent_leader" ? "PR points" : "awarded PR points"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">
                {totalPRPoints}
              </div>
              <p className="text-sm text-muted-foreground">Total Points</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {uniqueAllocators}
              </div>
              <p className="text-sm text-muted-foreground">
                {role === "contingent_leader"
                  ? "Allocators"
                  : "Contingent Leaders"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {uniqueEvents}
              </div>
              <p className="text-sm text-muted-foreground">Events</p>
            </CardContent>
          </Card>
        </div>
        <div className="text-xs text-muted-foreground italic">
          Note: Online + Offline Participation points are excluded from the
          total above. This history only includes awarded PR points. You can
          view your full PR score on the Dashboard page.
        </div>

        {/* Filters */}
        {/* <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex w-full gap-2">
            <Input
              placeholder="Search by rule or event"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={filterRuleType} onValueChange={setFilterRuleType}>
              <SelectTrigger className="w-40">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Rule Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {ruleTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {role === "public_relation" && (
              <Select value={filterCL} onValueChange={setFilterCL}>
                <SelectTrigger className="w-60">
                  <Users className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by CL" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All CLs</SelectItem>
                  {uniqueCLs.map((cl) => (
                    <SelectItem key={cl.value} value={cl.value}>
                      {cl.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Select value={filterMonth} onValueChange={setFilterMonth}>
              <SelectTrigger className="w-36">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {uniqueDays.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div> */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div
            className={`grid gap-4 w-full ${
              role === "public_relation" ? "grid-cols-4" : "grid-cols-3"
            }`}
          >
            {/* Search */}
            <div className="flex flex-col">
              <label className="text-xs text-muted-foreground mb-1">
                Search
              </label>
              <Input
                placeholder="By rule or event"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Rule Type */}
            <div className="flex flex-col">
              <label className="text-xs text-muted-foreground mb-1">
                Rule Type
              </label>
              <Select value={filterRuleType} onValueChange={setFilterRuleType}>
                <SelectTrigger>
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Select Rule" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {ruleTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* CL Filter (only for PR role) */}
            {role === "public_relation" && (
              <div className="flex flex-col">
                <label className="text-xs text-muted-foreground mb-1">
                  Contingent Leader
                </label>
                <Select value={filterCL} onValueChange={setFilterCL}>
                  <SelectTrigger>
                    <Users className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Select CL" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All CLs</SelectItem>
                    {uniqueCLs.map((cl) => (
                      <SelectItem key={cl.value} value={cl.value}>
                        {cl.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Month */}
            <div className="flex flex-col">
              <label className="text-xs text-muted-foreground mb-1">
                Month
              </label>
              <Select value={filterMonth} onValueChange={setFilterMonth}>
                <SelectTrigger>
                  <Calendar className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Select Month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {uniqueDays.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Clear Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchTerm("");
              setFilterRuleType("all");
              setFilterMonth("all");
              if (role === "public_relation") setFilterCL("all");
            }}
          >
            Clear Filters
          </Button>
        </div>

        {/* PR Points History */}
        <div className="space-y-4">
          {filteredPRPoints.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No PR points records found matching your criteria.
            </div>
          ) : (
            <>
              {currentPagePRPoints.map((record) => (
                <Card
                  key={record.uid}
                  className="border-l-4 border-l-primary  shadow-sm rounded-xl transition-all hover:shadow-md"
                >
                  <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-5">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className={`p-2 rounded-full ${getRuleTypeColor(
                            record.rule_type
                          )} text-white flex items-center justify-center`}
                          style={{ minWidth: 30, minHeight: 30 }}
                        >
                          {getRuleTypeIcon(record.rule_type)}
                        </div>
                        <Badge
                          variant="outline"
                          className="px-3 font-mono py-1 rounded-full border-primary text-primary bg-primary/10 dark:bg-primary/20"
                        >
                          +{record.points} pts
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="px-3 py-1 rounded-full bg-muted text-muted-foreground border border-border"
                        >
                          {ruleTypes.find((r) => r.value === record.rule_type)
                            ?.label || record.rule_type}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="text-base font-semibold text-foreground">
                          {record.description}
                        </div>

                        {record.event && (
                          <div className="text-sm text-muted-foreground">
                            <span className="font-medium">
                              {record.event.name}
                            </span>{" "}
                            <span className="text-xs text-muted-foreground">
                              ({record.event.category})
                            </span>
                          </div>
                        )}

                        {record.member && record.member.uid && (
                          <div className="flex items-center gap-2 text-sm mt-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              Student:
                            </span>
                            <span className="font-medium text-foreground">
                              {record.member.firstName} {record.member.lastName}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-sm mt-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {role === "contingent_leader"
                              ? "Allocated by:"
                              : "Contingent Leader:"}
                          </span>
                          <span className="font-medium text-foreground">
                            {role === "contingent_leader"
                              ? (record as PRPointRecord).pr_user?.firstName +
                                " " +
                                (record as PRPointRecord).pr_user?.lastName
                              : (record as PR_History).cl?.firstName +
                                " " +
                                (record as PR_History).cl?.lastName +
                                " from " +
                                (record as PR_History).cl?.college_name}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 min-w-[100px]">
                      <div className="text-sm text-muted-foreground font-medium">
                        {formatDate(record.created_at)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatTime(record.created_at)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      Previous
                    </Button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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
                          className="px-3"
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
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
                  Showing {startIndex + 1}-
                  {Math.min(endIndex, filteredPRPoints.length)} of{" "}
                  {filteredPRPoints.length} records
                </span>
                <Badge variant="outline" className="text-sm px-3 py-1">
                  Total:{" "}
                  {filteredPRPoints.reduce(
                    (sum, record) => sum + record.points,
                    0
                  )}{" "}
                  points
                </Badge>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
