import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Shield,
  Search,
  Users,
  Zap,
  Globe,
  Lock,
  ArrowRight,
  Building2,
  Home,
  Banknote,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-sm">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">
              TenderHub Qatar
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium scroll-smooth"
            >
              Features
            </a>
            <a
              href="#process"
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium scroll-smooth"
            >
              Process
            </a>
            <a
              href="#pricing"
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium scroll-smooth"
            >
              Pricing
            </a>

            <Link href="/admin-dashboard">
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-gray-900"
              >
                <LayoutDashboard className="h-5 w-5 mr-2" />
                Admin
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-emerald-600 hover:bg-emerald-700 shadow-sm">
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-8 bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 px-4 py-2">
              🇶🇦 Qatar's Trusted Tendering Platform
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-[1.1] tracking-tight">
              Every Project Size,
              <br />
              <span className="text-emerald-600">One Platform</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-2xl mx-auto">
              Connect opportunities from 200 QAR home repairs to 200 million QAR
              developments. Transparent bidding with verified providers and full
              Qatar compliance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700 shadow-sm px-8 py-4 text-base"
                >
                  Post Your Project
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-4 text-base shadow-sm bg-white"
                >
                  Browse Opportunities
                </Button>
              </Link>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="flex items-center justify-center space-x-3 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <Home className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-gray-900">
                    200 QAR
                  </div>
                  <div className="text-sm text-gray-600">Minimum project</div>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-3 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-gray-900">
                    200M QAR
                  </div>
                  <div className="text-sm text-gray-600">Maximum project</div>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-3 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                  <Banknote className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-gray-900">
                    100 QAR
                  </div>
                  <div className="text-sm text-gray-600">Per verified bid</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Built for Qatar's Standards
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Every feature designed with local compliance, security, and
              transparency at its core
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 bg-white">
              <CardHeader className="p-8">
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
                  <Shield className="h-7 w-7 text-emerald-600" />
                </div>
                <CardTitle className="text-xl mb-3">Qatar KYC/AML</CardTitle>
                <p className="text-gray-600 leading-relaxed">
                  Full compliance with Qatar Central Bank regulations and
                  mandatory identity verification for all users
                </p>
              </CardHeader>
            </Card>

            <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 bg-white">
              <CardHeader className="p-8">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                  <Search className="h-7 w-7 text-blue-600" />
                </div>
                <CardTitle className="text-xl mb-3">
                  AI-Powered Matching
                </CardTitle>
                <p className="text-gray-600 leading-relaxed">
                  Intelligent algorithms connect projects with qualified
                  providers based on expertise and track record
                </p>
              </CardHeader>
            </Card>

            <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 bg-white">
              <CardHeader className="p-8">
                <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6">
                  <Lock className="h-7 w-7 text-purple-600" />
                </div>
                <CardTitle className="text-xl mb-3">
                  Secure Communications
                </CardTitle>
                <p className="text-gray-600 leading-relaxed">
                  Protected messaging with masked contact details until project
                  award for complete privacy
                </p>
              </CardHeader>
            </Card>

            <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 bg-white">
              <CardHeader className="p-8">
                <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mb-6">
                  <Globe className="h-7 w-7 text-orange-600" />
                </div>
                <CardTitle className="text-xl mb-3">Native Bilingual</CardTitle>
                <p className="text-gray-600 leading-relaxed">
                  Seamless Arabic and English interface designed for Qatar's
                  diverse business community
                </p>
              </CardHeader>
            </Card>

            <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 bg-white">
              <CardHeader className="p-8">
                <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6">
                  <Users className="h-7 w-7 text-green-600" />
                </div>
                <CardTitle className="text-xl mb-3">
                  Verified Providers
                </CardTitle>
                <p className="text-gray-600 leading-relaxed">
                  Rigorous verification process ensures only qualified, licensed
                  providers can submit bids
                </p>
              </CardHeader>
            </Card>

            <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 bg-white">
              <CardHeader className="p-8">
                <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
                  <Zap className="h-7 w-7 text-red-600" />
                </div>
                <CardTitle className="text-xl mb-3">
                  Full Transparency
                </CardTitle>
                <p className="text-gray-600 leading-relaxed">
                  Complete visibility into bidding process, timelines, and
                  project milestones from start to finish
                </p>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Simple. Secure. Transparent.
            </h2>
            <p className="text-xl text-gray-600">
              Three steps to connect your project with verified providers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                <span className="text-white font-bold text-2xl">1</span>
              </div>
              <h3 className="text-2xl font-semibold mb-6 text-gray-900">
                Post Your Project
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Create a detailed listing with requirements, budget, and
                timeline. Our AI optimizes your posting for better provider
                matches.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                <span className="text-white font-bold text-2xl">2</span>
              </div>
              <h3 className="text-2xl font-semibold mb-6 text-gray-900">
                Review Quality Bids
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Verified providers invest 100 QAR per bid, ensuring serious,
                detailed proposals. All communication stays secure and private.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                <span className="text-white font-bold text-2xl">3</span>
              </div>
              <h3 className="text-2xl font-semibold mb-6 text-gray-900">
                Award & Execute
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Select your preferred provider and contact details are revealed.
                Track progress with complete transparency throughout.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              No hidden fees. No surprises. Pay only when you're ready to bid.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-2 border-gray-100 shadow-sm bg-white p-8">
              <CardHeader className="text-center p-0 mb-8">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Building2 className="h-8 w-8 text-emerald-600" />
                </div>
                <CardTitle className="text-2xl mb-4">Project Owners</CardTitle>
                <div className="text-5xl font-bold text-emerald-600 mb-2">
                  FREE
                </div>
                <p className="text-gray-600">Post unlimited opportunities</p>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald-600 mr-4 flex-shrink-0" />
                    <span className="text-gray-700">
                      Unlimited project postings
                    </span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald-600 mr-4 flex-shrink-0" />
                    <span className="text-gray-700">
                      AI-powered provider matching
                    </span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald-600 mr-4 flex-shrink-0" />
                    <span className="text-gray-700">
                      Secure messaging platform
                    </span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald-600 mr-4 flex-shrink-0" />
                    <span className="text-gray-700">
                      Complete transparency tools
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-emerald-200 shadow-sm bg-gradient-to-b from-emerald-50 to-white p-8 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-emerald-600 text-white px-4 py-2 shadow-sm">
                  Quality Guaranteed
                </Badge>
              </div>
              <CardHeader className="text-center p-0 mb-8">
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-emerald-600" />
                </div>
                <CardTitle className="text-2xl mb-4">
                  Service Providers
                </CardTitle>
                <div className="text-5xl font-bold text-emerald-600 mb-2">
                  100 QAR
                </div>
                <p className="text-gray-600">Per verified bid submission</p>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald-600 mr-4 flex-shrink-0" />
                    <span className="text-gray-700">
                      Submit detailed proposals
                    </span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald-600 mr-4 flex-shrink-0" />
                    <span className="text-gray-700">
                      Access to all opportunities
                    </span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald-600 mr-4 flex-shrink-0" />
                    <span className="text-gray-700">
                      Verified provider badge
                    </span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald-600 mr-4 flex-shrink-0" />
                    <span className="text-gray-700">
                      Direct client communication
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-emerald-100 mb-12 max-w-2xl mx-auto">
            Join Qatar's most trusted tendering platform and connect with
            verified opportunities today.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/signup">
              <Button
                size="lg"
                variant="secondary"
                className="px-8 py-4 text-base shadow-sm bg-white text-gray-900 hover:bg-gray-50"
              >
                Post Your First Project
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-4 text-base border-2 border-white text-white hover:bg-white hover:text-emerald-600 bg-transparent"
              >
                Become a Provider
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-semibold">TenderHub Qatar</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Qatar's premier bilingual tendering marketplace connecting
                projects of all sizes with verified providers.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-6 text-white">Platform</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Security
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Compliance
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-6 text-white">Support</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-6 text-white">Language</h4>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TenderHub Qatar. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
