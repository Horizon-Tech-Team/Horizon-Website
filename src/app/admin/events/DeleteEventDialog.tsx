// "use client";

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
// import { useState } from "react";
// import { Event } from "@/app/events/page";
// import { deleteEvent } from "@/app/actions/actions";
// import { toast } from "sonner";

// interface DeleteEventDialogProps {
//   event: Event | null;
//   onClose: () => void;
//   onConfirm: (eventId: string) => void;
// }

// export function DeleteEventDialog({
//   event,
//   onClose,
//   onConfirm,
// }: DeleteEventDialogProps) {
//   const [isDeleting, setIsDeleting] = useState(false);

//   const handleDelete = async () => {
//     if (!event) {
//       toast.error("No event selected for deletion.");
//       return;
//     }
//     if (isDeleting) return;
//     setIsDeleting(true);

//     try {
//       const res = await deleteEvent(event.uid);

//       if (res?.error) {
//         console.error("Delete failed:", res.error, res.resolution);
//         toast.error("Failed to delete event. Please try again.");
//         return;
//       }

//       toast.success("Event deleted successfully!");
//       onConfirm(event.uid); // let parent update state/UI
//       onClose();
//     } catch (error) {
//       console.error("Error deleting event:", error);
//       toast.error("Something went wrong while deleting event.");
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   return (
//     <Dialog open={!!event} onOpenChange={() => !isDeleting && onClose()}>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2 text-red-600">
//             <AlertTriangle className="h-5 w-5" />
//             Delete Event
//           </DialogTitle>
//           <DialogDescription>
//             Are you sure you want to delete this event? This action cannot be
//             undone.
//           </DialogDescription>
//         </DialogHeader>

//         {event && (
//           <div className="p-4 bg-muted/50 rounded-lg">
//             <h3 className="font-semibold">{event.name}</h3>
//             <p className="text-sm text-muted-foreground">{event.description}</p>
//             <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
//               <span>{event.venue}</span>
//               <span>•</span>
//               <span>{event.max_capacity} capacity</span>
//             </div>
//           </div>
//         )}

//         <DialogFooter className="flex gap-2">
//           <Button variant="outline" onClick={onClose} disabled={isDeleting}>
//             Cancel
//           </Button>
//           <Button
//             variant="destructive"
//             onClick={handleDelete}
//             disabled={isDeleting}
//           >
//             {isDeleting ? (
//               <>
//                 <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                 Deleting...
//               </>
//             ) : (
//               <>
//                 <Trash2 className="h-4 w-4 mr-2" />
//                 Delete Event
//               </>
//             )}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
