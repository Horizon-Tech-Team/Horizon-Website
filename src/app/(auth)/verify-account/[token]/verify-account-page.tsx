"use client";

import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import LoadingLogo from "@/components/loading-logo";
import { verifyAccountAction } from "@/app/actions/actions";

interface VerifyAccountPageProps {
  token: string;
}

export default function VerifyAccountPage({ token }: VerifyAccountPageProps) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      setIsLoading(true);
      setErrorMessage("");

      const result = await verifyAccountAction(token);

      if (result?.error) {
        setErrorMessage(result.error);
      } else {
        setIsSuccess(true);
      }

      setIsLoading(false);
    };

    verify();
  }, [token]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-start justify-center px-4 pt-24">
        <LoadingLogo text="Verifying your account..." />
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-start justify-center px-4 pt-24">
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-semibold">Account Verified</h2>
          <p className="text-muted-foreground">
            Your email has been successfully verified.
          </p>
          <Button onClick={() => router.push("/login")} className="w-full">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-start justify-center px-4 pt-24">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
          <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
        <h2 className="text-2xl font-semibold">Verification Failed</h2>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {errorMessage || "Something went wrong"}
          </AlertDescription>
        </Alert>
        <Button
          onClick={() => router.push("/login")}
          className="w-full"
        >
          Resend Verification Link
        </Button>
      </div>
    </div>
  );
}
