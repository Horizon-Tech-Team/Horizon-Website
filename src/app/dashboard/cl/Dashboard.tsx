/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Award,
  ChevronDown,
  ChevronRight,
  Download,
  Eye,
  Target,
  Trophy,
  Users,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ✅ Types
type Participant = {
  id: string;
  name: string;
  email?: string;
  avatar?: string | null;
  points?: number;
  rank?: string;
};

type EventReport = {
  event_name: string;
  registrations: {
    online: { count: number; bonus: number; participants: Participant[] };
    offline: { count: number; bonus: number; participants: Participant[] };
  };
  rounds: {
    round_1_qualified?: Participant[];
    round_2_qualified?: Participant[];
    runner_ups?: Participant[];
  };
  ranks: {
    achieved: string[];
    bonus: number;
    participants: (Participant & { rank: string })[];
  };
  total_event_score: number;
};

export type ScoreReport = {
  categories: Record<string, EventReport[]>;
  summary: {
    category_totals: Record<string, number>;
    extra_activities_score: number;
    negative_activities_score: number;
    final_score: number;
  };
};

type ChildProps = {
  report: ScoreReport;
};

// ✅ Helper
function getInitials(name: string) {
  const parts = (name || "").trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0] + parts[parts.length - 1]![0]).toUpperCase();
}

function CLDashboard({ report }: ChildProps) {
  const [activeTab, setActiveTab] = useState<string>("final");

  const scoringData = useMemo(() => {
    return Object.entries(report.categories).map(([categoryName, events]) => {
      const mappedEvents = events.map((ev) => {
        const onlineParticipants = ev.registrations?.online?.participants ?? [];
        const offlineParticipants =
          ev.registrations?.offline?.participants ?? [];
        const rankParticipants = ev.ranks?.participants ?? [];

        // ✅ Counts
        const onlineParticipationCount = onlineParticipants.length;
        const offlineParticipationCount = offlineParticipants.length;

        // ✅ Scores (sum individual participant points)
        const onlineParticipationScore = onlineParticipants.reduce(
          (sum, p) => sum + (p.points ?? 0),
          0
        );
        const offlineParticipationScore = offlineParticipants.reduce(
          (sum, p) => sum + (p.points ?? 0),
          0
        );
        const rankScore = rankParticipants.reduce(
          (sum, p) => sum + (p.points ?? 0),
          0
        );

        // ✅ Rounds counts
        const round1 = ev.rounds?.round_1_qualified ?? [];
        const round2 = ev.rounds?.round_2_qualified ?? [];
        const runnerUps = ev.rounds?.runner_ups ?? [];

        const round1Count = round1.length;
        const round2Count = round2.length;
        const runnerUpCount = runnerUps.length;

        // ✅ Rounds scores
        const round1Score = round1.reduce((sum, p) => sum + (p.points ?? 0), 0);
        const round2Score = round2.reduce((sum, p) => sum + (p.points ?? 0), 0);
        const runnerUpScore = runnerUps.reduce(
          (sum, p) => sum + (p.points ?? 0),
          0
        );

        return {
          eventName: ev.event_name,
          onlineParticipationCount,
          onlineParticipationScore,
          offlineParticipationCount,
          offlineParticipationScore,
          ranksAchieved: ev.ranks?.achieved ?? [],
          rankScore,
          round1Count,
          round1Score,
          round2Count,
          round2Score,
          runnerUpCount,
          runnerUpScore,
          totalScore: ev.total_event_score ?? 0,
        };
      });

      return {
        categoryName,
        totalScore: report.summary.category_totals[categoryName] ?? 0,
        events: mappedEvents,
      };
    });
  }, [report]);

  const totals = useMemo(() => {
    const totalEvents = scoringData.reduce(
      (sum, category) => sum + category.events.length,
      0
    );
    const totalParticipants = scoringData.reduce((sum, category) => {
      return (
        sum +
        category.events.reduce(
          (eventSum, e) =>
            eventSum +
            e.offlineParticipationCount +
            e.offlineParticipationCount,
          0
        )
      );
    }, 0);
    const totalAwards = scoringData.reduce((sum, category) => {
      return (
        sum +
        category.events.reduce(
          (eventSum, e) => eventSum + (e.ranksAchieved?.length ?? 0),
          0
        )
      );
    }, 0);
    return { totalEvents, totalParticipants, totalAwards };
  }, [scoringData]);

  const finalScore =
    report.summary?.final_score ??
    scoringData.reduce((sum, c) => sum + c.totalScore, 0) +
      (report.summary?.extra_activities_score ?? 0) -
      (report.summary?.negative_activities_score ?? 0);

  const exportPDF = (report: any) => {
    const doc = new jsPDF();

    // helper to safely get last table Y
    const getLastY = (fallback: number = 70) =>
      ((doc as any).lastAutoTable?.finalY ?? fallback) + 3;

    // --- Header ---
    doc.setFontSize(16);
    doc.text("CL Scoring Report", 14, 20);

    // CL info
    const summary = report.summary;
    doc.setFontSize(12);
    doc.text(`Final Score: ${summary.final_score}`, 14, 30);
    doc.text(`Extra Activities: ${summary.extra_activities_score}`, 14, 37);
    doc.text(
      `Negative Activities: ${summary.negative_activities_score}`,
      14,
      44
    );

    // --- Per Event ---
    Object.keys(report.categories).forEach((category, idx) => {
      doc.setFontSize(14);
      doc.text(`${category}`, 14, 60 + idx * 10);

      report.categories[category].forEach((event: any) => {
        autoTable(doc, {
          startY: getLastY(70),
          head: [
            [
              "Event",
              "Registrations (Online)",
              "Registrations (Offline)",
              "Round1",
              "Round2",
              "Winners",
              "Total Points",
            ],
          ],
          body: [
            [
              event.event_name,
              event.registrations.online.count,
              event.registrations.offline.count,
              event.rounds.round_1_qualified.length,
              event.rounds.round_2_qualified.length,
              event.ranks.participants.map((p: any) => p.name).join(", ") ||
                "-",
              event.total_event_score,
            ],
          ],
        });

        // --- Participants table ---
        if (
          event.registrations.online.participants.length > 0 ||
          event.registrations.offline.participants.length > 0
        ) {
          autoTable(doc, {
            startY: getLastY(),
            head: [["Name", "Email", "Mode", "Points"]],
            body: [
              ...event.registrations.online.participants.map((p: any) => [
                p.name,
                p.email,
                "Online",
                p.points,
              ]),
              ...event.registrations.offline.participants.map((p: any) => [
                p.name,
                p.email,
                "Offline",
                p.points,
              ]),
            ],
          });
        }

        // --- Winners & Rounds participants ---
        if (event.rounds.round_1_qualified.length > 0) {
          autoTable(doc, {
            startY: getLastY(),
            head: [["Round 1 Qualified"]],
            body: event.rounds.round_1_qualified.map((p: any) => [p.name]),
          });
        }
        if (event.rounds.round_2_qualified.length > 0) {
          autoTable(doc, {
            startY: getLastY(),
            head: [["Round 2 Qualified"]],
            body: event.rounds.round_2_qualified.map((p: any) => [p.name]),
          });
        }
        if (event.ranks.participants.length > 0) {
          autoTable(doc, {
            startY: getLastY(),
            head: [["Winner", "Rank", "Points"]],
            body: event.ranks.participants.map((p: any) => [
              p.name,
              p.rank,
              p.points,
            ]),
          });
        }
      });
    });

    // Save PDF
    doc.save("cl-scoring-report.pdf");
  };

  const getRankBadges = (ranks: string[]) => {
    if (!ranks || ranks.length === 0)
      return <span className="text-muted-foreground">-</span>;

    const rankConfig: Record<string, { color: string; label: string }> = {
      "1st": { color: "bg-yellow-500 text-white", label: "1st" },
      "2nd": { color: "bg-gray-400 text-white", label: "2nd" },
      "3rd": { color: "bg-amber-600 text-white", label: "3rd" },
    };

    return (
      <div className="flex flex-wrap gap-1">
        {ranks.map((rank, idx) => {
          // take last part after "_"
          const cleanRank = rank.split("_").pop() ?? rank;
          const cfg = rankConfig[cleanRank];

          if (!cfg) {
            // fallback if unknown (just show it raw)
            return (
              <Badge key={`${rank}-${idx}`} className="bg-muted text-xs">
                {cleanRank}
              </Badge>
            );
          }

          return (
            <Badge key={`${rank}-${idx}`} className={`${cfg.color} text-xs`}>
              <Trophy className="h-3 w-3 mr-1" aria-hidden="true" />
              {cfg.label}
            </Badge>
          );
        })}
      </div>
    );
  };

  const rawByCategory = useMemo(() => report.categories, [report]);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex gap-4 items-baseline">
            <h1 className="text-3xl font-bold text-balance">
              Horizon Tech Fest
            </h1>
            <h2 className="text-2xl font-semibold text-muted-foreground">
              2025
            </h2>
          </div>
          <p className="text-muted-foreground">
            Complete breakdown of participation and performance scores
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => exportPDF(report)}>
            <Download className="h-4 w-4 mr-2" aria-hidden="true" />
            Export Report
          </Button>
          <Button onClick={() => setActiveTab("final")}>
            <Eye className="h-4 w-4 mr-2" aria-hidden="true" />
            View Summary
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {finalScore.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">Total Score</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {totals.totalEvents}
            </div>
            <p className="text-sm text-muted-foreground">Total Events</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {totals.totalParticipants}
            </div>
            <p className="text-sm text-muted-foreground">Total Participants</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-emerald-600">
              {totals.totalAwards}
            </div>
            <p className="text-sm text-muted-foreground">Total Awards</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs - scrollable for many categories */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="w-full overflow-x-auto">
          <TabsList className="flex gap-2 w-max min-w-full mb-4 whitespace-nowrap">
            {scoringData.map((category, idx) => {
              const slug = category.categoryName
                .toLowerCase()
                .replace(/\s+/g, "-");
              return (
                <TabsTrigger
                  key={slug}
                  value={slug}
                  className="text-xs md:text-sm px-3 py-2"
                >
                  {category.categoryName}
                </TabsTrigger>
              );
            })}
            <TabsTrigger value="final" className="text-xs md:text-sm px-3 py-2">
              Final Score
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Category Tabs */}
        {scoringData.map((category) => {
          const slug = category.categoryName.toLowerCase().replace(/\s+/g, "-");
          const totalsRow = category.events.reduce(
            (acc, e) => {
              acc.onlineParticipationCount += e.onlineParticipationCount;
              acc.onlineParticipationScore += e.onlineParticipationScore;

              acc.round1Count += e.round1Count;
              acc.round1Score += e.round1Score;

              acc.round2Count += e.round2Count;
              acc.round2Score += e.round2Score;

              acc.runnerUpCount += e.runnerUpCount;
              acc.runnerUpScore += e.runnerUpScore;

              acc.rankAwards += e.ranksAchieved?.length ?? 0;
              acc.rankScore += e.rankScore;

              acc.offlineParticipationCount += e.offlineParticipationCount;
              acc.offlineParticipationScore += e.offlineParticipationScore;

              return acc;
            },
            {
              onlineParticipationCount: 0,
              onlineParticipationScore: 0,

              round1Count: 0,
              round1Score: 0,

              round2Count: 0,
              round2Score: 0,

              runnerUpCount: 0,
              runnerUpScore: 0,

              rankAwards: 0,
              rankScore: 0,

              offlineParticipationCount: 0,
              offlineParticipationScore: 0,
            }
          );

          const rawEvents = rawByCategory[category.categoryName] || [];

          return (
            <TabsContent key={slug} value={slug}>
              <Card>
                <CardHeader className="space-y-1">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold">
                      {category.categoryName}
                    </CardTitle>
                    <Badge
                      variant="secondary"
                      className="text-sm font-medium px-2.5 py-1 rounded-full"
                    >
                      {category.totalScore.toLocaleString()} pts
                    </Badge>
                  </div>
                  <CardDescription>
                    Detailed breakdown of all events in this category
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-border text-sm">
                      <thead className="bg-muted text-xs uppercase tracking-wide">
                        <tr className="border-b">
                          <th className="text-left p-3 font-medium">
                            Event Name
                          </th>

                          {/* Online */}
                          <th className="text-center p-3 font-medium">
                            Online Participants
                          </th>
                          <th className="text-center p-3 font-medium">
                            Online Score
                          </th>

                          {/* Ranks */}
                          <th className="text-center p-3 font-medium">
                            Ranks Achieved
                          </th>
                          <th className="text-center p-3 font-medium">
                            Rank Score
                          </th>

                          {/* Offline */}
                          <th className="text-center p-3 font-medium">
                            Offline Participants
                          </th>
                          <th className="text-center p-3 font-medium">
                            Offline Score
                          </th>

                          {/* Rounds (collapsed) */}
                          <th className="text-center p-3 font-medium">
                            Rounds
                          </th>

                          {/* Total */}
                          <th className="text-center p-3 font-medium">
                            Total Score
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {category.events.map((event, i) => {
                          // eslint-disable-next-line react-hooks/rules-of-hooks
                          const [expanded, setExpanded] = useState(false);

                          return (
                            <>
                              <tr
                                key={`${event.eventName}-${i}`}
                                className="border-b hover:bg-muted/50"
                              >
                                <td className="p-3 font-medium">
                                  {event.eventName}
                                </td>

                                {/* Online Participation */}
                                <td className="p-3 text-center">
                                  <div className="flex items-center justify-center gap-1">
                                    <Users
                                      className="h-4 w-4 text-blue-500"
                                      aria-hidden="true"
                                    />
                                    {event.onlineParticipationCount}
                                  </div>
                                </td>
                                <td className="p-3 text-center font-mono">
                                  <div className="flex items-center justify-center gap-1">
                                    <Activity
                                      className="h-4 w-4 text-green-500"
                                      aria-hidden="true"
                                    />
                                    {event.onlineParticipationScore}
                                  </div>
                                </td>

                                {/* Ranks */}
                                <td className="p-3 text-center">
                                  {getRankBadges(event.ranksAchieved)}
                                </td>
                                <td className="p-3 text-center font-mono">
                                  {event.rankScore}
                                </td>

                                {/* Offline Participation */}
                                <td className="p-3 text-center">
                                  <div className="flex items-center justify-center gap-1">
                                    <Users
                                      className="h-4 w-4 text-emerald-500"
                                      aria-hidden="true"
                                    />
                                    {event.offlineParticipationCount}
                                  </div>
                                </td>
                                <td className="p-3 text-center">
                                  <div className="flex items-center justify-center gap-1">
                                    <Activity
                                      className="h-4 w-4 text-emerald-500"
                                      aria-hidden="true"
                                    />
                                    {event.offlineParticipationScore}
                                  </div>
                                </td>

                                {/* Rounds */}
                                <td className="p-2 text-center">
                                  {event.round1Count > 0 ||
                                  event.round2Count > 0 ? (
                                    <button
                                      onClick={() => setExpanded(!expanded)}
                                      className="flex items-center justify-center gap-0.5 hover:underline"
                                    >
                                      {expanded ? (
                                        <ChevronDown className="h-3 w-3" />
                                      ) : (
                                        <ChevronRight className="h-3 w-3" />
                                      )}
                                      <Target className="h-3 w-3 text-purple-500" />
                                      {event.round1Count + event.round2Count}
                                      <span className="ml-1">
                                        ({event.round1Score + event.round2Score}
                                        )
                                      </span>
                                    </button>
                                  ) : (
                                    <span className="text-muted-foreground">
                                      -
                                    </span>
                                  )}
                                </td>

                                {/* Total */}
                                <td className="p-3 text-center">
                                  <Badge
                                    variant="secondary"
                                    className="font-mono"
                                  >
                                    {event.totalScore}
                                  </Badge>
                                </td>
                              </tr>

                              {/* Expandable Round Details */}
                              {expanded &&
                                (event.round1Count > 0 ||
                                  event.round2Count > 0) && (
                                  <tr className="bg-muted/40">
                                    <td colSpan={9} className="p-3">
                                      <div className="flex flex-wrap gap-6 text-sm">
                                        {event.round1Count > 0 && (
                                          <div className="flex items-center gap-2">
                                            <Target className="h-4 w-4 text-purple-500" />
                                            Round 1: {event.round1Count} (Score{" "}
                                            {event.round1Score})
                                          </div>
                                        )}
                                        {event.round2Count > 0 && (
                                          <div className="flex items-center gap-2">
                                            <Target className="h-4 w-4 text-indigo-500" />
                                            Round 2: {event.round2Count} (Score{" "}
                                            {event.round2Score})
                                          </div>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                )}
                            </>
                          );
                        })}

                        {/* Category Totals Row */}
                        <tr className="border-b-2 border-primary bg-primary/5">
                          <td className="p-3 font-bold">Category Total</td>
                          {/* Online */}
                          <td className="p-3 text-center font-bold">
                            {totalsRow.onlineParticipationCount}
                          </td>
                          <td className="p-3 text-center font-bold">
                            {totalsRow.onlineParticipationScore}
                          </td>
                          {/* Ranks */}
                          <td className="p-3 text-center font-bold">
                            {totalsRow.rankAwards} awards
                          </td>
                          <td className="p-3 text-center font-bold">
                            {totalsRow.rankScore}
                          </td>
                          {/* Offline */}
                          <td className="p-3 text-center font-bold">
                            {totalsRow.offlineParticipationCount}
                          </td>
                          <td className="p-3 text-center font-bold">
                            {totalsRow.offlineParticipationScore}
                          </td>
                          <td className="p-3 text-center font-bold font-mono">
                            {totalsRow.round1Count +
                              totalsRow.round2Count +
                              totalsRow.runnerUpCount}{" "}
                            (
                            {totalsRow.round1Score +
                              totalsRow.round2Score +
                              totalsRow.runnerUpScore}
                            )
                          </td>

                          {/* Total */}
                          <td className="p-3 text-center">
                            <Badge className="font-mono text-lg px-3 py-1">
                              {category.totalScore.toLocaleString()}
                            </Badge>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>

                <CardContent className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">
                    Participation & Rounds Details
                  </h3>
                  <Accordion type="single" collapsible className="w-full">
                    {rawEvents.map((ev, i) => (
                      <AccordionItem
                        key={`${ev.event_name}-${i}`}
                        value={`${ev.event_name}-${i}`}
                      >
                        <AccordionTrigger className="text-left">
                          <div className="flex items-center justify-between w-full">
                            <span className="font-medium">{ev.event_name}</span>
                            <span className="text-sm text-muted-foreground">
                              Reg:{" "}
                              {(ev.registrations?.online?.count ?? 0) +
                                (ev.registrations?.offline?.count ?? 0)}{" "}
                              • Rounds:{" "}
                              {(ev.rounds?.round_1_qualified?.length ?? 0) +
                                (ev.rounds?.round_2_qualified?.length ?? 0) +
                                (ev.rounds?.runner_ups?.length ?? 0)}{" "}
                              • Ranks: {ev.ranks?.participants?.length ?? 0}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          {/* Two-panel layout */}
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {/* Left: Registrations table */}
                            <Card className="p-0 lg:col-span-1">
                              <div className="px-4 pt-4 pb-3">
                                <CardTitle className="text-base">
                                  Registrations
                                </CardTitle>
                                <CardDescription>
                                  All participants with type and points
                                </CardDescription>
                              </div>
                              <div className="border-t" />
                              <div className="overflow-y-auto overflow-x-hidden max-h-60">
                                <table className="w-full text-sm table-fixed">
                                  <thead className="sticky z-10 top-0 bg-background">
                                    <tr>
                                      <th className="px-4 py-2 font-medium w-1/3 text-left">
                                        Participant
                                      </th>
                                      <th className="px-4 py-2 font-medium w-1/4 text-center">
                                        Type
                                      </th>
                                      <th className="px-4 py-2 font-medium w-1/4 text-center">
                                        Points
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {[
                                      ...(
                                        ev.registrations?.online
                                          ?.participants ?? []
                                      ).map((p) => ({
                                        ...p,
                                        __type: "online" as const,
                                      })),
                                      ...(
                                        ev.registrations?.offline
                                          ?.participants ?? []
                                      ).map((p) => ({
                                        ...p,
                                        __type: "offline" as const,
                                      })),
                                    ].map((p) => (
                                      <tr key={p.id} className="border-t">
                                        <td className="px-4 py-3">
                                          <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                              {p.avatar ? (
                                                <AvatarImage
                                                  src={p.avatar}
                                                  alt={p.name}
                                                />
                                              ) : null}
                                              <AvatarFallback>
                                                {getInitials(p.name)}
                                              </AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0">
                                              <div className="font-medium leading-5 truncate">
                                                {p.name}
                                              </div>
                                              <div className="text-muted-foreground text-xs truncate">
                                                {p.email ?? "—"}
                                              </div>
                                            </div>
                                          </div>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                          <Badge
                                            variant="outline"
                                            className={
                                              p.__type === "online"
                                                ? "border-blue-300"
                                                : "border-emerald-300"
                                            }
                                          >
                                            {p.__type}
                                          </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-center font-medium">
                                          {p.points ?? "—"}
                                        </td>
                                      </tr>
                                    ))}
                                    {(ev.registrations?.online?.participants
                                      ?.length ?? 0) +
                                      (ev.registrations?.offline?.participants
                                        ?.length ?? 0) ===
                                      0 && (
                                      <tr>
                                        <td
                                          className="px-4 py-6 text-muted-foreground text-center"
                                          colSpan={3}
                                        >
                                          No registrations
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </Card>

                            {/* Right: Rounds table */}
                            <Card className="p-0 lg:col-span-2">
                              <div className="px-4 pt-4 pb-3">
                                <CardTitle className="text-base">
                                  Rounds
                                </CardTitle>
                                <CardDescription>
                                  Round entries including runner-ups
                                </CardDescription>
                              </div>
                              <div className="border-t" />
                              <div className="overflow-y-auto max-h-60">
                                <table className="w-full text-sm">
                                  <thead className="sticky z-10 top-0 bg-background">
                                    <tr className="text-left">
                                      <th className="px-4 py-2 font-medium">
                                        Round
                                      </th>
                                      <th className="px-4 py-2 font-medium">
                                        Participant
                                      </th>
                                      <th className="px-4 py-2 font-medium text-right">
                                        Points
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {[
                                      ...(
                                        ev.rounds?.round_1_qualified ?? []
                                      ).map((p) => ({
                                        ...p,
                                        __round: "Round 1",
                                      })),
                                      ...(
                                        ev.rounds?.round_2_qualified ?? []
                                      ).map((p) => ({
                                        ...p,
                                        __round: "Round 2",
                                      })),
                                      ...(ev.rounds?.runner_ups ?? []).map(
                                        (p) => ({ ...p, __round: "Runner-up" })
                                      ),
                                    ].map((row, idx) => (
                                      <tr
                                        key={`${row.id}-${idx}`}
                                        className="border-t"
                                      >
                                        <td className="px-4 py-3">
                                          <div className="inline-flex items-center gap-2">
                                            <span className="font-medium">
                                              {row.__round}
                                            </span>
                                            {row.__round === "Runner-up" ? (
                                              <Badge
                                                variant="secondary"
                                                className="text-xs"
                                              >
                                                Runner-up
                                              </Badge>
                                            ) : null}
                                          </div>
                                        </td>
                                        <td className="px-4 py-3">
                                          <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                              {row.avatar ? (
                                                <AvatarImage
                                                  src={row.avatar}
                                                  alt={row.name}
                                                />
                                              ) : null}
                                              <AvatarFallback>
                                                {getInitials(row.name)}
                                              </AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0">
                                              <div className="font-medium leading-5 truncate">
                                                {row.name}
                                              </div>
                                              <div className="text-muted-foreground text-xs truncate">
                                                {
                                                  // try to find email from registrations if missing
                                                  (
                                                    ev.registrations?.online
                                                      ?.participants ?? []
                                                  )
                                                    .concat(
                                                      ev.registrations?.offline
                                                        ?.participants ?? []
                                                    )
                                                    .find(
                                                      (x) => x.id === row.id
                                                    )?.email ?? "—"
                                                }
                                              </div>
                                            </div>
                                          </div>
                                        </td>
                                        <td className="px-4 py-3 text-right font-medium">
                                          {row.points ?? "—"}
                                        </td>
                                      </tr>
                                    ))}
                                    {(ev.rounds?.round_1_qualified?.length ??
                                      0) +
                                      (ev.rounds?.round_2_qualified?.length ??
                                        0) +
                                      (ev.rounds?.runner_ups?.length ?? 0) ===
                                      0 && (
                                      <tr>
                                        <td
                                          className="px-4 py-6 text-muted-foreground"
                                          colSpan={3}
                                        >
                                          No round data
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </Card>
                          </div>

                          {/* Bottom: Ranks table */}
                          <Card className="p-0 mt-4">
                            <div className="px-4 pt-4 pb-3">
                              <CardTitle className="text-base">
                                Final Ranks
                              </CardTitle>
                              <CardDescription>
                                Winners and bonus points
                              </CardDescription>
                            </div>
                            <div className="border-t" />
                            <div className="overflowy-y-auto max-h-60">
                              <table className="w-full text-sm">
                                <thead className="sticky z-10 top-0 bg-background">
                                  <tr className="text-left">
                                    <th className="px-4 py-2 font-medium">
                                      Rank
                                    </th>
                                    <th className="px-4 py-2 font-medium">
                                      Participant
                                    </th>
                                    <th className="px-4 py-2 font-medium text-right">
                                      Points
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {(ev.ranks?.participants ?? []).map((p) => (
                                    <tr key={`rk-${p.id}`} className="border-t">
                                      <td className="px-4 py-3">
                                        {getRankBadges([p.rank])}
                                      </td>
                                      <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                          <Avatar className="h-7 w-7">
                                            {p.avatar ? (
                                              <AvatarImage
                                                src={p.avatar}
                                                alt={p.name}
                                              />
                                            ) : null}
                                            <AvatarFallback>
                                              {getInitials(p.name)}
                                            </AvatarFallback>
                                          </Avatar>
                                          <div className="min-w-0">
                                            <div className="font-medium leading-5 truncate">
                                              {p.name}
                                            </div>
                                            <div className="text-muted-foreground text-xs truncate">
                                              {p.email ?? "—"}
                                            </div>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="px-4 py-3 text-right font-medium">
                                        {p.points ?? ev.ranks?.bonus ?? 0}
                                      </td>
                                    </tr>
                                  ))}
                                  {(ev.ranks?.participants ?? []).length ===
                                    0 && (
                                    <tr>
                                      <td
                                        className="px-4 py-6 text-muted-foreground"
                                        colSpan={3}
                                      >
                                        No rank data
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </Card>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}

        {/* Final Score Tab */}
        <TabsContent value="final">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Category-wise Score Summary</CardTitle>
                <CardDescription>
                  Total scores achieved in each category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scoringData.map((category) => (
                    <div
                      key={category.categoryName}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium">{category.categoryName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {category.events.length} events •{" "}
                          {category.events.reduce(
                            (sum, e) =>
                              sum +
                              e.onlineParticipationCount +
                              e.offlineParticipationCount,
                            0
                          )}{" "}
                          participants
                        </p>
                      </div>
                      <Badge variant="outline" className="text-lg px-4 py-2">
                        {category.totalScore.toLocaleString()} pts
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">
                  🏆 Final Score Calculation
                </CardTitle>
                <CardDescription>
                  Complete breakdown of total achievement
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-background rounded-lg">
                    <div className="text-lg font-medium">
                      Category Events Total
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      {scoringData
                        .reduce((sum, c) => sum + c.totalScore, 0)
                        .toLocaleString()}
                    </div>
                  </div>

                  <div className="p-4 bg-background rounded-lg">
                    <div className="text-lg font-medium">
                      Additional Activities
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      +
                      {(
                        report.summary?.extra_activities_score ?? 0
                      ).toLocaleString()}
                    </div>
                  </div>

                  <div className="p-4 bg-background rounded-lg">
                    <div className="text-lg font-medium">
                      Negative Activities
                    </div>
                    <div className="text-2xl font-bold text-red-600">
                      {(
                        report.summary?.negative_activities_score ?? 0
                      ).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="text-center pt-4 border-t">
                  <div className="text-lg font-medium mb-2">
                    🎉 GRAND TOTAL SCORE
                  </div>
                  <div className="text-4xl font-bold text-primary mb-2">
                    {finalScore.toLocaleString()} POINTS
                  </div>
                  <p className="text-muted-foreground">
                    Outstanding performance across all categories of Horizon
                    Tech Fest 2025!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default CLDashboard;
