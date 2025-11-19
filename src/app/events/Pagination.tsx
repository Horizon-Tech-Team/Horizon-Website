"use client";

import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";

interface PaginationProps {
  total: number;
  limit: number;
  offset: number;
}

export function Pagination({ total, limit, offset }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);

  const goToPage = (page: number) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("offset", String((page - 1) * limit));
    router.push(`/events?${newParams.toString()}`);
  };

  return (
    <div className="flex justify-center mt-8">
      <div className="flex gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "outline"}
            size="sm"
            className="px-3"
            onClick={() => goToPage(page)}
          >
            {page}
          </Button>
        ))}

        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
