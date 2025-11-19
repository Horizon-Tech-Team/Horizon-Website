"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ChangePasswordSchema } from "@/lib/validation";
import { changePasswordAction } from "../actions/actions";

type Inputs = z.infer<typeof ChangePasswordSchema>;

export default function ChangePasswordDialog() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(ChangePasswordSchema),
  });

  const processForm: SubmitHandler<Inputs> = async (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setErrorMessage("");

    const formData = new FormData();
    formData.append("current_password", data.current_password);
    formData.append("new_password", data.new_password);
    formData.append("confirm_new_password", data.confirm_new_password);

    const result = await changePasswordAction(formData);

    if (result?.error) {
      setErrorMessage(result.error);
      toast.error(result.error);
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    toast.success("Password changed successfully.");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Change Password
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Your Password</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(processForm)} className="space-y-6">
          {errorMessage && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {/* Current Password */}
          <div className="space-y-2">
            <Label htmlFor="current_password">Current Password</Label>
            <div className="relative">
              <Input
                id="current_password"
                type={showPassword ? "text" : "password"}
                {...register("current_password")}
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
            {errors.current_password && (
              <p className="text-sm text-red-500">
                {errors.current_password.message}
              </p>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="new_password">New Password</Label>
            <div className="relative">
              <Input
                id="new_password"
                type={showNewPassword ? "text" : "password"}
                {...register("new_password")}
                disabled={isSubmitting}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowNewPassword(!showNewPassword)}
                tabIndex={-1}
              >
                {showNewPassword ? "Hide" : "Show"}
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

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Changing..." : "Change Password"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
