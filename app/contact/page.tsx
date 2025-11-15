"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Phone, Check, Loader2 } from "lucide-react";
import NavbarLanding from "@/components/Navbarladning";
import Footer from "@/components/Footer";
import Background from "@/components/animations/Background";
import ReCAPTCHA from "react-google-recaptcha";

// Zod Schema
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  // _honeypot and captchaToken are not validated by zod here (sent as extra fields)
});

type FormData = z.infer<typeof formSchema>;

export default function Home() {
  const recaptchaRef = useRef<any>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const handleCaptcha = (token: string | null) => {
    setCaptchaToken(token);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setShowSuccess(false);
    setShowError(false);

    if (!captchaToken) {
      setShowError(true);
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          captchaToken,
          _honeypot: "", // keep honeypot empty
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setShowError(true);
        console.error("Contact API error:", json);
        return;
      }

      setShowSuccess(true);
      reset();
      // reset reCAPTCHA
      recaptchaRef.current?.reset();
      setCaptchaToken(null);

      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      console.error("Send error:", error);
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <NavbarLanding />
      <Background />

      <section className="px-5 md:px-10 py-20 md:py-24 lg:py-48">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 md:grid-cols-2 md:gap-16 lg:gap-20">
            {/* Left */}
            <div>
              <p className="mb-2 text-sm font-medium uppercase tracking-widest text-gray-500">
                Get in Touch
              </p>
              <h1 className="mb-4 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
                Contact us
              </h1>
              <p className="mb-8 text-gray-600">
                We’d love to hear from you. Send us a message and we’ll respond
                as soon as possible.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-700">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <span className="text-sm md:text-base">
                    support@gotenderly.com
                  </span>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <span className="text-sm md:text-base">+974 1234 5678</span>
                </div>
              </div>
            </div>

            {/* Right – Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Honeypot (hidden) */}
              <input
                type="text"
                {...register("_honeypot" as any)}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                defaultValue=""
                readOnly
              />

              <div>
                <label
                  htmlFor="name"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  {...register("name")}
                  id="name"
                  type="text"
                  className="w-full rounded border-b border-gray-300 px-4 py-3 pb-5 text-sm focus:outline-none"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  {...register("email")}
                  id="email"
                  type="email"
                  className="w-full rounded border-b border-gray-300 px-4 py-3 pb-5 text-sm focus:outline-none"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Message
                </label>
                <textarea
                  {...register("message")}
                  id="message"
                  rows={5}
                  placeholder="Your message..."
                  className="w-full rounded border-b border-gray-300 px-4 py-3 pb-5 text-sm focus:outline-none resize-none"
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.message.message}
                  </p>
                )}
              </div>

              {/* reCAPTCHA */}
              <div className="flex justify-center">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                  onChange={handleCaptcha}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !captchaToken}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </button>

              {/* Toast Notifications */}
              {showSuccess && (
                <div className="flex items-center gap-2 rounded-md bg-green-50 p-3 text-sm text-green-800">
                  <Check className="h-4 w-4" />
                  Message sent successfully!
                </div>
              )}
              {showError && (
                <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-800">
                  Failed to send. Please try again.
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
