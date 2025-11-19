"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Building2,
  Plus,
  Shield,
  UserCheck,
  Users,
  UserCog,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
} from "lucide-react";
import { assignClCode, findUsers, viewInfoUser } from "@/app/actions/actions";
import LoadingLogo from "@/components/loading-logo";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { useDebounce } from "@/hooks/use-debounce";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type User = {
  uid: string;
  firstName: string;
  lastName: string;
  avatar: string;
  role:
    | "student"
    | "admin"
    | "superadmin"
    | "security"
    | "contingent_leader"
    | "public_relation"
    | "admin_helper";
  email: string;
  is_verified: boolean;
  college_name: string;
  phone: string;
  contingent_id?: string;

  cl_code?: string | null;
  event_alias?: string | null;
};

type UserDetails = User & {
  name: string;
  gender?: string;
  branch?: string;
  year_of_study?: number;
  created_at?: string;
  updated_at?: string;
};

// Role configs (excluding superadmin + security)
const roleConfig: Record<
  Exclude<User["role"], "superadmin" | "security" | "student">,
  { label: string; icon: React.ElementType; color: string }
> = {
  admin: {
    label: "Admins",
    icon: Shield,
    color: "text-red-500",
  },
  contingent_leader: {
    label: "CLs",
    icon: UserCheck,
    color: "text-yellow-500",
  },
  public_relation: {
    label: "PR",
    icon: Users,
    color: "text-purple-500",
  },
  admin_helper: {
    label: "Admin Helpers",
    icon: UserCog,
    color: "text-pink-500",
  },
};

const getRoleBadge = (role: User["role"]) => {
  switch (role) {
    case "admin":
      return <Badge className="bg-red-100 text-red-800">Admin</Badge>;
    case "student":
      return <Badge className="bg-green-100 text-green-800">Student</Badge>;
    case "contingent_leader":
      return <Badge className="bg-yellow-100 text-yellow-800">CL</Badge>;
    case "public_relation":
      return <Badge className="bg-purple-100 text-purple-800">PR</Badge>;
    case "admin_helper":
      return <Badge className="bg-pink-100 text-pink-800">Admin Helper</Badge>;
    case "superadmin":
      return <Badge className="bg-gray-100 text-gray-800">Superadmin</Badge>;
    case "security":
      return <Badge className="bg-blue-100 text-blue-800">Security</Badge>;
    default:
      return <Badge variant="outline">{role}</Badge>;
  }
};

const getRoleStats = (users: User[]) => {
  const counts: Record<string, number> = {};
  users.forEach((u) => (counts[u.role] = (counts[u.role] || 0) + 1));
  return counts;
};

const ManageUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedCL, setSelectedCL] = useState("all");
  const [selectedCollege, setSelectedCollege] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  const [bulkCLDialog, setBulkCLDialog] = useState(false);
  const [newCLCode, setNewCLCode] = useState("");

  const [viewUser, setViewUser] = useState<UserDetails | null>(null);
  const [viewLoading, setViewLoading] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        const { data } = await findUsers();
        setUsers(data || []);
      } catch (err) {
        console.error("Failed to fetch users", err);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  const handleViewUser = async (userId: string) => {
    setViewLoading(true);
    try {
      const result = await viewInfoUser(userId);
      if (result.success) {
        setViewUser(result.data);
      }
    } catch (err) {
      console.error("Failed to load user info", err);
    } finally {
      setViewLoading(false);
    }
  };

  const handleBulkCLAssignment = async () => {
    if (!newCLCode.trim() || selectedUsers.length === 0) return;

    setIsUpdating(true);

    try {
      const payload = {
        cl_code: newCLCode,
        user_ids: selectedUsers,
      };

      const result = await assignClCode(payload);

      if (result.success) {
        toast.success("CL code assigned successfully");

        // Update local state so UI reflects the change
        setUsers((prev) =>
          prev.map((u) =>
            selectedUsers.includes(u.uid) ? { ...u, cl_code: newCLCode } : u
          )
        );

        // Reset selections & close dialog
        setSelectedUsers([]);
        setNewCLCode("");
        setBulkCLDialog(false);
      } else {
        toast.error(result.error || "Failed to assign CL code");
      }
    } catch (err) {
      console.error("Failed to assign CL code", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const contingentLeaders = useMemo(
    () => users.filter((u) => u.role === "contingent_leader"),
    [users]
  );

  const uniqueCLs = useMemo(
    () =>
      contingentLeaders
        .filter((u) => !!u.cl_code)
        .map((u) => ({
          value: u.cl_code!, // use cl_code
          label: `${u.cl_code} (${u.firstName} ${u.lastName})`,
        })),
    [contingentLeaders]
  );

  const uniqueColleges = useMemo(
    () => [...new Set(users.map((u) => u.college_name))],
    [users]
  );

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.firstName
          .toLowerCase()
          .includes(debouncedSearchQuery.toLowerCase()) ||
        u.lastName.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(debouncedSearchQuery.toLowerCase());

      const matchesRole = selectedRole === "all" || u.role === selectedRole;

      const matchesCL = selectedCL === "all" || u.cl_code === selectedCL;

      const matchesCollege =
        selectedCollege === "all" || u.college_name === selectedCollege;

      return matchesSearch && matchesRole && matchesCL && matchesCollege;
    });
  }, [users, debouncedSearchQuery, selectedRole, selectedCL, selectedCollege]);

  const roleStats = useMemo(() => getRoleStats(users), [users]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(filteredUsers.map((u) => u.uid));
    } else {
      setSelectedUsers([]);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedRole("all");
    setSelectedCL("all");
    setSelectedCollege("all");
  };

  const getUserInitials = (user?: {
    firstName?: string;
    lastName?: string;
  }) => {
    const first = user?.firstName?.charAt(0) ?? "";
    const last = user?.lastName?.charAt(0) ?? "";
    const initials = `${first}${last}`.trim();
    return initials.toUpperCase() || "U";
  };

  const handleSelectUser = (uid: string, checked: boolean) => {
    setSelectedUsers((prev) =>
      checked ? [...prev, uid] : prev.filter((id) => id !== uid)
    );
  };

  return (
    <div className="container max-w-7xl mx-auto py-4 md:px-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Manage Users</h1>
          <p className="text-muted-foreground text-sm">
            Manage users, CLs, and role assignments
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {loading ? (
        <LoadingLogo />
      ) : (
        <>
          <div className="space-y-4">
            {/* Top row: Total + Participants */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Total Users */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Total Users
                      </p>
                      <p className="text-2xl font-bold">{users.length}</p>
                    </div>
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              {/* Students */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Students
                      </p>
                      <p className="text-2xl font-bold text-green-500">
                        {roleStats["student"] || 0}
                      </p>
                    </div>
                    <Building2 className="h-6 w-6 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Other roles below */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(roleConfig).map(([role, config]) => {
                const count = roleStats[role] || 0;
                const Icon = config.icon;
                return (
                  <Card key={role}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            {config.label}
                          </p>
                          <p className={`text-2xl font-bold ${config.color}`}>
                            {count}
                          </p>
                        </div>
                        <Icon className={`h-6 w-6 ${config.color}`} />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">All Users</CardTitle>
              <CardDescription>Search and filter users</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="flex flex-col gap-4 mb-6">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or email..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4">
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="All Roles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="student">Participant</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="contingent_leader">
                        Contingent Leader
                      </SelectItem>
                      <SelectItem value="public_relation">PR</SelectItem>
                      <SelectItem value="admin_helper">Admin Helper</SelectItem>
                      <SelectItem value="superadmin">Superadmin</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedCL} onValueChange={setSelectedCL}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="All CLs" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All CLs</SelectItem>
                      {uniqueCLs.map((cl) => (
                        <SelectItem key={cl.value} value={cl.value}>
                          {cl.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={selectedCollege}
                    onValueChange={setSelectedCollege}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="All Colleges" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Colleges</SelectItem>
                      {uniqueColleges.map((college) => (
                        <SelectItem key={college} value={college}>
                          {college}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button variant="outline" onClick={clearFilters}>
                    <Filter className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                </div>
              </div>

              {/* Results Summary */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredUsers.length} of {users.length} users
                </p>
                <div className="flex items-center gap-3">
                  {filteredUsers.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={
                          selectedUsers.length === filteredUsers.length &&
                          filteredUsers.length > 0
                        }
                        onCheckedChange={handleSelectAll}
                      />
                      <span className="text-sm">Select All</span>
                    </div>
                  )}

                  {/* ✅ Bulk CL assignment trigger */}
                  {selectedUsers.length > 0 && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setBulkCLDialog(true)}
                    >
                      Assign CL Code ({selectedUsers.length})
                    </Button>
                  )}
                </div>
              </div>

              {/* Users Table */}
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={
                            selectedUsers.length === filteredUsers.length &&
                            filteredUsers.length > 0
                          }
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>CL Code</TableHead>
                      <TableHead>College</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead className="w-12">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.uid}>
                        {/* Selection */}
                        <TableCell>
                          <Checkbox
                            checked={selectedUsers.includes(user.uid)}
                            onCheckedChange={(checked) =>
                              handleSelectUser(user.uid, checked as boolean)
                            }
                          />
                        </TableCell>

                        {/* User Info */}
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              {user.avatar ? (
                                <AvatarImage
                                  src={user.avatar}
                                  alt={`${user.firstName} ${user.lastName}`}
                                />
                              ) : (
                                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                  {getUserInitials(user)}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {user.firstName} {user.lastName}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        {/* Role */}
                        <TableCell>{getRoleBadge(user.role)}</TableCell>

                        {/* CL Code */}
                        <TableCell>
                          {user.cl_code ? (
                            <Badge variant="outline">{user.cl_code}</Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              Not assigned
                            </span>
                          )}
                        </TableCell>

                        {/* College */}
                        <TableCell>{user.college_name || "N/A"}</TableCell>

                        {/* Contact */}
                        <TableCell>
                          <div className="text-sm">
                            <p>{user.email}</p>
                            <p className="text-muted-foreground">
                              {user.phone || "N/A"}
                            </p>
                          </div>
                        </TableCell>

                        {/* Actions */}
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleViewUser(user.uid)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Empty State */}
                {filteredUsers.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No users found
                    </h3>
                    <p className="text-muted-foreground">
                      {searchQuery ||
                      selectedRole !== "all" ||
                      selectedCL !== "all" ||
                      selectedCollege !== "all"
                        ? "Try adjusting your search or filters"
                        : "No users have been created yet"}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* View User Details Dialog */}
          <Dialog open={!!viewUser} onOpenChange={() => setViewUser(null)}>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>User Details</DialogTitle>
                <DialogDescription>
                  Complete information for this user
                </DialogDescription>
              </DialogHeader>

              {viewLoading ? (
                <div className="p-6 text-center">Loading...</div>
              ) : (
                viewUser && (
                  <div className="space-y-6">
                    {/* Avatar + Basic Info */}
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        {viewUser.avatar ? (
                          <AvatarImage
                            src={viewUser.avatar}
                            alt={`${viewUser.firstName} ${viewUser.lastName}`}
                          />
                        ) : (
                          <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                            {getUserInitials(viewUser)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-semibold">
                          {viewUser.firstName} {viewUser.lastName}
                        </h3>
                        <p className="text-muted-foreground">
                          {viewUser.email}
                        </p>
                        <div className="mt-2">
                          {getRoleBadge(viewUser.role)}
                        </div>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">
                          Contact Information
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p>
                            <strong>Email:</strong> {viewUser.email}
                          </p>
                          <p>
                            <strong>Phone:</strong>{" "}
                            {viewUser.phone || "Not provided"}
                          </p>
                          <p>
                            <strong>College:</strong>{" "}
                            {viewUser.college_name || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">
                          System Information
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p>
                            <strong>UID:</strong> {viewUser.uid}
                          </p>
                          <p>
                            <strong>Role:</strong> {getRoleBadge(viewUser.role)}
                          </p>
                          <p>
                            <strong>CL Code:</strong>{" "}
                            {viewUser.cl_code ? (
                              <Badge variant="outline">
                                {viewUser.cl_code}
                              </Badge>
                            ) : (
                              "Not assigned"
                            )}
                          </p>
                          <p>
                            <strong>Event Alias:</strong>{" "}
                            {viewUser.event_alias || "Not assigned"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}

              <DialogFooter>
                <Button variant="outline" onClick={() => setViewUser(null)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Bulk CL Assignment Dialog */}
          <Dialog open={bulkCLDialog} onOpenChange={setBulkCLDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Assign CL Code</DialogTitle>
                <DialogDescription>
                  Assign CL code to {selectedUsers.length} selected users
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cl-code">CL Name Code</Label>
                  <Input
                    id="cl-code"
                    placeholder="Enter CL code (e.g., CL001)"
                    value={newCLCode}
                    onChange={(e) => setNewCLCode(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setBulkCLDialog(false)}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleBulkCLAssignment}
                  disabled={isUpdating || !newCLCode.trim()}
                >
                  {isUpdating ? "Assigning..." : "Assign CL Code"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default ManageUsers;
