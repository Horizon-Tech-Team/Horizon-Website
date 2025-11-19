import { getLeaderboard } from "../actions/actions";
import { Leaderboard } from "./Board";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default async function LeaderboardPage() {
  const res = await getLeaderboard();

  if (!res.success) {
    let message = "Failed to load leaderboard. Please try again later.";

    // ✅ Handle feature disabled specifically
    if (res.errorCode === "feature_disabled") {
      message =
        "The leaderboard is currently disabled. Please contact the administrator.";
    }

    return (
      <div className="container max-w-7xl mx-auto py-6 md:px-4">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto py-6 md:px-4">
      <Leaderboard
        data={res.data}
        title="Contingent Leader Leaderboard"
        subtitle="Top performing Contingent Leaders across all events"
      />
    </div>
  );
}
