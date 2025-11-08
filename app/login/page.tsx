// app/login/page.tsx (server component)
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import LoginForm from "@/components/LoginForm";
import NavbarLanding from "@/components/Navbarladning";

export const metadata: Metadata = {
  title: "Log In",
};

export default function LoginPage() {
  return (
    <>
      {/* Preload Images */}
      <link
        rel="preload"
        as="image"
        href="https://d22po4pjz3o32e.cloudfront.net/logo-image.svg"
      />
      <link
        rel="preload"
        as="image"
        href="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
      />

      <section id="tender" className="relative min-h-screen">
        <div className="grid min-h-screen grid-cols-1 overflow-auto">
          <NavbarLanding />

          {/* Login Form Section */}
          <div className="flex items-center justify-center px-[5vw] pb-16 pt-20 md:pb-20 md:pt-24 lg:py-20">
            <div className="mx-auto w-full max-w-sm">
              <div className="mb-6 text-center md:mb-8">
                <h1 className="mb-5 text-3xl font-bold md:mb-6 md:text-4xl">
                  Log In
                </h1>
                <p className="text-sm md:text-base">
                  Welcome back! Enter your email and password to access your
                  account.
                </p>
              </div>

              {/* Client-side Login Form */}
              <LoginForm />
            </div>
          </div>

          {/* Footer */}
          <footer className="absolute bottom-0 left-0 right-0 flex h-16 w-full items-center justify-center px-[5%] text-sm md:h-18 lg:justify-start">
            <p>© 2024 tender</p>
          </footer>
        </div>
      </section>
    </>
  );
}
