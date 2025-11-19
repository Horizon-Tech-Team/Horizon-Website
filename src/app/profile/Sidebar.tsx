/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RegisteredEvent } from "@/lib/types";
import { Camera } from "lucide-react";
import { useAuth } from "../AuthProvider";
import { format } from "date-fns";
import { uploadAvatar } from "../actions/actions";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ScoreReport } from "../dashboard/cl/Dashboard";

type Props = {
  registeredEvents: RegisteredEvent[] | null;
  clStat: ScoreReport;
};

const Sidebar = ({ registeredEvents, clStat }: Props) => {
  const { user, setUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  // Fallback initials
  const getUserInitials = () => {
    const first = user?.firstName || "";
    const last = user?.lastName || "";
    const initials = `${first.charAt(0)}${last.charAt(0)}`;
    return initials.toUpperCase() || "U";
  };

  const memberSince = user?.created_at
    ? format(new Date(user.created_at), "MMMM yyyy")
    : "Unknown";

  const totalParticipation = Object.values(clStat?.categories || {}).reduce(
    (sum, events) => {
      return (
        sum +
        events.reduce(
          (eventSum, ev) =>
            eventSum +
            ev.registrations.online.count +
            ev.registrations.offline.count,
          0
        )
      );
    },
    0
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await uploadAvatar(file);
      if (!res.success) throw new Error(res.error);
      setUser(
        user ? { ...user, avatar: `${res.data.url}?t=${Date.now()}` } : null
      );
      console.log(res);
      toast.success("Avatar updated successfully.");
      // ✅ res.data.url contains public image URL
    } catch (err: any) {
      toast.error(err.message || "Failed to upload avatar.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="md:col-span-1 space-y-6">
      <Card>
        <CardContent className="pt-6 flex flex-col items-center text-center">
          <div className="relative mb-4">
            <Avatar className="h-24 w-24 border-4 border-white">
              {uploading ? (
                <div className="flex items-center justify-center h-full w-full text-muted-foreground">
                  <span className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></span>
                </div>
              ) : (
                <AvatarImage
                  src={user?.avatar || undefined}
                  alt={`${user?.firstName} ${user?.lastName}`}
                />
              )}
              <AvatarFallback className="text-xl">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>

            <Button
              size="icon"
              variant="outline"
              className="absolute bottom-0 right-0 rounded-full h-8 w-8 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <Camera className="h-4 w-4" />
              <span className="sr-only">Change avatar</span>
            </Button>

            {/* hidden file input */}
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>
          <h2 className="text-xl font-bold">
            {user?.firstName} {user?.lastName}
          </h2>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          <Badge variant="default" className="mt-2">
            {user?.role === "contingent_leader"
              ? "CL (Contingent Leader)"
              : user?.role}
          </Badge>
          <p className="text-sm mt-2 text-muted-foreground">
            Member since {memberSince}
          </p>
        </CardContent>
      </Card>

      {user?.role != "admin_helper" &&
        user?.role != "public_relation" &&
        user?.role != "superadmin" &&
        user?.role != "admin" && (
          <Card>
            <CardHeader>
              <CardTitle>Horizon Tech Fest 2025</CardTitle>
              <CardDescription>Quick Stats</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {user?.role == "contingent_leader" ? (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      Total Participation
                    </span>
                    <Badge variant="outline">{totalParticipation}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      Events Coordinated
                    </span>
                    <Badge variant="outline">
                      {Object.values(clStat?.categories || {}).reduce(
                        (total, events) => total + events.length,
                        0
                      )}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      Total PR Points
                    </span>
                    <Badge variant="outline">
                      {clStat?.summary?.final_score ?? 0}
                    </Badge>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      Registered Events
                    </span>
                    <Badge variant="outline">{registeredEvents?.length}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Team Events</span>
                    <Badge variant="outline">
                      {
                        registeredEvents?.filter((reg) => reg.is_team_event)
                          .length
                      }
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      Individual Events
                    </span>
                    <Badge variant="outline">
                      {
                        registeredEvents?.filter((reg) => !reg.is_team_event)
                          .length
                      }
                    </Badge>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full primary-btn" asChild>
                {user?.role == "contingent_leader" ? (
                  <a href="/dashboard/cl">View Dashboard</a>
                ) : (
                  <a href="/dashboard">View Dashboard</a>
                )}
              </Button>
            </CardFooter>
          </Card>
        )}
      {user?.role == "contingent_leader" && (
        <Card>
          <CardHeader>
            <CardTitle>Manage Students</CardTitle>
            <CardDescription>
              View, add, or update the students in your contingent.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* No content needed as per your request */}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full primary-btn" asChild>
              <a href="/cl/students">Go to Manage Students</a>
            </Button>
          </CardFooter>
        </Card>
      )}
      {user?.role == "admin_helper" && (
        <Card>
          <CardHeader>
            <CardTitle>Offline Registration</CardTitle>
            <CardDescription>
              Register students who are physically present at the venue.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* No content needed as per your request */}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full primary-btn" asChild>
              <a href="/volunteer/offline-registration">
                Go to Offline Registration
              </a>
            </Button>
          </CardFooter>
        </Card>
      )}
      {user?.role == "public_relation" && (
        <Card>
          <CardHeader>
            <CardTitle>Award PR Points</CardTitle>
            <CardDescription>
              Award PR points to a College Representative (Contingent Leader)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* No content needed as per your request */}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full primary-btn" asChild>
              <a href="/admin/pr/award">Go to Award PR Points</a>
            </Button>
          </CardFooter>
        </Card>
      )}
      {(user?.role === "superadmin" || user?.role === "admin") && (
        <Card>
          <CardHeader>
            <CardTitle>Admin Panel</CardTitle>
            <CardDescription>
              Access the admin dashboard to manage features, users, and
              settings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Optional: add quick stats or links here */}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full primary-btn" asChild>
              <a href="/admin">Go to Admin Panel</a>
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default Sidebar;
