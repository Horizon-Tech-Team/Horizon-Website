"use client";

import { useState } from "react";
import { X, Plus, Check } from "lucide-react";
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

interface TeamMember {
  name: string;
  email: string;
  phone: string;
}

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  isTeamEvent: boolean;
  teamSizeMin?: number;
  teamSizeMax?: number;
  eventName: string;
}

export default function RegistrationModal({
  isOpen,
  onClose,
  isTeamEvent,
  teamSizeMin = 2,
  teamSizeMax = 5,
  eventName,
}: RegistrationModalProps) {
  const [step, setStep] = useState<"form" | "confirmation" | "success">("form");
  const [teamName, setTeamName] = useState("");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { name: "", email: "", phone: "" },
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addTeamMember = () => {
    if (teamMembers.length + 1 < teamSizeMax) {
      setTeamMembers([...teamMembers, { name: "", email: "", phone: "" }]);
    }
  };

  const removeTeamMember = (index: number) => {
    if (teamMembers.length > teamSizeMin) {
      const newMembers = [...teamMembers];
      newMembers.splice(index, 1);
      setTeamMembers(newMembers);
    }
  };

  const updateTeamMember = (
    index: number,
    field: keyof TeamMember,
    value: string
  ) => {
    const newMembers = [...teamMembers];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setTeamMembers(newMembers);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (isTeamEvent) {
      if (!teamName.trim()) {
        newErrors.teamName = "Team name is required";
      }

      teamMembers.forEach((member, index) => {
        if (!member.name.trim()) {
          newErrors[`member${index}Name`] = "Name is required";
        }

        if (!member.email.trim()) {
          newErrors[`member${index}Email`] = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(member.email)) {
          newErrors[`member${index}Email`] = "Email is invalid";
        }

        if (!member.phone.trim()) {
          newErrors[`member${index}Phone`] = "Phone is required";
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setStep("confirmation");
    }
  };

  const handleConfirm = () => {
    // In a real app, you would submit the registration data to your backend here
    console.log("Registration data:", {
      isTeamEvent,
      teamName,
      teamMembers,
    });

    setStep("success");
  };

  const handleClose = () => {
    // Reset form state when closing
    setStep("form");
    setTeamName("");
    setTeamMembers([{ name: "", email: "", phone: "" }]);
    setErrors({});
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
                      id="teamName"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder="Enter your team name"
                    />
                    {errors.teamName && (
                      <p className="text-sm text-red-500">{errors.teamName}</p>
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
                        disabled={teamMembers.length >= teamSizeMax}
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

                    {teamMembers.map((member, index) => (
                      <div
                        key={index}
                        className="space-y-3 p-3 border rounded-md relative"
                      >
                        <div className="absolute right-2 top-2">
                          {teamMembers.length > teamSizeMin && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeTeamMember(index)}
                              className="h-6 w-6 p-0"
                            >
                              <X className="h-4 w-4" />
                              <span className="sr-only">Remove</span>
                            </Button>
                          )}
                        </div>

                        <h4 className="font-medium">Member {index + 2}</h4>

                        <div className="space-y-2">
                          <Label htmlFor={`member-${index}-name`}>Name</Label>
                          <Input
                            id={`member-${index}-name`}
                            value={member.name}
                            onChange={(e) =>
                              updateTeamMember(index, "name", e.target.value)
                            }
                            placeholder="Enter name"
                          />
                          {errors[`member${index}Name`] && (
                            <p className="text-sm text-red-500">
                              {errors[`member${index}Name`]}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`member-${index}-email`}>Email</Label>
                          <Input
                            id={`member-${index}-email`}
                            type="email"
                            value={member.email}
                            onChange={(e) =>
                              updateTeamMember(index, "email", e.target.value)
                            }
                            placeholder="Enter email"
                          />
                          {errors[`member${index}Email`] && (
                            <p className="text-sm text-red-500">
                              {errors[`member${index}Email`]}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`member-${index}-phone`}>Phone</Label>
                          <Input
                            id={`member-${index}-phone`}
                            value={member.phone}
                            onChange={(e) =>
                              updateTeamMember(index, "phone", e.target.value)
                            }
                            placeholder="Enter phone number"
                          />
                          {errors[`member${index}Phone`] && (
                            <p className="text-sm text-red-500">
                              {errors[`member${index}Phone`]}
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
              <Button onClick={handleSubmit}>Continue</Button>
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
                    <p>{teamName}</p>
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
                    {teamMembers.map((member, index) => (
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
              <Button onClick={handleConfirm}>Confirm Registration</Button>
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
                    ? `Team "${teamName}" has been successfully registered. We've sent confirmation emails to all team members.`
                    : "You have been successfully registered for this event. We've sent a confirmation email with the details."}
                </AlertDescription>
              </Alert>
            </div>

            <DialogFooter>
              <Button onClick={handleClose}>Close</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
