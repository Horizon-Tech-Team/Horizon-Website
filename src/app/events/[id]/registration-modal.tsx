// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

"use client";

import { useState } from "react";
import { X, Plus, Check, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { registrationSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { registerForEventAction } from "@/app/actions/actions";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  isTeamEvent: boolean;
  teamSizeMin?: number;
  teamSizeMax?: number;
  eventName: string;
  event_id: string;
}

export default function RegistrationModal({
  isOpen,
  onClose,
  isTeamEvent,
  teamSizeMin = 2,
  teamSizeMax = 5,
  eventName,
  event_id,
}: RegistrationModalProps) {
  const [step, setStep] = useState<
    "form" | "confirmation" | "success" | "failed" | "already_registered"
  >("form");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    control,
    watch,
    reset,
  } = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      is_team_event: isTeamEvent,
      teamName: "",
      teamMembers: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "teamMembers",
  });

  const addTeamMember = () => {
    if (fields.length < teamSizeMax - 1) {
      append({ name: "", email: "", phone: "" });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  const onValidSubmit = (data: any) => {
    setStep("confirmation");
  };

  const handleConfirm = handleSubmit(
    async (data: z.infer<typeof registrationSchema>) => {
      console.log("Final Registration Data:", data);
      if (isSubmitting) return; // Prevent double-submit
      setIsSubmitting(true);

      const result = await registerForEventAction(event_id, data);

      if (!result.success) {
        if (result.error_code === "registration_exists") {
          setStep("already_registered");
        } else {
          setStep("failed");
        }
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      setStep("success");
    }
  );

  const handleClose = () => {
    // Reset form state when closing
    setStep("form");
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        {step === "form" && (
          <>
            <DialogHeader>
              <DialogTitle>Register for {eventName}</DialogTitle>
              <DialogDescription>
                {isTeamEvent
                  ? `Please provide your team details. Teams must have between ${teamSizeMin} and ${teamSizeMax} members.`
                  : "Please confirm your registration for this event."}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {isTeamEvent && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="teamName">Team Name</Label>
                    <Input
                      {...register("teamName")}
                      placeholder="Enter your team name"
                    />

                    {errors.teamName && (
                      <p className="text-sm text-red-500">
                        {errors.teamName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label>Team Members</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addTeamMember}
                        disabled={fields.length >= teamSizeMax}
                        className="flex items-center gap-1"
                      >
                        <Plus className="h-4 w-4" />
                        Add Member
                      </Button>
                    </div>

                    <div className="bg-muted p-3 rounded-md">
                      <h4 className="font-medium">You (Team Leader)</h4>
                      <p className="text-sm text-muted-foreground">
                        Your account information will be used as the primary
                        registrant.
                      </p>
                    </div>

                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="space-y-3 p-3 border rounded-md relative"
                      >
                        <div className="absolute right-2 top-2">
                          {fields.length > 0 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => remove(index)}
                              className="h-6 w-6 p-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                        <h4 className="font-medium">Member {index + 2}</h4>

                        <div className="space-y-2">
                          <Label htmlFor={`teamMembers.${index}.name`}>
                            Name
                          </Label>
                          <Input
                            {...register(`teamMembers.${index}.name`)}
                            placeholder="Enter name"
                          />
                          {errors.teamMembers?.[index]?.name && (
                            <p className="text-sm text-red-500">
                              {errors.teamMembers[index].name.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`teamMembers.${index}.email`}>
                            Email
                          </Label>
                          <Input
                            {...register(`teamMembers.${index}.email`)}
                            placeholder="Enter email"
                          />
                          {errors.teamMembers?.[index]?.email && (
                            <p className="text-sm text-red-500">
                              {errors.teamMembers[index].email.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`teamMembers.${index}.phone`}>
                            Phone
                          </Label>
                          <Input
                            {...register(`teamMembers.${index}.phone`)}
                            placeholder="Enter phone"
                          />
                          {errors.teamMembers?.[index]?.phone && (
                            <p className="text-sm text-red-500">
                              {errors.teamMembers[index].phone.message}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {!isTeamEvent && (
                <p>
                  You are registering for {eventName} as an individual
                  participant. Click &quot;Continue&quot; to proceed.
                </p>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit(onValidSubmit)}
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSubmitting ? "Please wait..." : "Continue"}
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "confirmation" && (
          <>
            <DialogHeader>
              <DialogTitle>Confirm Registration</DialogTitle>
              <DialogDescription>
                Please review your registration details before submitting.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {isTeamEvent ? (
                <>
                  <div>
                    <h4 className="font-medium">Team Name</h4>
                    <p>{watch("teamName")}</p>
                  </div>

                  <div className="space-y-2 mt-4">
                    <h4 className="font-medium">Team Members</h4>

                    {/* Registrant (You) */}
                    <div className="p-2 bg-muted rounded-md border">
                      <div className="font-medium">You (Team Leader)</div>
                      <div className="text-sm text-muted-foreground">
                        Your account information will be used.
                      </div>
                    </div>

                    {/* Other Members */}
                    {watch("teamMembers")?.map((member, index) => (
                      <div
                        key={index}
                        className="p-2 bg-muted rounded-md border"
                      >
                        <div className="font-medium">Member {index + 2}</div>
                        <div className="text-sm text-muted-foreground">
                          {member.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {member.email}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {member.phone}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p>
                  You are registering for {eventName} as an individual
                  participant.
                </p>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setStep("form")}>
                Back
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={!isValid || isSubmitting}
                className="flex items-center gap-2"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSubmitting ? "Submitting..." : "Confirm Registration"}
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "success" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                Registration Successful
              </DialogTitle>
              <DialogDescription>
                Your registration for {eventName} has been confirmed.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <Alert>
                <AlertDescription>
                  {isTeamEvent
                    ? `Team "${watch(
                        "teamName"
                      )}" has been successfully registered. We've sent confirmation emails to all team members.`
                    : "You have been successfully registered for this event. We've sent a confirmation email with the details."}
                </AlertDescription>
              </Alert>
            </div>

            <DialogFooter>
              <Button onClick={handleClose}>Close</Button>
            </DialogFooter>
          </>
        )}

        {step === "failed" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-red-500 flex items-center gap-2">
                <X className="h-5 w-5" />
                Registration Failed
              </DialogTitle>
              <DialogDescription>
                Something went wrong during registration. Please try again.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <Alert variant="destructive">
                <AlertDescription>
                  We couldn’t complete your registration due to a server error
                  or invalid data. Please go back and ensure all fields are
                  correctly filled, or try again later.
                </AlertDescription>
              </Alert>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setStep("form")}>
                Back to Form
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "already_registered" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-yellow-600">
                <AlertCircle className="h-5 w-5" />
                Already Registered
              </DialogTitle>
              <DialogDescription>
                You’ve already registered for <strong>{eventName}</strong>. If
                you believe this is a mistake, please contact support.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button onClick={handleClose}>Close</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
