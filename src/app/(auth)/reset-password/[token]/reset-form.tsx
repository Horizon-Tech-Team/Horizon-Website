"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordSchema } from "@/lib/validation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Lock } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import LoadingLogo from "@/components/loading-logo";
import { resetPassword } from "@/app/actions/actions";

type Inputs = z.infer<typeof ResetPasswordSchema>;

interface ResetPasswordFormProps {
  token: string;
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(ResetPasswordSchema),
  });

  const processForm: SubmitHandler<Inputs> = async (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setErrorMessage("");

    const formData = new FormData();
    formData.append("new_password", data.new_password);
    formData.append("confirm_new_password", data.confirm_new_password);

    const result = await resetPassword(token, formData);

    if (result?.error) {
      let fullError = result.error;

      if (result.resolution) {
        fullError += ` — ${result.resolution}`;
      }

      setErrorMessage(fullError);
      toast.error(fullError);
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    setIsSuccess(true);
    toast.success("Password reset successful! Redirecting to login...");
    setTimeout(() => router.push("/login"), 3000);
  };

  return (
    <div className="min-h-screen flex items-start justify-center px-4 pt-24">
      {isSuccess ? (
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <Lock className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-semibold">Password Reset Successful</h2>
          <p className="text-muted-foreground">
            Your password has been updated. Redirecting to login...
          </p>
        </div>
      ) : isSubmitting ? (
        <LoadingLogo />
      ) : (
        <form
          onSubmit={handleSubmit(processForm)}
          className="w-full max-w-md space-y-8"
        >
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold">Reset Your Password</h2>
              <p className="text-muted-foreground text-sm">
                Enter and confirm your new password below.
              </p>
            </div>

            {errorMessage && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="new_password">New Password</Label>
              <div className="relative">
                <Input
                  id="new_password"
                  type={showPassword ? "text" : "password"}
                  {...register("new_password")}
                  disabled={isSubmitting}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? "Hide" : "Show"}
                </Button>
              </div>
              {errors.new_password && (
                <p className="text-sm text-red-500">
                  {errors.new_password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirm_new_password">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirm_new_password"
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirm_new_password")}
                  disabled={isSubmitting}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </Button>
              </div>
              {errors.confirm_new_password && (
                <p className="text-sm text-red-500">
                  {errors.confirm_new_password.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
