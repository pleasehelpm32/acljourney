import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatDateForUrl } from "@/utils/date";

interface NavigationButtonsProps {
  date: string;
  prevDay: string;
  nextDay: string;
}

export function NavigationButtons({
  date,
  prevDay,
  nextDay,
}: NavigationButtonsProps) {
  return (
    <div className="flex items-center gap-2 w-full sm:w-auto">
      <Link href={`/journal/${prevDay}`} className="flex-1 sm:flex-none">
        <Button
          variant="outline"
          size="sm"
          className="w-full sm:w-auto gap-1 text-black hover:bg-silver_c hover:text-black border-silver_c/20"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
          <span className="sm:hidden">Prev</span>
        </Button>
      </Link>

      {new Date(date) < new Date(formatDateForUrl(new Date())) && (
        <Link href={`/journal/${nextDay}`} className="flex-1 sm:flex-none">
          <Button
            variant="outline"
            size="sm"
            className="w-full sm:w-auto gap-1 text-black hover:bg-silver_c hover:text-black border-silver_c/20"
          >
            <span className="hidden sm:inline">Next</span>
            <span className="sm:hidden">Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      )}
    </div>
  );
}
