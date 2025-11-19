"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { LoginSchema } from "@/lib/validation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/app/actions/actions";
import { useAuth } from "@/app/AuthProvider";
import { toast } from "sonner";
import Link from "next/link";
import LoadingLogo from "@/components/loading-logo";

type Inputs = z.infer<typeof LoginSchema>;

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { refreshUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(LoginSchema),
  });

  const processForm: SubmitHandler<Inputs> = async (data) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    if (isSubmitting) return;
    setIsSubmitting(true);

    const result = await loginAction(formData);

    if (result?.errors) {
      toast.error(
        result.errors.general ||
          "Invalid credentials. Please check and try again."
      );
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    toast.success("Login successful!");
    await refreshUser();
    router.push("/");
  };

  return (
    <section className="flex items-center justify-center px-4">
      {isSubmitting ? (
        <LoadingLogo />
      ) : (
        <form
          onSubmit={handleSubmit((data) => {
            processForm(data); // Call the updated function directly
          })}
          className="w-full max-w-md space-y-8"
        >
          <motion.div
            initial={{ x: "50%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="grid grid-cols-1 gap-y-8">
              {/* Email */}
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register("email")}
                />
                {errors.email?.message && (
                  <p className="mt-2 text-sm text-red-400">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col space-y-1">
                {/* Password */}
                <div className="relative">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    {...register("password")}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-2 top-9 text-gray-500 hover:text-gray-800"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOffIcon size={18} />
                    ) : (
                      <EyeIcon size={18} />
                    )}
                  </button>

                  {errors.password?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <Link
                      href="/forgot-password"
                      className="text-blue-600 hover:text-blue-500 font-medium"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full primary-btn disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Logging in..." : "Submit"}{" "}
          </button>
        </form>
      )}
    </section>
  );
}
