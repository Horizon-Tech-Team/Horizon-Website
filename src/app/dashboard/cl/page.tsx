import { getDashboardOfCL } from "@/app/actions/actions";
import CLDashboard from "./Dashboard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type PageProps = {
  searchParams: Promise<{ cl_id?: string }>;
};

const Page = async ({ searchParams }: PageProps) => {
  // ✅ Await the whole searchParams
  const { cl_id } = await searchParams;

  // ✅ pass cl_id to backend
  const res = await getDashboardOfCL(cl_id);

  if (!res.success) {
    let message = "Failed to load dashboard data. Please try again later.";

    // ✅ Check for specific error codes
    if (res.errorCode === "feature_disabled") {
      message =
        "This page is currently disabled. Please contact the administrator.";
    }

    return (
      <div className="container max-w-7xl py-8 mx-auto">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl py-8 mx-auto">
      <CLDashboard report={res.data} />
    </div>
  );
};

export default Page;
