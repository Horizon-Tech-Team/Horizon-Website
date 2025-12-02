"use client";

import { useState } from "react";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createEventSchema } from "@/lib/validation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { createEvent } from "@/app/actions/actions";
import { toast } from "sonner";

type Inputs = z.infer<typeof createEventSchema>;

interface AddEventDialogProps {
    open: boolean;
    onClose: () => void;
    onAdd: (event: Inputs) => void;
}

export function AddEventDialog({ open, onClose, onAdd }: AddEventDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        watch,
    } = useForm<Inputs>({
        resolver: zodResolver(createEventSchema),
        defaultValues: {
            is_team_event: false,
        },
    });

    const processForm: SubmitHandler<Inputs> = async (data) => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            // Convert date + time to ISO datetime strings
            const startDateTime = new Date(`${data.start_date}T${data.start_time}`);
            const endDateTime = new Date(`${data.end_date}T${data.end_time}`);
            const deadlineDateTime = new Date(
                `${data.registration_deadline_date}T${data.registration_deadline_time}`
            );

            // Transform to backend payload format
            const payload = {
                banner_url: data.banner_url || "",
                category: data.category,
                contact_email: data.contact_email,
                contact_phone: data.contact_phone,
                description: data.description,
                end_time: endDateTime.toISOString().slice(0, 19), // "YYYY-MM-DDTHH:mm:ss"
                is_team_event: data.is_team_event,
                max_capacity: data.max_capacity,
                name: data.name,
                registration_deadline: deadlineDateTime.toISOString().slice(0, 19),
                rules: data.rules,
                start_time: startDateTime.toISOString().slice(0, 19),
                team_size_max: data.team_size_max,
                team_size_min: data.team_size_min,
                venue: data.venue,
            };


            // Call your backend action
            const result = await createEvent(payload);

            if (result?.error) {
                toast.error("Failed to create event. Please try again.");
                setIsSubmitting(false);
                return;
            }

            toast.success("Event created successfully!");
            onAdd(result.data)
            onClose(); // close dialog only on success
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong while creating event.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) onClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Event</DialogTitle>
                    <DialogDescription>
                        Fill in the details below. Fields marked with * are required.
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
                                        <SelectItem value="technical">Technical</SelectItem>
                                        <SelectItem value="analytical">Analytical</SelectItem>
                                        <SelectItem value="verbal">Verbal</SelectItem>
                                        <SelectItem value="creative">Creative</SelectItem>
                                        <SelectItem value="fun">Fun</SelectItem>
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
