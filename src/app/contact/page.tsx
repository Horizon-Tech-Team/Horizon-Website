// filepath: src/app/contact/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Building,
  Globe,
  Instagram,
  X,
} from "lucide-react";

// EmailJS (modern SDK)
import emailjs from "@emailjs/browser";
emailjs.init("EcxJTjEybx6uUcoSF"); // your public key (kept as-is from your original code)

/* ----------------------
   Types
   ---------------------- */
type TabType = "general" | "sponsorship" | "media";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/* ----------------------
   Helpers
   ---------------------- */
function safeStringifyUnknown(u: unknown): string {
  try {
    if (typeof u === "string") return u;
    return JSON.stringify(u);
  } catch {
    return String(u);
  }
}

function extractErrorMessage(u: unknown): string | null {
  if (!u || typeof u !== "object") return null;
  // attempt to extract common fields
  const maybe = u as Record<string, unknown>;
  if (typeof maybe.error === "string") return maybe.error;
  if (typeof maybe.message === "string") return maybe.message;
  if (typeof maybe.status === "string") return maybe.status;
  return null;
}

/* ----------------------
   Component
   ---------------------- */
export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("general");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  // Robust debug submit (tries SDK send, then fallback to REST)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    const templateParams = {
      form_type: "contact_form",
      category: activeTab,
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
    };

    console.log("DEBUG: About to send EmailJS payload:", templateParams);

    // 1) Try SDK send (fast path)
    try {
      const sdkRes = await emailjs.send(
        "service_tgfooqj",
        "template_tqq02al",
        templateParams
      );
      console.log("DEBUG: emailjs.send() resolved:", sdkRes);

      setSuccessMessage("Your message has been sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitting(false);
      return;
    } catch (sdkErr) {
      // SDK failed; fall back to REST to see full error
      console.warn(
        "DEBUG: emailjs.send() failed, falling back to REST. SDK error:",
        sdkErr
      );
    }

    // 2) Fallback: call EmailJS REST API
    try {
      const restBody = {
        service_id: "service_2hp27f4",
        template_id: "template_tqq02al",
        user_id: "EcxJTjEybx6uUcoSF", // public key
        template_params: templateParams,
      };

      console.log("DEBUG: Sending direct REST request to EmailJS:", restBody);

      const restRes = await fetch(
        "https://api.emailjs.com/api/v1.0/email/send",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(restBody),
        }
      );

      const text = await restRes.text();
      let parsed: unknown = text;
      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = text;
      }

      console.log(
        "DEBUG: EmailJS REST response status:",
        restRes.status,
        "body:",
        parsed
      );

      if (restRes.ok) {
        setSuccessMessage("Your message has been sent successfully!");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        const msg =
          extractErrorMessage(parsed) ??
          safeStringifyUnknown(parsed).slice(0, 300);
        console.error("DEBUG: EmailJS REST error body:", parsed);
        setErrorMessage(`Failed to send: ${msg}`);
      }
    } catch (restErr: unknown) {
      console.error("DEBUG: REST call failed:", restErr);
      const errStr = safeStringifyUnknown(restErr);
      setErrorMessage(
        `Failed to send message — network error (${errStr.slice(0, 200)})`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-7xl mx-auto py-6 md:py-8 px-4 md:px-6">
      {/* Hero Section */}
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4">
          Contact Us
        </h1>
        <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Have questions about Horizon Tech Fest 2025? We&apos;re here to help!
          Reach out to our team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
        {/* Contact Information */}
        <div className="lg:col-span-1 space-y-4 md:space-y-6">
          <Card>
            <CardHeader className="pb-2 md:pb-4">
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Reach out to us through these channels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-6 w-6 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium">Email</h3>
                  <a
                    href="mailto:horizonfest9@gmail.com"
                    className="text-sm text-primary hover:underline block"
                  >
                    horizonfest9@gmail.com
                  </a>

                  <a
                    href="mailto:techteam.horizon@gmail.com"
                    className="text-sm text-primary hover:underline block"
                  >
                    techteam.horizon@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-6 w-6 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium">Phone</h3>
                  <a
                    href="tel:+918097670761"
                    className="text-sm text-primary hover:underline"
                  >
                    +91 8097670761
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-6 w-6 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium">Location</h3>
                  <p className="text-sm text-muted-foreground">
                    Kirti M. Doongursee College of Arts, Science and Commerce
                    <br />
                    Kashinath Dhuru Road, Off. Veer Savarkar Marg, Dadar(W),
                    Mumbai, Maharashtra
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 md:pb-4">
              <CardTitle>Follow Us</CardTitle>
              <CardDescription>Stay connected on social media</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 justify-center">
                <Button size="icon" variant="outline" asChild>
                  <a
                    href={`https://instagram.com/horizonfest.kirti`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Instagram className="h-5 w-5" />
                    <span className="sr-only">instagram</span>
                  </a>
                </Button>
                <Button size="icon" variant="outline" asChild>
                  <a
                    href={`https://x.com/horizon_fest`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <X className="h-5 w-5" />
                    <span className="sr-only">X</span>
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Tabs
            value={activeTab}
            onValueChange={(v: string) => setActiveTab(v as TabType)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 mb-4 md:mb-6">
              <TabsTrigger value="general" className="text-xs md:text-sm">
                <MessageSquare className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">General</span> Inquiry
              </TabsTrigger>
              <TabsTrigger value="sponsorship" className="text-xs md:text-sm">
                <Building className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                Sponsorship
              </TabsTrigger>
              <TabsTrigger value="media" className="text-xs md:text-sm">
                <Globe className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                Media
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <Card>
                <CardHeader className="pb-2 md:pb-4">
                  <CardTitle>Send Us a Message</CardTitle>
                  <CardDescription>
                    We&apos;ll get back to you as soon as possible
                  </CardDescription>
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Your Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        className="w-full min-h-[120px] md:min-h-[150px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        "Sending..."
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="sponsorship">
              <Card>
                <CardHeader className="pb-2 md:pb-4">
                  <CardTitle>Sponsorship Opportunities</CardTitle>
                  <CardDescription>
                    Interested in sponsoring Horizon Tech Fest 2025?
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-4">
                    {successMessage && (
                      <Alert className="bg-green-50 text-green-800 border-green-200">
                        <AlertDescription>{successMessage}</AlertDescription>
                      </Alert>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Your Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Company Name</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Sponsorship Interest</Label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        placeholder="Please tell us about your company and your sponsorship interests."
                        className="w-full min-h-[120px] md:min-h-[150px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        "Sending..."
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Submit Sponsorship Inquiry
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="media">
              <Card>
                <CardHeader className="pb-2 md:pb-4">
                  <CardTitle>Media Inquiries</CardTitle>
                  <CardDescription>
                    For press and media related questions
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-4">
                    {successMessage && (
                      <Alert className="bg-green-50 text-green-800 border-green-200">
                        <AlertDescription>{successMessage}</AlertDescription>
                      </Alert>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Your Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Media Outlet</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Inquiry Details</Label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        placeholder="Please provide details about your media inquiry or interview request."
                        className="w-full min-h-[120px] md:min-h-[150px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        "Sending..."
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Submit Media Inquiry
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Map Section */}
      <div className="mb-12 md:mb-16">
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
          Event Location
        </h2>
        <div className="rounded-xl overflow-hidden h-[250px] sm:h-[300px] md:h-[400px] relative">
          <iframe
            src="https://www.google.com/maps?q=Kirti+M.+Doongursee+College+of+Arts,+Science+and+Commerce,+2RCJ%2B8FR,+Kashinath+Dhuru+Road,+Off.+Veer+Savarkar+Marg,+Dadar+West,+Dadar(W),+Mumbai,+Maharashtra+400028&output=embed"
            className="w-full h-full border-0 rounded-xl min-h-[250px]"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-background/90 p-4 sm:p-6 rounded-lg max-w-xs sm:max-w-md text-center">
              <h3 className="font-bold text-lg md:text-xl mb-2">
                Kirti M. Doongursee College of Arts, Science and Commerce
              </h3>
              <p className="text-muted-foreground mb-4">
                Kashinath Dhuru Road, Off. Veer Savarkar Marg, Dadar(W), Mumbai,
                Maharashtra
              </p>
              <Button variant="outline" asChild>
                <a
                  href="https://maps.app.goo.gl/cLf7FGAbQMxfPpys5"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Get Directions
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div id="FAQ" className="mb-12 md:mb-16">
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
          Frequently Asked Questions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {[
            {
              question: "When and where is Horizon Tech Fest 2025?",
              answer:
                "Horizon Tech Fest 2026 will be held on 6th and 7th January 2026, from 10:00 AM to 4:00 PM, at our campus grounds.",
            },
            {
              question: "How can I register for events?",
              answer:
                "You can register for individual or group events through our official website www.horizonfest.in. Each event will have its own registration form and guidelines. Make sure to register early —limited slots are available!",
            },
            {
              question: "Are there opportunities for sponsorship?",
              answer:
                "Yes! Horizon Tech Fest 2026 offers multiple sponsorship packages for organizations looking to collaborate or promote their brand. Please reach out to us via the Sponsorship section on our website or the marketing head. SANIKA LAD : +91 93264 91719",
            },
            {
              question: "Can I volunteer at the event?",
              answer:
                "Absolutely! We’re always looking for enthusiastic volunteers to be part of the Horizon Team. To apply as a volunteer, email us at: horizonfest9@gmail.com",
            },
          ].map((faq, index) => (
            <Card key={index}>
              <CardHeader className="pb-2 md:pb-4">
                <CardTitle className="text-base md:text-lg">
                  {faq.question}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm md:text-base">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary/10 rounded-xl p-4 sm:p-6 md:p-8 text-center">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 md:mb-4">
          Ready to Join Horizon Tech Fest 2025?
        </h2>
        <p className="text-base md:text-lg mb-4 md:mb-6 max-w-2xl mx-auto">
          Don&apos;t miss out on the most exciting tech event of the year.
          Register now to secure your spot!
        </p>
        <Button size="lg" asChild>
          <Link href="/events">Browse Events</Link>
        </Button>
      </div>
    </div>
  );
}
