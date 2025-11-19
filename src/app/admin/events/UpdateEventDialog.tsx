/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { updateEvent } from "@/app/actions/actions";
import { Event } from "@/app/events/page";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toISOStringLocal } from "@/lib/utils";
import { updateEventSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

interface UpdateEventDialogProps {
  event: Event | null;
  onClose: () => void;
  onUpdate: (event: Event) => void;
}

type Inputs = z.infer<typeof updateEventSchema>;

export function UpdateEventDialog({
  event,
  onClose,
  onUpdate,
}: UpdateEventDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    reset,
  } = useForm<Inputs>({
    resolver: zodResolver(updateEventSchema),
    defaultValues: { is_team_event: false }, // fallback
  });

  useEffect(() => {
    if (event) {
      reset({
        name: event.name,
        description: event.description,
        category: event.category,
        start_date: event.start_time?.slice(0, 10),
        start_time: event.start_time?.slice(11, 16),
        end_date: event.end_time?.slice(0, 10),
        end_time: event.end_time?.slice(11, 16),
        venue: event.venue,
        max_capacity: event.max_capacity,
        is_team_event: event.is_team_event,
        team_size_min: event.team_size_min,
        team_size_max: event.team_size_max,
        rules: event.rules,
        contact_email: event.contact_email,
        contact_phone: event.contact_phone,
        registration_deadline_date: event.registration_deadline?.slice(0, 10),
        registration_deadline_time: event.registration_deadline?.slice(11, 16),
        banner_url: event.banner_url,
      });
    }
  }, [event, reset]);

  const processForm: SubmitHandler<Inputs> = async (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Build only changed fields
      const payload: Record<string, any> = {};

      if (data.start_date && data.start_time) {
        payload.start_time = toISOStringLocal(data.start_date, data.start_time);
      }
      if (data.end_date && data.end_time) {
        payload.end_time = toISOStringLocal(data.end_date, data.end_time);
      }
      if (data.registration_deadline_date && data.registration_deadline_time) {
        payload.registration_deadline = toISOStringLocal(
          data.registration_deadline_date,
          data.registration_deadline_time
        );
      }

      // copy scalar fields if provided
      [
        "name",
        "description",
        "category",
        "venue",
        "max_capacity",
        "is_team_event",
        "team_size_min",
        "team_size_max",
        "rules",
        "contact_email",
        "contact_phone",
        "banner_url",
      ].forEach((key) => {
        if (data[key as keyof Inputs] !== undefined) {
          payload[key] = data[key as keyof Inputs];
        }
      });

      if (!event) throw new Error("No event selected");

      const result = await updateEvent(event.uid, payload);

      if (result?.error) {
        toast.error("Failed to update event. Please try again.");
        setIsSubmitting(false);
        return;
      }

      toast.success("Event updated successfully!");
      onUpdate(result.data); // pass updated event back to parent
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while updating event.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) onClose();
  };

  return (
    <Dialog open={!!event} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Event</DialogTitle>
          <DialogDescription>
            Modify the details below and save changes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(processForm)} className="space-y-6">
          {/* Event Name */}
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input id="name" type="text" {...register("name")} />
            {errors.name && (
              <p className="mt-2 text-sm text-red-400">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea id="description" {...register("description")} />
            {errors.description && (
              <p className="mt-2 text-sm text-red-400">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <Label>Category *</Label>
            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tech_spotlight">
                      Tech Spotlight
                    </SelectItem>
                    <SelectItem value="TECHNICAL SKILL">TECHNICAL SKILL</SelectItem>
                    <SelectItem value="TECH-SPOTLIGHT">TECH-SPOTLIGHT</SelectItem>
                    <SelectItem value="LOGICAL & ANALYTICAL">LOGICAL & ANALYTICAL</SelectItem>
                    <SelectItem value="VERBAL AND EXPRESSIVE">VERBAL AND EXPRESSIVE</SelectItem>
                    <SelectItem value="CREATIVE">CREATIVE</SelectItem>
                    <SelectItem value="FUN & INTERACTIVE SIDE GAMES">FUN & INTERACTIVE SIDE GAMES</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category && (
              <p className="mt-2 text-sm text-red-400">
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Start Date *</Label>
              <Input type="date" {...register("start_date")} />

              {errors.start_date && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.start_date.message}
                </p>
              )}
            </div>
            <div>
              <Label>Start Time *</Label>
              <Input type="time" {...register("start_time")} />
              {errors.start_time && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.start_time.message}
                </p>
              )}
            </div>
            <div>
              <Label>End Date *</Label>
              <Input type="date" {...register("end_date")} />

              {errors.end_date && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.end_date.message}
                </p>
              )}
            </div>
            <div>
              <Label>End Time *</Label>
              <Input type="time" {...register("end_time")} />
              {errors.end_time && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.end_time.message}
                </p>
              )}
            </div>
          </div>

          {/* Venue */}
          <div>
            <Label htmlFor="venue">Venue *</Label>
            <Input id="venue" type="text" {...register("venue")} />
            {errors.venue && (
              <p className="mt-2 text-sm text-red-400">
                {errors.venue.message}
              </p>
            )}
          </div>

          {/* Capacity */}
          <div>
            <Label htmlFor="max_capacity">Max Capacity *</Label>
            <Input
              id="max_capacity"
              type="number"
              {...register("max_capacity", { valueAsNumber: true })}
            />
            {errors.max_capacity && (
              <p className="mt-2 text-sm text-red-400">
                {errors.max_capacity.message}
              </p>
            )}
          </div>

          {/* Team Event */}
          <div className="flex items-center space-x-2">
            <Controller
              control={control}
              name="is_team_event"
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(val) => field.onChange(val === true)}
                />
              )}
            />
            <Label>Is Team Event?</Label>
          </div>

          {/* Team Sizes */}
          {watch("is_team_event") && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Min Team Size</Label>
                <Input
                  type="number"
                  {...register("team_size_min", { valueAsNumber: true })}
                />
              </div>
              <div>
                <Label>Max Team Size</Label>
                <Input
                  type="number"
                  {...register("team_size_max", { valueAsNumber: true })}
                />
                {errors.team_size_max && (
                  <p className="mt-2 text-sm text-red-400">
                    {errors.team_size_max.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Rules */}
          <div>
            <Label>Rules</Label>
            <Textarea {...register("rules")} />
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Email *</Label>
              <Input type="email" {...register("contact_email")} />
              {errors.contact_email && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.contact_email.message}
                </p>
              )}
            </div>
            <div>
              <Label>Phone *</Label>
              <Input type="tel" {...register("contact_phone")} />
              {errors.contact_phone && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.contact_phone.message}
                </p>
              )}
            </div>
          </div>

          {/* Registration Deadline */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Deadline Date *</Label>
              <Input type="date" {...register("registration_deadline_date")} />
              {errors.registration_deadline_date && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.registration_deadline_date.message}
                </p>
              )}
            </div>
            <div>
              <Label>Deadline Time *</Label>
              <Input type="time" {...register("registration_deadline_time")} />
              {errors.registration_deadline_time && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.registration_deadline_time.message}
                </p>
              )}
            </div>
          </div>

          {/* Banner URL */}
          <div>
            <Label>Banner URL</Label>
            <Input type="url" {...register("banner_url")} />
            {errors.banner_url && (
              <p className="mt-2 text-sm text-red-400">
                {errors.banner_url.message}
              </p>
            )}
          </div>

          {/* Actions */}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
