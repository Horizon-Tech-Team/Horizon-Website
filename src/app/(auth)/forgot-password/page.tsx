"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordRequestSchema } from "@/lib/validation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Mail, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import LoadingLogo from "@/components/loading-logo";
import { resetPasswordRequest } from "@/app/actions/actions";
type Inputs = z.infer<typeof PasswordRequestSchema>;

export default function EmailRequestForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(PasswordRequestSchema),
  });

  const processForm: SubmitHandler<Inputs> = async (data) => {
    const formData = new FormData();
    formData.append("email", data.email);
    if (isSubmitting) return;
    setIsSubmitting(true);
    setErrorMessage("");

    const result = await resetPasswordRequest(formData);

    if (result?.error) {
      setErrorMessage(result.error);
      toast.error(result.error);
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    setIsSuccess(true);
    toast.success("Reset link sent! Check your email.");
  };

  return (
    <div className="min-h-screen flex items-start justify-center px-4 pt-24">
      {isSuccess ? (
        // ✅ Wrap success message in a centered container
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-semibold">Check Your Email</h2>
          <p className="text-muted-foreground">
            We&apos;ve sent a password reset link. Please check your inbox and
            follow the instructions.
          </p>
          <Button
            onClick={() => setIsSuccess(false)}
            variant="outline"
            className="w-full"
          >
            Try a Different Email
          </Button>
          <Link href="/login">
            <Button variant="ghost" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          </Link>
        </div>
      ) : isSubmitting ? (
        <LoadingLogo />
      ) : (
        // ✅ Center the form
        <form
          onSubmit={handleSubmit(processForm)}
          className="w-full max-w-md space-y-8"
        >
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold">Forgot Password</h2>
              <p className="text-muted-foreground text-sm">
                Enter your email address and we’ll send you a password reset
                link.
              </p>
            </div>

            {errorMessage && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                {...register("email")}
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              <Mail className="mr-2 h-4 w-4" />
              Send Reset Link
            </Button>

            <Link href="/login">
              <Button variant="ghost" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Button>
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
