/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { CLRegisterSchema, RegisterSchema } from "@/lib/validation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Branch,
  BRANCHES,
  College,
  COLLEGES,
  YEARS_OF_STUDY,
} from "@/lib/constant";
import { getYearLabel } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { signupAction } from "@/app/actions/actions";
import { toast } from "sonner";

const steps = [
  {
    id: "Step 1",
    name: "Essential Information",
    fields: ["firstName", "lastName", "email", "password", "cl_code"],
  },
  {
    id: "Step 2",
    name: "Personal Information",
    fields: ["gender", "phone", "college_name", "branch", "year_of_study"],
  },
  {
    id: "Step 3",
    name: "Complete",
    fields: [],
  },
];

type Mode = "student" | "contingent_leader";

type RegisterFormProps = {
  type?: Mode;
};

export default function RegisterForm({ type = "student" }: RegisterFormProps) {
  const [previousStep, setPreviousStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const delta = currentStep - previousStep;

  // Choose schema and types based on mode
  const schema =
    type === "contingent_leader" ? CLRegisterSchema : RegisterSchema;
  type Inputs = typeof schema extends z.ZodTypeAny
    ? z.infer<typeof schema>
    : never;

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const processForm: SubmitHandler<Inputs> = async (data) => {
    try {
      const formData = new FormData();

      for (const [key, value] of Object.entries(data)) {
        formData.append(key, value === undefined ? "" : String(value));
      }

      const result = await signupAction(formData, type);

      console.log(result);

      if (result?.errors) {
        toast.error(
          result.errors.general || "Please check your input and try again."
        );
        return;
      }

      const successMessage =
        type === "student"
          ? "Student registration successful!"
          : "Contingent Leader registration successful!";

      toast.success(successMessage);

      router.push("/login");
    } catch (error: any) {
      const errorMessage =
        type === "student"
          ? "Student registration failed. Please try again."
          : "Contingent Leader registration failed. Please try again.";

      toast.error(error?.message || errorMessage);
    }
  };

  const next = async () => {
    const fields = steps[currentStep].fields;
    // Ensure all field names are strings
    const output = await trigger(
      fields.filter((f) => typeof f === "string") as string[],
      { shouldFocus: true }
    );

    if (!output) return;

    if (currentStep < steps.length - 1) {
      if (currentStep === steps.length - 2) {
        await handleSubmit(processForm)();
      }
      setPreviousStep(currentStep);
      setCurrentStep((step) => step + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step - 1);
    }
  };

  // Helper to safely render error messages
  const getErrorMessage = (error: any) =>
    typeof error?.message === "string" ? error.message : "";

  return (
    <section className="flex flex-col justify-between p-10">
      {/* steps */}
      <nav aria-label="Progress">
        <ol role="list" className="space-y-2 md:flex md:space-x-8 md:space-y-0">
          {steps.map((step, index) => (
            <li key={step.name} className="md:flex-1">
              {currentStep > index ? (
                <div className="group flex w-full flex-col border-l-4 border-primary py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-sm font-medium text-gray-500 transition-colors">
                      {step.id}
                    </span>
                  </div>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              ) : currentStep === index ? (
                <div
                  className="flex w-full flex-col border-l-4 border-primary py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                  aria-current="step"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-white" />
                    <span className="text-sm font-medium text-white/50">
                      {step.id}
                    </span>
                  </div>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              ) : (
                <div className="group flex w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-sm font-medium text-gray-500 transition-colors">
                      {step.id}
                    </span>
                  </div>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Form */}
      <form className="py-10" onSubmit={handleSubmit(processForm)}>
        {currentStep === 0 && (
          <motion.div
            initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <h2 className="text-base font-semibold leading-7 text-white/90">
              Personal Information
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-400">
              Enter your name, email, and create a secure password.
            </p>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              {/* First Name */}
              <div className="sm:col-span-3">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  autoComplete="given-name"
                  {...register("firstName")}
                />
                {errors.firstName?.message && (
                  <p className="mt-2 text-sm text-red-400">
                    {getErrorMessage(errors.firstName)}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div className="sm:col-span-3">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  autoComplete="family-name"
                  {...register("lastName")}
                />
                {errors.lastName?.message && (
                  <p className="mt-2 text-sm text-red-400">
                    {getErrorMessage(errors.lastName)}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="col-span-full">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register("email")}
                />
                {errors.email?.message && (
                  <p className="mt-2 text-sm text-red-400">
                    {getErrorMessage(errors.email)}
                  </p>
                )}
              </div>

              {/* Password */}
              <div
                className={
                  type == "student"
                    ? "sm:col-span-3 relative"
                    : "sm:col-span-4 relative"
                }
              >
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
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
                    {getErrorMessage(errors.password)}
                  </p>
                )}
              </div>

              {/* CL Code*/}
              {type == "student" && (
                <div className="sm:col-span-3 relative">
                  <Label htmlFor="cl_code">CL Code</Label>
                  <Input
                    placeholder="optional"
                    id="cl_code"
                    type="cl_code"
                    {...register("cl_code")}
                  />
                  {errors.cl_code?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {getErrorMessage(errors.cl_code)}
                    </p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {currentStep === 1 && (
          <motion.div
            initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <h2 className="text-base font-semibold leading-7 text-white/90">
              Academic & Contact Details
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-400">
              Tell us about your college, branch, year of study, gender, and
              phone number.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              {/* Gender */}
              <div className="sm:col-span-3">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  onValueChange={(value: "male" | "female" | "other") =>
                    setValue("gender", value)
                  }
                  defaultValue={watch("gender")}
                >
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender?.message && (
                  <p className="mt-2 text-sm text-red-400">
                    {getErrorMessage(errors.gender)}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div className="sm:col-span-3">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  {...register("phone")}
                  autoComplete="tel"
                />
                {errors.phone?.message && (
                  <p className="mt-2 text-sm text-red-400">
                    {getErrorMessage(errors.phone)}
                  </p>
                )}
              </div>

              {/* College Field */}
              <div className="col-span-full">
                <Label htmlFor="college_name">College Name</Label>
                <Select
                  onValueChange={(value: College) =>
                    setValue("college_name", value)
                  }
                  defaultValue={watch("college_name")}
                >
                  <SelectTrigger id="college_name">
                    <SelectValue placeholder="Select college" />
                  </SelectTrigger>
                  <SelectContent>
                    {COLLEGES.map((college) => (
                      <SelectItem key={college} value={college}>
                        {college}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.college_name?.message && (
                  <p className="mt-2 text-sm text-red-400">
                    {getErrorMessage(errors.college_name)}
                  </p>
                )}
              </div>

              {/* Branch */}
              <div className="sm:col-span-3">
                <Label htmlFor="branch">Branch</Label>
                <Select
                  onValueChange={(value: Branch) => setValue("branch", value)}
                  defaultValue={watch("branch")}
                >
                  <SelectTrigger id="branch">
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {BRANCHES.map((branch) => (
                      <SelectItem key={branch} value={branch}>
                        {branch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.branch?.message && (
                  <p className="mt-2 text-sm text-red-400">
                    {getErrorMessage(errors.branch)}
                  </p>
                )}
              </div>

              {/* Year of Study Field */}
              <div className="sm:col-span-3">
                <Label htmlFor="year_of_study">Year of study</Label>
                <Select
                  onValueChange={
                    (value: string) => setValue("year_of_study", Number(value)) // Ensure the value is a number
                  }
                  defaultValue={watch("year_of_study")?.toString() ?? ""} // Ensure default value is a string
                >
                  <SelectTrigger id="year_of_study">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {YEARS_OF_STUDY.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {" "}
                        {/* Use .toString() for the value */}
                        {getYearLabel(year)} Year
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {errors.year_of_study?.message && (
                  <p className="mt-2 text-sm text-red-400">
                    {getErrorMessage(errors.year_of_study)}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === 2 && (
          <>
            <h2 className="text-base font-semibold leading-7 text-white/90">
              Complete & Verify
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-400">
              Thank you for your submission. Please check your email to verify
              your account.
            </p>
          </>
        )}
      </form>

      {/* Navigation */}
      <div className="pt-5">
        <div className="grid grid-cols-2 gap-4 mt-6">
          <button
            type="button"
            onClick={prev}
            disabled={currentStep === 0}
            className="w-full primary-btn disabled:cursor-not-allowed disabled:opacity-50"
          >
            Back
          </button>

          <button
            type="button"
            onClick={next}
            disabled={currentStep === steps.length - 1}
            className="w-full primary-btn disabled:cursor-not-allowed disabled:opacity-50 bg-black text-white shadow-[5px_5px_0px_0px_#6c6c6c]"
          >
            Continue
          </button>
        </div>
      </div>
    </section>
  );
}
