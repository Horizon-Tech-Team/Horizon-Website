"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Crown, StarsIcon } from "lucide-react";

type LeaderboardEntry = {
  id: string;
  cl_name: string;
  college_name: string;
  event_alias?: string;
  points: number;
  avatar_url?: string;
  rank: number;
};

type LeaderboardProps = {
  data: LeaderboardEntry[];
  title?: string;
  subtitle?: string;
};

function getInitials(name: string) {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "CL";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0] + parts[parts.length - 1]![0]).toUpperCase();
}

export function Leaderboard({
  data,
  title = "Leaderboard",
  subtitle = "Top College Leader Rankings",
}: LeaderboardProps) {
  const formatPoints = (points: number) => points.toLocaleString();

  const topThree = data.slice(0, 3);

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12">
        <div className="inline-flex items-center justify-center w-10 h-10 bg-primary rounded-full mx-auto mb-2">
          <StarsIcon className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          {title}
        </h1>
        <p className="text-muted-foreground text-sm sm:text-lg">{subtitle}</p>
      </div>

      {/* Top 3 Podium */}
      {topThree.length > 0 && (
        <div className="flex flex-col md:flex-row items-end justify-center gap-4 mb-8 sm:mb-12 px-2 sm:px-4">
          {topThree.map((cl) => {
            const isFirst = cl.rank === 1;
            const isSecond = cl.rank === 2;

            // Use order to place the first in center
            const orderClass = isFirst
              ? "md:order-2"
              : isSecond
              ? "md:order-1"
              : "md:order-3";

            return (
              <div
                key={cl.id}
                className={`flex flex-col items-center space-y-2 ${orderClass} w-full md:w-[300px]`}
              >
                {/* Profile Card */}
                <Card
                  className={`w-full border-0 shadow-lg relative ${
                    isFirst
                      ? "bg-gradient-to-br from-yellow-700/30 to-yellow-600/20 shadow-xl"
                      : isSecond
                      ? "bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/30 dark:to-slate-800/20"
                      : "bg-gradient-to-br from-amber-50 to-amber-100/70 dark:from-amber-900/30 dark:to-amber-800/20"
                  }`}
                >
                  <CardContent className="p-3 sm:p-4 text-center">
                    {/* Crown */}
                    <div className="mb-1 sm:mb-2">
                      <div
                        className={`inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full mb-1 ${
                          isFirst
                            ? "bg-yellow-500"
                            : isSecond
                            ? "bg-slate-500"
                            : "bg-amber-500"
                        }`}
                      >
                        <Crown className="h-3 w-3 sm:h-4 sm:w-4 text-white fill-white" />
                      </div>
                    </div>

                    {/* Rank Badge */}
                    <div
                      className={`absolute top-2 right-2 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        isFirst
                          ? "bg-yellow-500 text-white"
                          : isSecond
                          ? "bg-slate-600 text-white"
                          : "bg-amber-600 text-white"
                      }`}
                    >
                      #{cl.rank}
                    </div>

                    {/* Avatar */}
                    <Avatar
                      className={`mx-auto mb-1 sm:mb-2 border-2 border-white shadow-md ${
                        isFirst
                          ? "h-14 w-14 sm:h-16 sm:w-16"
                          : "h-12 w-12 sm:h-14 sm:w-14"
                      }`}
                    >
                      <AvatarImage
                        src={cl.avatar_url || undefined}
                        alt={cl.cl_name}
                      />
                      <AvatarFallback
                        className={`text-xs sm:text-sm font-bold ${
                          isFirst
                            ? "bg-yellow-500 text-white"
                            : isSecond
                            ? "bg-slate-600 text-white"
                            : "bg-amber-600 text-white"
                        }`}
                      >
                        {getInitials(cl.cl_name)}
                      </AvatarFallback>
                    </Avatar>

                    {/* Name */}
                    <h3
                      className={`font-bold mb-1 text-foreground truncate text-sm sm:text-base ${
                        isFirst ? "sm:text-lg" : ""
                      }`}
                    >
                      {cl.cl_name}
                    </h3>

                    {/* College */}
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1 line-clamp-2">
                      {cl.college_name}
                    </p>

                    {/* Event Alias */}
                    {cl.event_alias && (
                      <Badge
                        variant="secondary"
                        className="mb-1 text-xs sm:text-sm"
                      >
                        {cl.event_alias}
                      </Badge>
                    )}

                    {/* Points */}
                    <div
                      className={`font-bold mt-1 sm:mt-2 ${
                        isFirst
                          ? "text-xl sm:text-2xl text-yellow-600"
                          : isSecond
                          ? "text-lg sm:text-xl text-slate-500"
                          : "text-lg sm:text-xl text-amber-700"
                      }`}
                    >
                      {formatPoints(cl.points)}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      points
                    </p>
                  </CardContent>
                </Card>

                {/* Podium Stand */}
                <div
                  className={`w-full flex-none rounded-t-xl relative overflow-hidden ${
                    isFirst
                      ? "h-12 sm:h-16 bg-gradient-to-t from-yellow-500 to-yellow-400"
                      : isSecond
                      ? "h-10 sm:h-12 bg-gradient-to-t from-slate-400 to-slate-300"
                      : "h-8 sm:h-10 bg-gradient-to-t from-amber-600 to-amber-500"
                  }`}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className={`font-bold text-white text-xs sm:text-base`}
                    >
                      {cl.rank === 1 ? "1st" : cl.rank === 2 ? "2nd" : "3rd"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full Rankings List */}
      <div className="space-y-3 px-2 sm:px-4">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
          <span className="bg-primary/10 p-2 rounded-lg">
            <StarsIcon className="h-5 w-5 text-primary" />
          </span>
          Complete Rankings
        </h2>

        {data.length > 0 ? (
          data.map((cl) => {
            const isTopThree = cl.rank <= 3;

            return (
              <Card
                key={cl.id}
                className={`hover:shadow-md transition-all duration-200 
            ${isTopThree ? "border-l-4" : "border-l-2"} 
            ${
              cl.rank === 1
                ? "border-l-yellow-500 hover:border-l-yellow-600"
                : cl.rank === 2
                ? "border-l-slate-500 hover:border-l-slate-600"
                : cl.rank === 3
                ? "border-l-amber-500 hover:border-l-amber-600"
                : "border-l-primary/20 hover:border-l-primary"
            }`}
              >
                <CardContent className="p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                    <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto flex-1 min-w-0">
                      {/* Rank */}
                      <div
                        className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm
                    ${
                      cl.rank === 1
                        ? "bg-yellow-500 text-white shadow-md"
                        : cl.rank === 2
                        ? "bg-slate-500 text-white shadow-md"
                        : cl.rank === 3
                        ? "bg-amber-600 text-white shadow-md"
                        : "bg-muted text-muted-foreground"
                    }`}
                      >
                        {cl.rank}
                      </div>

                      {/* Avatar */}
                      <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-background shadow-sm">
                        <AvatarImage
                          src={cl.avatar_url || undefined}
                          alt={cl.cl_name}
                        />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs sm:text-sm">
                          {getInitials(cl.cl_name)}
                        </AvatarFallback>
                      </Avatar>

                      {/* Details */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1 sm:gap-2 mb-1">
                          <h3 className="font-semibold text-foreground truncate text-sm sm:text-base">
                            {cl.cl_name}
                          </h3>
                          {isTopThree && (
                            <div className="flex items-center">
                              {cl.rank === 1 && (
                                <Crown className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-600 fill-yellow-200" />
                              )}
                              {cl.rank === 2 && (
                                <Crown className="h-3 w-3 sm:h-4 sm:w-4 text-slate-600 fill-slate-200" />
                              )}
                              {cl.rank === 3 && (
                                <Crown className="h-3 w-3 sm:h-4 sm:w-4 text-amber-600 fill-amber-200" />
                              )}
                            </div>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">
                          {cl.college_name}
                        </p>
                        {cl.event_alias && (
                          <Badge
                            variant="outline"
                            className="mt-1 text-xs sm:text-sm"
                          >
                            {cl.event_alias}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Points */}
                    <div className="flex-shrink-0 mt-2 sm:mt-0 flex items-center gap-1">
                      <span
                        className={`font-bold text-sm md:text-lg sm:text-xl leading-none ${
                          cl.rank === 1
                            ? "text-yellow-600"
                            : cl.rank === 2
                            ? "text-slate-600"
                            : cl.rank === 3
                            ? "text-amber-600"
                            : "text-foreground"
                        }`}
                      >
                        {formatPoints(cl.points)}
                      </span>
                      <span className="text-xs sm:text-sm text-muted-foreground leading-none">
                        points
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">
                No leaderboard data available.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Footer */}
      <div className="text-center mt-8 sm:mt-10 pt-4 sm:pt-6 border-t border-border px-2 sm:px-4">
        <p className="text-muted-foreground text-xs sm:text-sm">
          Rankings updated in real-time • Showing {data.length} College Leaders
        </p>
      </div>
    </div>
  );
}
