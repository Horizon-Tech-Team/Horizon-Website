// filepath: src/app/feedback/page.tsx
"use client";

import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Star, Send } from "lucide-react";

interface FeedbackForm {
  name: string;
  email: string;
  category: string;
  rating: number;
  message: string;
}

const SHEET_API_URL =
  process.env.NEXT_PUBLIC_SHEET_API_URL ??
  "https://api.sheetmonkey.io/form/kBYAXKPed4VUtp9XBSkhgt";

/* ---------------------
   Helpers
   --------------------- */
function safeStringifyUnknown(u: unknown): string {
  try {
    if (typeof u === "string") return u;
    return JSON.stringify(u);
  } catch {
    try {
      return String(u);
    } catch {
      return "Unknown error";
    }
  }
}

function extractErrorMessage(u: unknown): string | null {
  if (!u || typeof u !== "object") return null;
  const maybe = u as Record<string, unknown>;
  if (typeof maybe.error === "string") return maybe.error;
  if (typeof maybe.message === "string") return maybe.message;
  if (typeof maybe.detail === "string") return maybe.detail;
  return null;
}

/* ---------------------
   Component
   --------------------- */
export default function FeedbackPage() {
  const [formData, setFormData] = useState<FeedbackForm>({
    name: "",
    email: "",
    category: "general",
    rating: 5,
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRating = (value: number) => {
    setFormData((prev) => ({ ...prev, rating: value }));
  };

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // small fetch helper with timeout
  const fetchWithTimeout = (
    url: string,
    opts: RequestInit = {},
    timeout = 8000
  ): Promise<Response> =>
    new Promise<Response>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("Request timed out")), timeout);
      fetch(url, opts)
        .then((res) => {
          clearTimeout(timer);
          resolve(res);
        })
        .catch((err) => {
          clearTimeout(timer);
          reject(err);
        });
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    // Basic required validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage("Please fill in your name, email and feedback message.");
      setIsSubmitting(false);
      return;
    }

    if (!isValidEmail(formData.email.trim())) {
      setErrorMessage("Please enter a valid email address.");
      setIsSubmitting(false);
      return;
    }

    // Validate SHEET API URL
    if (!SHEET_API_URL || SHEET_API_URL.includes("REPLACE_WITH_YOUR_SHEET_API_URL")) {
      setErrorMessage("Sheet API URL not configured. Set NEXT_PUBLIC_SHEET_API_URL in your environment.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Payload shape - SheetMonkey accepts JSON key/value
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        category: formData.category,
        rating: formData.rating,
        message: formData.message.trim(),
        submittedAt: new Date().toISOString(),
      };

      console.log("Sending feedback to sheet:", payload);

      const res = await fetchWithTimeout(
        SHEET_API_URL,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
        10000 // 10s timeout
      );

      if (!res.ok) {
        const text = await res.text().catch(() => "<no response body>");
        console.error("Sheet API error:", res.status, text);

        // Try extract JSON if possible
        let parsed: unknown = text;
        try {
          parsed = JSON.parse(text);
        } catch {
          parsed = text;
        }

        const extracted = extractErrorMessage(parsed) ?? safeStringifyUnknown(parsed);
        throw new Error(`Sheet API returned ${res.status}: ${extracted}`);
      }

      // success
      setSuccessMessage("Thanks — your feedback has been recorded.");
      setFormData({ name: "", email: "", category: "general", rating: 5, message: "" });
    } catch (err: unknown) {
      console.error("Feedback submit failed:", err);
      const msg = extractErrorMessage(err) ?? safeStringifyUnknown(err);
      setErrorMessage(msg || "Failed to submit feedback. Try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Feedback</h1>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          Help us improve Horizon Tech Fest — your name and email are required so we can follow up.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="shadow-lg border border-transparent">
          <CardHeader className="pb-2">
            <CardTitle>Send Feedback</CardTitle>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {successMessage && (
                <Alert className="bg-green-50 text-green-800 border-green-200">
                  <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
              )}

              {errorMessage && (
                <Alert variant="destructive">
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleSelectChange}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="general">General</option>
                    <option value="website">Website</option>
                    <option value="events">Events / Scheduling</option>
                    <option value="volunteer">Volunteer Experience</option>
                    <option value="sponsorship">Sponsorship</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Rating</Label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => handleRating(n)}
                        className={`p-2 rounded-md border ${formData.rating >= n ? "bg-primary/80 border-primary" : "bg-transparent border-muted"}`}
                        aria-label={`${n} star`}
                      >
                        <Star className="h-5 w-5" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Feedback</Label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  placeholder="Tell us exactly what happened, where, and how we can improve."
                  className="w-full min-h-[140px] md:min-h-[180px] rounded-md border border-input bg-background px-3 py-3 text-sm"
                />
              </div>

              <div className="text-xs text-muted-foreground">
                By submitting you agree that we may use anonymized excerpts of your feedback for promotional or improvement purposes.
              </div>
            </CardContent>

            <CardFooter>
              <div className="w-full">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-95 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Feedback
                    </>
                  )}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
