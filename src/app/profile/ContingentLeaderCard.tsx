// "use client";

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { CLInfo } from "@/lib/types";
// import { User, Mail, Phone, Hash } from "lucide-react";

// type Props = {
//   clInfo: {
//     success: boolean;
//     data?: CLInfo;
//     error?: string;
//   };
// };

// export default function ContingentLeaderCard({ clInfo }: Props) {
//   if (!clInfo.success || !clInfo.data) {
//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle>Contingent Leader Info</CardTitle>
//           <CardDescription>Unable to fetch data</CardDescription>
//         </CardHeader>
//         <CardContent className="text-sm text-red-500">
//           {clInfo.error ?? "No data available."}
//         </CardContent>
//       </Card>
//     );
//   }

//   const { cl_code, contingent_leader: cl } = clInfo.data;

//   const infoStyle =
//     "flex items-center gap-3 p-4 border rounded-lg bg-muted/40 shadow-sm";

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Contingent Leader Info</CardTitle>
//         <CardDescription>
//           Your assigned leader and contact details
//         </CardDescription>
//       </CardHeader>
//       <CardContent className="space-y-4 px-6 pb-6">
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
//           <div className={infoStyle}>
//             <User className="w-5 h-5 text-primary" />
//             <div>
//               <p className="text-xs text-muted-foreground">Leader Name</p>
//               <p className="font-medium">
//                 {cl.firstName} {cl.lastName}
//               </p>
//             </div>
//           </div>

//           <div className={infoStyle}>
//             <Mail className="w-5 h-5 text-primary" />
//             <div>
//               <p className="text-xs text-muted-foreground">Email</p>
//               <p className="font-medium">{cl.email}</p>
//             </div>
//           </div>

//           <div className={infoStyle}>
//             <Phone className="w-5 h-5 text-primary" />
//             <div>
//               <p className="text-xs text-muted-foreground">Phone</p>
//               <p className="font-medium">{cl.phone}</p>
//             </div>
//           </div>

//           <div className={infoStyle}>
//             <Hash className="w-5 h-5 text-primary" />
//             <div>
//               <p className="text-xs text-muted-foreground">CL Code</p>
//               <p className="font-medium">{cl_code}</p>
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }


// "use client";

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { CLInfo } from "@/lib/types";
// import { User, Mail, Phone, Hash } from "lucide-react";
// import { useState } from "react";

// type Props = {
//   clInfo: {
//     success: boolean;
//     data?: CLInfo;
//     error?: string;
//   };
// };

// export default function ContingentLeaderCard({ clInfo }: Props) {
//   const [clCode, setClCode] = useState("");

//   if (!clInfo.success || !clInfo.data) {
//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle>Contingent Leader Info</CardTitle>
//           <CardDescription>You are not registered under any leader</CardDescription>
//         </CardHeader>
//         <CardContent className="flex flex-col items-center justify-center py-8 gap-4">
//           <p className="text-muted-foreground text-sm">
//             Currently, you don’t have a contingent leader assigned.
//           </p>

//           {/* Add under CL dialog */}
//           <Dialog>
//             <DialogTrigger asChild>
//               <Button>Add CL Code</Button>
//             </DialogTrigger>
//             <DialogContent className="sm:max-w-md">
//               <DialogHeader>
//                 <DialogTitle>Register under a Contingent Leader</DialogTitle>
//                 <DialogDescription>
//                   Enter the CL Code provided by your contingent leader to register yourself under their contingent.
//                 </DialogDescription>
//               </DialogHeader>
//               <div className="space-y-4">
//                 <div className="grid gap-2">
//                   <Label htmlFor="cl_code">CL Code</Label>
//                   <Input
//                     id="cl_code"
//                     value={clCode}
//                     onChange={(e) => setClCode(e.target.value)}
//                     placeholder="Enter CL Code"
//                   />
//                 </div>
//               </div>
//               <DialogFooter>
//                 <Button
//                   onClick={() => {
//                     // TODO: call API to assign CL here
//                     console.log("Submitting CL code:", clCode);
//                   }}
//                 >
//                   Submit
//                 </Button>
//               </DialogFooter>
//             </DialogContent>
//           </Dialog>
//         </CardContent>
//       </Card>
//     );
//   }

//   const { cl_code, contingent_leader: cl } = clInfo.data;

//   const infoStyle =
//     "flex items-center gap-3 p-4 border rounded-lg bg-muted/40 shadow-sm";

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Contingent Leader Info</CardTitle>
//         <CardDescription>Your assigned leader and contact details</CardDescription>
//       </CardHeader>
//       <CardContent className="space-y-4 px-6 pb-6">
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
//           <div className={infoStyle}>
//             <User className="w-5 h-5 text-primary" />
//             <div>
//               <p className="text-xs text-muted-foreground">Leader Name</p>
//               <p className="font-medium">
//                 {cl.firstName} {cl.lastName}
//               </p>
//             </div>
//           </div>

//           <div className={infoStyle}>
//             <Mail className="w-5 h-5 text-primary" />
//             <div>
//               <p className="text-xs text-muted-foreground">Email</p>
//               <p className="font-medium">{cl.email}</p>
//             </div>
//           </div>

//           <div className={infoStyle}>
//             <Phone className="w-5 h-5 text-primary" />
//             <div>
//               <p className="text-xs text-muted-foreground">Phone</p>
//               <p className="font-medium">{cl.phone}</p>
//             </div>
//           </div>

//           <div className={infoStyle}>
//             <Hash className="w-5 h-5 text-primary" />
//             <div>
//               <p className="text-xs text-muted-foreground">CL Code</p>
//               <p className="font-medium">{cl_code}</p>
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }


"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CLInfo } from "@/lib/types";
import { User, Mail, Phone, Hash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { assignClCode } from "../actions/actions";

type Props = {
  clInfo: {
    success: boolean;
    data?: CLInfo;
    error?: string;
  };
};

export default function ContingentLeaderCard({ clInfo }: Props) {
  const [clCode, setClCode] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleAssign() {
    if (!clCode.trim()) {
      toast.error("Please enter a CL code");
      return;
    }

    setLoading(true);
    const result = await assignClCode({ cl_code: clCode });
    setLoading(false);

    if (result.success) {
      toast.success("Successfully registered under Contingent Leader!");
      setOpen(false); // close dialog
      setClCode("");
      // Optionally: refresh page or mutate state if using SWR/React Query
    } else {
      toast.error(result.error || "Failed to assign CL code");
    }
  }

  if (!clInfo.success || !clInfo.data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contingent Leader Info</CardTitle>
          <CardDescription>You are not registered under any leader</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8 gap-4">
          <p className="text-muted-foreground text-sm">
            Currently, you don’t have a contingent leader assigned.
          </p>

          {/* Add under CL dialog */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Add CL Code</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Register under a Contingent Leader</DialogTitle>
                <DialogDescription>
                  Enter the CL Code provided by your contingent leader to register
                  yourself under their contingent.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="cl_code">CL Code</Label>
                  <Input
                    id="cl_code"
                    value={clCode}
                    onChange={(e) => setClCode(e.target.value)}
                    placeholder="Enter CL Code"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAssign} disabled={loading}>
                  {loading ? "Submitting..." : "Submit"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    );
  }

  const { cl_code, contingent_leader: cl } = clInfo.data;

  const infoStyle =
    "flex items-center gap-3 p-4 border rounded-lg bg-muted/40 shadow-sm";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contingent Leader Info</CardTitle>
        <CardDescription>Your assigned leader and contact details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-6 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className={infoStyle}>
            <User className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Leader Name</p>
              <p className="font-medium">
                {cl.firstName} {cl.lastName}
              </p>
            </div>
          </div>

          <div className={infoStyle}>
            <Mail className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="font-medium">{cl.email}</p>
            </div>
          </div>

          <div className={infoStyle}>
            <Phone className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="font-medium">{cl.phone}</p>
            </div>
          </div>

          <div className={infoStyle}>
            <Hash className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">CL Code</p>
              <p className="font-medium">{cl_code}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
