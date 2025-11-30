"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, Search } from "lucide-react";
import { useState } from "react";

export function EventsFilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(
    searchParams.get("category") || "all"
  );

  const updateURLParams = (q: string, category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("q", q);
    params.set("category", category);
    params.set("offset", "0"); // reset pagination on search/filter
    router.push(`/events?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 md:mb-8">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search events..."
          className="pl-9"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            updateURLParams(e.target.value, category);
          }}
        />
      </div>
      <div className="flex gap-2">
        <Select
          defaultValue={category}
          onValueChange={(value) => {
            setCategory(value);
            updateURLParams(query, value);
          }}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="TECH-SPOTLIGHT">Tech Spotlight</SelectItem>
            <SelectItem value="TECHNICAL EVENTS">Technical Events</SelectItem>
            <SelectItem value="ANALYTICAL EVENTS">Analytical Events</SelectItem>
            <SelectItem value="VERBAL EVENTS">Verbal Events</SelectItem>
            <SelectItem value="CREATIVE EVENTS">Creative Events</SelectItem>
            <SelectItem value="FUN EVENTS">Fun Events</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline">Filters</span>
        </Button>
      </div>
    </div>
  );
}
