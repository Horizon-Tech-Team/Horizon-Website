"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateSchema } from "@/lib/validation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth, User } from "@/app/AuthProvider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Key } from "lucide-react";
import ChangePasswordDialog from "./ChangePasswordDialog";
import { format } from "date-fns";
import { updateProfileAction } from "../actions/actions";
import { BRANCHES, YEARS_OF_STUDY } from "@/lib/constant";
import { CLInfo, PR_History, PRPointRecord } from "@/lib/types";
import ContingentLeaderCard from "./ContingentLeaderCard";
import PRHistoryList from "./PRHistory";

type Inputs = z.infer<typeof UpdateSchema>;

type UpdateFormProps = {
  clInfo: {
    success: boolean;
    data?: CLInfo;
    error?: string;
  };
  clPRHistory: {
    success: boolean;
    data?: PRPointRecord[];
    error?: string;
  };
  prPRHistory: {
    success: boolean;
    data?: PR_History[];
    error?: string;
  };
};

export default function UpdateForm({
  clInfo,
  clPRHistory,
  prPRHistory,
}: UpdateFormProps) {
  const { user, setUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(UpdateSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      gender: user?.gender || "male",
      phone: user?.phone || "",
      college_name: user?.college_name || "",
      branch: user?.branch || "",
      year_of_study: user?.year_of_study || 1,
    },
  });

  const updateProfile = user?.updated_at
    ? format(new Date(user.updated_at), "MMMM yyyy")
    : "Unknown";

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("gender", data.gender);
      formData.append("phone", data.phone);
      formData.append("branch", data.branch);
      formData.append("year_of_study", String(data.year_of_study));

      const result = await updateProfileAction(formData);

      if (result?.error) {
        toast.error(result.error);
        setIsSubmitting(false);
        return;
      }

      // Optimistically update user context
      setUser({
        ...user,
        ...data,
      } as User);

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      toast.error("Unexpected error occurred.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getHistoryData = () => {
    if (user?.role === "public_relation") return prPRHistory.data || [];
    if (user?.role === "contingent_leader") return clPRHistory.data || [];
    return [];
  };

  const historyData = getHistoryData();

  return (
    <Tabs defaultValue="personal" className="w-full">
      <TabsList
        className={`grid w-full ${
          user?.role === "contingent_leader" ? "grid-cols-3" : "grid-cols-3"
        } mb-6`}
      >
        <TabsTrigger value="personal">Personal Info</TabsTrigger>
        {user?.role == "student" && (
          <TabsTrigger value="cl">Contingent Leader</TabsTrigger>
        )}
        <TabsTrigger value="security">Security</TabsTrigger>
        {["public_relation", "contingent_leader"].includes(
          user?.role ?? ""
        ) && <TabsTrigger value="history">PR History</TabsTrigger>}
      </TabsList>

      <TabsContent value="personal">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 px-6 pb-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  {...register("firstName")}
                  disabled={!isEditing}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  {...register("lastName")}
                  disabled={!isEditing}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.lastName.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" {...register("email")} disabled />
              </div>

              <div>
                <Label htmlFor="gender">Gender</Label>
                <select
                  id="gender"
                  {...register("gender")}
                  disabled={!isEditing}
                  className="w-full h-10 px-3 border border-input rounded-md bg-background"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.gender.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  {...register("phone")}
                  disabled={!isEditing}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="branch">Branch</Label>
                <select
                  id="branch"
                  {...register("branch")}
                  disabled={!isEditing}
                  className="w-full h-10 px-3 border border-input rounded-md bg-background"
                >
                  {BRANCHES.map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
                {errors.branch && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.branch.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="year_of_study">Year of Study</Label>
                <select
                  id="year_of_study"
                  {...register("year_of_study", { valueAsNumber: true })}
                  disabled={!isEditing}
                  className="w-full h-10 px-3 border border-input rounded-md bg-background"
                >
                  {YEARS_OF_STUDY.map((year) => (
                    <option key={year} value={year}>
                      Year {year}
                    </option>
                  ))}
                </select>
                {errors.year_of_study && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.year_of_study.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="college_name">College Name</Label>
                <Input
                  id="college_name"
                  {...register("college_name")}
                  disabled
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setIsEditing(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </>
              ) : (
                <Button type="button" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </div>
          </form>
        </Card>
      </TabsContent>
      <TabsContent value="security">
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  <h3 className="font-medium">Password</h3>
                </div>
                <ChangePasswordDialog />
              </div>
              <p className="text-sm text-muted-foreground">
                Last changed: {updateProfile}
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      {user?.role == "student" && (
        <TabsContent value="cl">
          <ContingentLeaderCard clInfo={clInfo} />
        </TabsContent>
      )}

      {["public_relation", "contingent_leader"].includes(user?.role ?? "") && (
        <TabsContent value="history">
          <PRHistoryList
            role={
              user?.role === "contingent_leader"
                ? "contingent_leader"
                : "public_relation"
            }
            data={historyData}
          />
        </TabsContent>
      )}
      {/* {user?.role === "public_relation" && (
        <TabsContent value="history">
          <PRHistoryList
            role="public_relation"
            data={
              prPRHistory.data && prPRHistory.data.length > 0
                ? prPRHistory.data
                : []
            }
          />
          {(!prPRHistory.data || prPRHistory.data.length === 0) && (
            <Card>
              <CardHeader>
                <CardTitle>PR Points History</CardTitle>
                <CardDescription>Track your awarded PR points</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  No PR history found.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      )}

      {user?.role === "contingent_leader" && (
        <TabsContent value="history">
          <PRHistoryList
            role="contingent_leader"
            data={
              clPRHistory.data && clPRHistory.data.length > 0
                ? clPRHistory.data
                : []
            }
          />
          {(!clPRHistory.data || clPRHistory.data.length === 0) && (
            <Card>
              <CardHeader>
                <CardTitle>PR Points History</CardTitle>
                <CardDescription>Track your PR points history</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  No PR history found.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      )} */}
    </Tabs>
  );
}
