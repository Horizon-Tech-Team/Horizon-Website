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
import { PRPointRecord } from "@/lib/types";
import { formatDate, formatTime } from "@/lib/utils";
import {
  Award,
  Calendar,
  Filter,
  Star,
  Target,
  Trophy,
  User,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";

type Props = {
  clHistoryData: PRPointRecord[];
};

export default function ClPRHistory({ clHistoryData }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRuleType, setFilterRuleType] = useState("all");
  const [filterMonth, setFilterMonth] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 3;

  // Derived data
  const ruleTypes = useMemo(() => {
    const types = new Set(clHistoryData.map((r) => r.rule_type));
    return Array.from(types).map((type) => ({ value: type, label: type }));
  }, [clHistoryData]);

  const uniqueDays = useMemo(() => {
    const days = new Set(
      clHistoryData.map((r) =>
        new Date(r.created_at).toLocaleString("default", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      )
    );
    return Array.from(days);
  }, [clHistoryData]);

  const filteredPRPoints = useMemo(() => {
    return clHistoryData.filter((r) => {
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

      return matchesSearch && matchesRuleType && matchesMonth;
    });
  }, [clHistoryData, searchTerm, filterRuleType, filterMonth]);

  const totalPages = Math.ceil(filteredPRPoints.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredPRPoints.length);
  const currentPagePRPoints = filteredPRPoints.slice(startIndex, endIndex);

  const totalPRPoints = clHistoryData.reduce(
    (sum, record) => sum + record.points,
    0
  );
  const uniqueAllocators = new Set(clHistoryData.map((r) => r?.awarded_by))
    .size;
  const uniqueEvents = new Set(
    clHistoryData.filter((r) => r.event).map((r) => r.event!.name)
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

  console.log(clHistoryData);

  console.log("Filter values:", {
    filterRuleType,
    filterMonth,
    searchTerm,
    total: clHistoryData.length,
  });
  console.log("Filtered records:", filteredPRPoints);

  return (
    <Card>
      <CardHeader>
        <CardTitle>PR Points History</CardTitle>
        <CardDescription>Track your PR points history</CardDescription>
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
              <p className="text-sm text-muted-foreground">Allocators</p>
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
          Note: Participation points are excluded from the total above. This
          history only includes awarded PR points. You can view your full PR
          score on the CL Dashboard page.
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
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
                <Card key={record.uid} className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div
                            className={`p-1 rounded-full ${getRuleTypeColor(
                              record.rule_type
                            )} text-white`}
                          >
                            {getRuleTypeIcon(record.rule_type)}
                          </div>
                          <Badge
                            variant="outline"
                            className="font-mono text-lg px-3 py-1"
                          >
                            +{record.points} pts
                          </Badge>
                          <Badge variant="secondary">
                            {ruleTypes.find((r) => r.value === record.rule_type)
                              ?.label || record.rule_type}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <div className="text-base font-medium">
                            {record.description}
                          </div>

                          {record.event && (
                            <div className="text-sm text-muted-foreground">
                              <span className="font-medium">
                                {record.event.name}
                              </span>{" "}
                              ({record.event.category})
                            </div>
                          )}

                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                Allocated by:
                              </span>
                              <span className="font-medium">
                                {record.pr_user?.firstName +
                                  " " +
                                  record.pr_user?.lastName}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                PR
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">
                          {formatDate(record.created_at)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatTime(record.created_at)}
                        </div>
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

                    {/* Page Numbers */}
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

        {/* History List */}
        {/* <div className="space-y-4">
          {currentPagePRPoints.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No records found.
            </div>
          ) : (
            currentPagePRPoints.map((record) => (
              <Card key={record.uid}>
                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                  <div
                    className={`rounded-full p-2 text-white ${getRuleTypeColor(
                      record.rule_type
                    )}`}
                  >
                    {getRuleTypeIcon(record.rule_type)}
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold">
                      PR
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Allocated by {record.awarded_by}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-2 text-sm text-muted-foreground">
                  {record.event && (
                    <div>
                      <span className="font-medium">{record.event.name}</span> (
                      {record.event.category})
                    </div>
                  )}
                  <div>
                    <strong>Points:</strong> {record.points}
                  </div>
                  <div>
                    <strong>Date:</strong> {formatDate(record.created_at)}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div> */}

        {/* Pagination */}
        {/* {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4">
            <p className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {endIndex} of{" "}
              {filteredPRPoints.length} records
            </p>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )} */}
      </CardContent>
    </Card>
  );
}
