"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CountryCodeSelect } from "@/components/country-code-select";
import {
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Building2,
  User,
} from "lucide-react";
import Link from "next/link";
import Headerauth from "@/components/Headerauth";
import Image from "next/image";
import image1 from "../../media/artwork.png";

import {
  randomNames,
  randomCompanies,
  generateRandomEmail,
  generateRandomPhone,
  generateRandomNationalId,
  generateRandomCR,
  getRandomItem,
  createMockFile,
} from "@/utils/random-data";
import SignupWizard from "@/components/SignupWizard";
import Navbarlanding from "@/components/Navbarladning";
import Background from "@/components/animations/Background";
import PageTransitionWrapper from "@/components/animations/PageTransitionWrapper";

type AccountType = "individual" | "business" | null;

export default function SignupPage() {
  return (
    <PageTransitionWrapper>
      <div className="min-h-screen p-0 bg-gray-50/30">
        <Navbarlanding />
        <Background />
        <div className="flex justify-center items-center h-full p-0">
          <div className="min-h-screen flex  items-center justify-center px-4 py-16">
            <SignupWizard />
          </div>
        </div>
      </div>
    </PageTransitionWrapper>
  );
}
