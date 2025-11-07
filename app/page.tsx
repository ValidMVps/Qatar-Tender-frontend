"use client";

import React, { useState, useEffect } from "react";

const QatarTenderPlatform = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      title: "Fragmented vendors",
      description:
        "Vendors are scattered across different platforms and locations. Finding the right match requires extensive research.",
    },
    {
      title: "Unclear requirements",
      description: "Vague specs lead to wrong quotes and rework.",
    },
    {
      title: "Time-consuming process",
      description: "Repeating the same brief to each vendor takes time.",
    },
  ];

  const outcomes = [
    {
      title: "Reach many bidders",
      description:
        "Post once and instantly connect with multiple qualified suppliers. No more endless phone calls.",
    },
    {
      title: "Built-in Q/A",
      description: "Use built-in Q/A to clarify missing details before award.",
    },
    {
      title: "Compare apples-to-apples",
      description: "Compare apples-to-apples (price, ETA, notes) in one view.",
    },
  ];

  const bidderFeatures = [
    {
      title: "Vague specs",
      description: "Specs are vague; quoting feels risky or time-wasting.",
    },
    {
      title: "Unqualified leads",
      description: "Hard to find real, ready buyers; leads aren’t qualified.",
    },
    {
      title: "Disorganized negotiations",
      description: "Negotiations spread across calls/emails and get lost.",
    },
  ];

  const bidderOutcomes = [
    {
      title: "Clarify specs",
      description:
        "Ask and answer questions publicly to understand project requirements fully.",
    },
    {
      title: "Clear requirements",
      description:
        "See all required fields up front; submit a clear, competitive bid.",
    },
    {
      title: "Private negotiations",
      description:
        "Keep negotiations in one private thread; get awarded faster.",
    },
  ];

  const testimonials = [
    {
      quote:
        "Tenderly transformed our procurement process from weeks of back-and-forth to a streamlined, transparent experience.",
      author: "Mohammed Al-Thani",
      role: "Procurement Manager, Gulf Enterprises",
      logo: "https://d22po4pjz3o32e.cloudfront.net/webflow-logo.svg",
    },
    {
      quote:
        "The platform has saved us countless hours and helped us find better suppliers at competitive prices.",
      author: "Fatima Al-Kuwari",
      role: "Operations Director, Doha Logistics",
      logo: "https://d22po4pjz3o32e.cloudfront.net/webflow-logo.svg",
    },
  ];

  const faqs = [
    {
      question: "How does the tender process work?",
      answer:
        "The tender process involves posting your project requirements, receiving bids from suppliers, and awarding the contract to the most suitable bidder.",
    },
    {
      question: "Is my information kept confidential?",
      answer:
        "Yes, your identity remains anonymous until you choose to award the contract.",
    },
    {
      question: "Are there any fees to use the platform?",
      answer:
        "Posting tenders is completely free. There are no fees for either tenderers or bidders.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header
        className={`sticky top-0 z-50 flex min-h-16 w-full items-center border-b transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md border-gray-200"
            : "bg-white/80 backdrop-blur-sm border-transparent"
        } px-4 md:px-6 lg:px-[5%]`}
      >
        <div className="mx-auto flex size-full items-center justify-between">
          <a href="#" className="relative z-50">
            <img
              src="https://d22po4pjz3o32e.cloudfront.net/logo-image.svg"
              alt="Relume placeholder logo"
              className="h-auto w-auto max-h-10"
            />
          </a>
          <div
            className={`hidden lg:flex lg:items-center lg:justify-center lg:overflow-hidden lg:px-0 lg:text-center transition-all duration-300 ${
              isMenuOpen ? "opacity-100" : "opacity-100"
            }`}
          >
            <a
              href="#"
              className="block py-3 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors px-4"
            >
              Services
            </a>
            <a
              href="#"
              className="block py-3 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors px-4"
            >
              About
            </a>
            <a
              href="#"
              className="block py-3 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors px-4"
            >
              Blog
            </a>
            <nav>
              <button className="flex w-full items-center justify-center gap-4 py-3 text-center text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors px-4">
                <span>More</span>
                <span>
                  <svg
                    stroke="currentColor"
                    fill="none"
                    stroke-width="0"
                    viewBox="0 0 15 15"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </span>
              </button>
            </nav>
          </div>
          <div className="relative z-50 flex items-center justify-center gap-2 lg:gap-4">
            <button
              className="-mr-2 flex size-12 flex-col items-center justify-center justify-self-end lg:mr-0"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="relative flex size-6 flex-col items-center justify-center">
                <span
                  className={`absolute top-[3px] h-0.5 w-full bg-gray-900 transition-all duration-300 ${
                    isMenuOpen ? "rotate-45 translate-y-1.5" : "rotate-0"
                  }`}
                ></span>
                <span
                  className={`absolute h-0.5 w-full bg-gray-900 transition-all duration-300 ${
                    isMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                ></span>
                <span
                  className={`absolute h-0.5 w-full bg-gray-900 transition-all duration-300 ${
                    isMenuOpen ? "-rotate-45 -translate-y-1.5" : "rotate-0"
                  }`}
                ></span>
                <span
                  className={`absolute bottom-[3px] h-0.5 w-full bg-gray-900 transition-all duration-300 ${
                    isMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                ></span>
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-[5%] py-12 md:py-16 lg:py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto">
          <div className="grid auto-cols-fr grid-cols-1 border border-gray-200 rounded-2xl overflow-hidden lg:grid-cols-2">
            <div className="flex flex-col justify-center p-8 md:p-12 bg-white">
              <h1 className="mb-5 text-4xl font-bold text-gray-900 md:mb-6 md:text-5xl lg:text-6xl transition-all duration-500 hover:scale-[1.02]">
                Post once. Get multiple quotes.
              </h1>
              <p className="text-gray-700 mb-4 text-lg">
                A centralized tender marketplace for individuals and
                businesses—describe, bidders reply instantly, you compare,
                negotiate, and award.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
                <button className="focus:ring-blue-500 inline-flex gap-3 items-center justify-center whitespace-nowrap ring-offset-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-transparent bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-gray-800 hover:shadow-lg transform hover:-translate-y-0.5">
                  Post your tender for free
                </button>
                <button className="focus:ring-blue-500 inline-flex gap-3 items-center justify-center whitespace-nowrap ring-offset-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-300 text-gray-900 bg-white px-6 py-3 rounded-xl hover:bg-gray-50 hover:shadow-md">
                  Browse open tenders
                </button>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p>Anonymous until award • No fees • Takes ~2 minutes</p>
              </div>
            </div>
            <div className="flex items-center justify-center bg-gray-50 p-8">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                className="w-full object-cover rounded-lg shadow-lg transition-transform duration-500 hover:scale-105"
                alt="Relume placeholder image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section: For tenderers - Problems */}
      <section className="px-[5%] py-16 md:py-24 lg:py-28 bg-white">
        <div className="container mx-auto">
          <div className="mx-auto mb-12 max-w-lg text-center md:mb-18 lg:mb-20">
            <p className="mb-3 font-semibold md:mb-4 text-blue-600 text-lg">
              Problems
            </p>
            <h1 className="mb-5 text-4xl font-bold text-gray-900 md:mb-6 md:text-5xl lg:text-6xl">
              For tenderers
            </h1>
            <p className="text-gray-700 text-lg">
              Hard to find all options; vendors are fragmented. Unclear
              requirements lead to wrong quotes and rework. Repeating the same
              brief to each vendor takes time.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 md:mt-8">
              <button className="focus:ring-blue-500 inline-flex gap-3 items-center justify-center whitespace-nowrap ring-offset-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-300 text-gray-900 bg-white px-6 py-3 rounded-xl hover:bg-gray-50 hover:shadow-md">
                Learn More
              </button>
              <button className="focus:ring-blue-500 inline-flex items-center justify-center whitespace-nowrap ring-offset-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-0 text-gray-900 gap-2 p-0 hover:text-blue-600">
                Get Started
                <svg
                  stroke="currentColor"
                  fill="none"
                  stroke-width="0"
                  viewBox="0 0 15 15"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 items-center gap-x-12 md:grid-cols-2 lg:gap-x-20">
            <div className="relative mb-8 grid auto-cols-fr grid-cols-1 grid-rows-[auto_auto] items-start md:mb-0 md:items-stretch">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`cursor-pointer border-b border-gray-200 py-6 transition-all duration-300 ${
                    activeTab === index
                      ? "opacity-100"
                      : "opacity-25 hover:opacity-75"
                  }`}
                  onClick={() => setActiveTab(index)}
                >
                  <h2 className="text-2xl font-bold text-gray-900 md:text-3xl md:leading-[1.3] lg:text-4xl">
                    {feature.title}
                  </h2>
                  <div
                    className={`overflow-hidden transition-all duration-500 ${
                      activeTab === index
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="mt-3 text-gray-700 md:mt-4">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex max-h-full w-full items-center justify-center overflow-hidden">
              <div style={{ opacity: 1 }}>
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                  alt="Relume placeholder image 1"
                  className="size-full object-cover rounded-lg shadow-lg transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section: For tenderers - Outcomes */}
      <section className="px-[5%] py-16 md:py-24 lg:py-28 bg-gray-50">
        <div className="container mx-auto">
          <div className="mx-auto mb-12 max-w-lg text-center md:mb-18 lg:mb-20">
            <p className="mb-3 font-semibold md:mb-4 text-green-600 text-lg">
              Outcomes with Tenderly
            </p>
            <h1 className="mb-5 text-4xl font-bold text-gray-900 md:mb-6 md:text-5xl lg:text-6xl">
              For tenderers
            </h1>
            <p className="text-gray-700 text-lg">
              Post once and reach many bidders at once. Use built-in Q/A to
              clarify missing details before award. Compare apples-to-apples
              (price, ETA, notes) in one view. Stay anonymous until award;
              choose the best fit faster.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 md:mt-8">
              <button className="focus:ring-blue-500 inline-flex gap-3 items-center justify-center whitespace-nowrap ring-offset-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-300 text-gray-900 bg-white px-6 py-3 rounded-xl hover:bg-gray-50 hover:shadow-md">
                Learn More
              </button>
              <button className="focus:ring-blue-500 inline-flex items-center justify-center whitespace-nowrap ring-offset-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-0 text-gray-900 gap-2 p-0 hover:text-blue-600">
                Get Started
                <svg
                  stroke="currentColor"
                  fill="none"
                  stroke-width="0"
                  viewBox="0 0 15 15"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 items-center gap-x-12 md:grid-cols-2 lg:gap-x-20">
            <div className="relative mb-8 grid auto-cols-fr grid-cols-1 grid-rows-[auto_auto] items-start md:mb-0 md:items-stretch">
              {outcomes.map((outcome, index) => (
                <div
                  key={index}
                  className={`cursor-pointer border-b border-gray-200 py-6 transition-all duration-300 ${
                    activeTab === index
                      ? "opacity-100"
                      : "opacity-25 hover:opacity-75"
                  }`}
                  onClick={() => setActiveTab(index)}
                >
                  <h2 className="text-2xl font-bold text-gray-900 md:text-3xl md:leading-[1.3] lg:text-4xl">
                    {outcome.title}
                  </h2>
                  <div
                    className={`overflow-hidden transition-all duration-500 ${
                      activeTab === index
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="mt-3 text-gray-700 md:mt-4">
                      {outcome.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex max-h-full w-full items-center justify-center overflow-hidden">
              <div style={{ opacity: 1 }}>
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                  alt="Relume placeholder image 1"
                  className="size-full object-cover rounded-lg shadow-lg transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section: For bidders - Problems */}
      <section className="px-[5%] py-16 md:py-24 lg:py-28 bg-white">
        <div className="container mx-auto">
          <div className="relative flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 md:pr-6 lg:pr-10">
              <div className="mb-8 md:hidden">
                <p className="mb-3 font-semibold md:mb-4 text-blue-600 text-lg">
                  Problems
                </p>
                <h1 className="mb-5 text-4xl font-bold text-gray-900 md:mb-6 md:text-5xl lg:text-6xl">
                  For bidders
                </h1>
                <p className="text-gray-700 text-lg">
                  Specs are vague; quoting feels risky or time-wasting. Hard to
                  find real, ready buyers; leads aren’t qualified. Negotiations
                  spread across calls/emails and get lost.
                </p>
              </div>
              <div
                className="relative flex size-full items-center justify-center"
                style={{ opacity: 1 }}
              >
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                  alt="Relume placeholder image 1"
                  className="mb-6 size-full md:mb-0 rounded-lg shadow-lg transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>
            <div className="w-full md:w-1/2 md:pl-6 lg:pl-10">
              <div className="mb-8 hidden md:block">
                <p className="mb-3 font-semibold md:mb-4 text-blue-600 text-lg">
                  Problems
                </p>
                <h1 className="mb-5 text-4xl font-bold text-gray-900 md:mb-6 md:text-5xl lg:text-6xl">
                  For bidders
                </h1>
                <p className="text-gray-700 text-lg">
                  Specs are vague; quoting feels risky or time-wasting. Hard to
                  find real, ready buyers; leads aren’t qualified. Negotiations
                  spread across calls/emails and get lost.
                </p>
              </div>
              <div className="static flex flex-col flex-wrap justify-stretch md:block">
                <div className="relative grid auto-cols-fr grid-cols-1 grid-rows-[auto_auto] items-start md:mb-0 md:items-stretch">
                  {bidderFeatures.map((feature, index) => (
                    <div
                      key={index}
                      className={`cursor-pointer border-b border-gray-200 py-4 transition-all duration-300 ${
                        activeTab === index
                          ? "opacity-100"
                          : "opacity-25 hover:opacity-75"
                      }`}
                      onClick={() => setActiveTab(index)}
                    >
                      <h2 className="text-xl font-bold text-gray-900 md:text-2xl">
                        {feature.title}
                      </h2>
                      <div
                        className={`overflow-hidden transition-all duration-500 ${
                          activeTab === index
                            ? "max-h-96 opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <p className="mt-2 text-gray-700">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
                <button className="focus:ring-blue-500 inline-flex gap-3 items-center justify-center whitespace-nowrap ring-offset-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-300 text-gray-900 bg-white px-6 py-3 rounded-xl hover:bg-gray-50 hover:shadow-md">
                  Learn More
                </button>
                <button className="focus:ring-blue-500 inline-flex items-center justify-center whitespace-nowrap ring-offset-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-0 text-gray-900 gap-2 p-0 hover:text-blue-600">
                  Get Started
                  <svg
                    stroke="currentColor"
                    fill="none"
                    stroke-width="0"
                    viewBox="0 0 15 15"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section: For bidders - Outcomes */}
      <section className="px-[5%] py-16 md:py-24 lg:py-28 bg-gray-50">
        <div className="container mx-auto">
          <div className="mx-auto mb-12 max-w-lg text-center md:mb-18 lg:mb-20">
            <p className="mb-3 font-semibold md:mb-4 text-green-600 text-lg">
              Outcomes with Tenderly
            </p>
            <h1 className="mb-5 text-4xl font-bold text-gray-900 md:mb-6 md:text-5xl lg:text-6xl">
              For bidders
            </h1>
            <p className="text-gray-700 text-lg">
              Ask/answer clarifying questions publicly on the tender. See all
              required fields up front; submit a clear, competitive bid. Keep
              negotiations in one private thread; get awarded faster.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 md:mt-8">
              <button className="focus:ring-blue-500 inline-flex gap-3 items-center justify-center whitespace-nowrap ring-offset-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-300 text-gray-900 bg-white px-6 py-3 rounded-xl hover:bg-gray-50 hover:shadow-md">
                Learn More
              </button>
              <button className="focus:ring-blue-500 inline-flex items-center justify-center whitespace-nowrap ring-offset-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-0 text-gray-900 gap-2 p-0 hover:text-blue-600">
                Get Started
                <svg
                  stroke="currentColor"
                  fill="none"
                  stroke-width="0"
                  viewBox="0 0 15 15"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 items-center gap-x-12 md:grid-cols-2 lg:gap-x-20">
            <div className="relative mb-8 grid auto-cols-fr grid-cols-1 grid-rows-[auto_auto] items-start md:mb-0 md:items-stretch">
              {bidderOutcomes.map((outcome, index) => (
                <div
                  key={index}
                  className={`cursor-pointer border-b border-gray-200 py-6 transition-all duration-300 ${
                    activeTab === index
                      ? "opacity-100"
                      : "opacity-25 hover:opacity-75"
                  }`}
                  onClick={() => setActiveTab(index)}
                >
                  <h2 className="text-2xl font-bold text-gray-900 md:text-3xl md:leading-[1.3] lg:text-4xl">
                    {outcome.title}
                  </h2>
                  <div
                    className={`overflow-hidden transition-all duration-500 ${
                      activeTab === index
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="mt-3 text-gray-700 md:mt-4">
                      {outcome.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex max-h-full w-full items-center justify-center overflow-hidden">
              <div style={{ opacity: 1 }}>
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                  alt="Relume placeholder image 1"
                  className="size-full object-cover rounded-lg shadow-lg transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-[5%] py-16 md:py-24 lg:py-28 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-[0.5fr_1fr] lg:items-center lg:gap-x-20">
            <div>
              <p className="mb-3 font-semibold md:mb-4 text-blue-600 text-lg">
                By the Numbers
              </p>
              <h2 className="mb-5 text-4xl font-bold text-gray-900 md:mb-6 md:text-5xl lg:text-6xl">
                Key Statistics
              </h2>
              <p className="text-gray-700 text-lg">
                Display key statistics such as the number of tenders posted, the
                number of suppliers registered, average time to receive bids,
                and user satisfaction rates to demonstrate the platform's
                success and reliability.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
                <button className="focus:ring-blue-500 inline-flex gap-3 items-center justify-center whitespace-nowrap ring-offset-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-300 text-gray-900 bg-white px-6 py-3 rounded-xl hover:bg-gray-50 hover:shadow-md">
                  Learn More
                </button>
                <button className="focus:ring-blue-500 inline-flex items-center justify-center whitespace-nowrap ring-offset-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-0 text-gray-900 gap-2 p-0 hover:text-blue-600">
                  Get Started
                  <svg
                    stroke="currentColor"
                    fill="none"
                    stroke-width="0"
                    viewBox="0 0 15 15"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-8 py-2 md:grid-cols-2">
              <div className="flex flex-col justify-center border border-gray-200 p-8 text-center rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                <p className="mb-2 text-6xl font-bold text-gray-900 md:text-7xl lg:text-8xl">
                  500+
                </p>
                <h3 className="text-lg font-bold text-gray-900 md:text-xl">
                  Tenders posted monthly
                </h3>
              </div>
              <div className="flex flex-col justify-center border border-gray-200 p-8 text-center rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                <p className="mb-2 text-6xl font-bold text-gray-900 md:text-7xl lg:text-8xl">
                  250+
                </p>
                <h3 className="text-lg font-bold text-gray-900 md:text-xl">
                  Active suppliers
                </h3>
              </div>
              <div className="flex flex-col justify-center border border-gray-200 p-8 text-center rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                <p className="mb-2 text-6xl font-bold text-gray-900 md:text-7xl lg:text-8xl">
                  85%
                </p>
                <h3 className="text-lg font-bold text-gray-900 md:text-xl">
                  User satisfaction rate
                </h3>
              </div>
              <div className="flex flex-col justify-center border border-gray-200 p-8 text-center rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                <p className="mb-2 text-6xl font-bold text-gray-900 md:text-7xl lg:text-8xl">
                  3 days
                </p>
                <h3 className="text-lg font-bold text-gray-900 md:text-xl">
                  Average tender resolution time
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section: 3 steps */}
      <section className="px-[5%] py-16 md:py-24 lg:py-28 bg-gray-50">
        <div className="container mx-auto">
          <div className="mb-12 md:mb-18 lg:mb-20">
            <div className="mx-auto max-w-lg text-center">
              <p className="mb-3 font-semibold md:mb-4 text-blue-600 text-lg">
                Process
              </p>
              <h2 className="mb-5 text-4xl font-bold text-gray-900 md:mb-6 md:text-5xl lg:text-6xl">
                How it works
              </h2>
              <p className="text-gray-700 text-lg">
                Post. Receive & compare bids. Chat & award—identities revealed
                only after award.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 md:gap-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-4">
              <div className="flex flex-col border border-gray-200 rounded-2xl overflow-hidden bg-white hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-center bg-gray-50 p-6">
                  <img
                    src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                    alt="Relume placeholder image 1"
                    className="w-full object-cover rounded-lg"
                  />
                </div>
                <div className="flex flex-col justify-center p-6">
                  <div>
                    <p className="mb-2 text-sm font-semibold text-blue-600">
                      Step 1
                    </p>
                    <h3 className="mb-2 text-xl font-bold text-gray-900 md:text-2xl">
                      Post
                    </h3>
                    <p className="text-gray-700">
                      Describe your project with clear, concise details.
                    </p>
                  </div>
                  <div className="mt-5 flex items-center gap-4 md:mt-6">
                    <button className="focus:ring-blue-500 inline-flex items-center justify-center whitespace-nowrap ring-offset-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-0 text-gray-900 gap-2 p-0 hover:text-blue-600">
                      Learn more
                      <svg
                        stroke="currentColor"
                        fill="none"
                        stroke-width="0"
                        viewBox="0 0 15 15"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex flex-col border border-gray-200 rounded-2xl overflow-hidden bg-white hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-center bg-gray-50 p-6">
                  <img
                    src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                    alt="Relume placeholder image 2"
                    className="w-full object-cover rounded-lg"
                  />
                </div>
                <div className="flex flex-col justify-center p-6">
                  <div>
                    <p className="mb-2 text-sm font-semibold text-blue-600">
                      Step 2
                    </p>
                    <h3 className="mb-2 text-xl font-bold text-gray-900 md:text-2xl">
                      Receive & compare bids
                    </h3>
                    <p className="text-gray-700">
                      Compare apples-to-apples (price, ETA, notes) in one view.
                    </p>
                  </div>
                  <div className="mt-5 flex items-center gap-4 md:mt-6">
                    <button className="focus:ring-blue-500 inline-flex items-center justify-center whitespace-nowrap ring-offset-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-0 text-gray-900 gap-2 p-0 hover:text-blue-600">
                      Learn more
                      <svg
                        stroke="currentColor"
                        fill="none"
                        stroke-width="0"
                        viewBox="0 0 15 15"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 border border-gray-200 rounded-2xl overflow-hidden sm:col-span-2 sm:row-span-1 sm:grid-cols-2 bg-white hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-center bg-gray-50 p-6">
                  <img
                    src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-portrait.svg"
                    alt="Relume placeholder image 3"
                    className="size-full object-cover rounded-lg"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-center p-6">
                  <div>
                    <p className="mb-2 text-sm font-semibold text-blue-600">
                      Step 3
                    </p>
                    <h3 className="mb-2 text-xl font-bold text-gray-900 md:text-2xl">
                      Chat & award
                    </h3>
                    <p className="text-gray-700">
                      Keep negotiations in one private thread; get awarded
                      faster.
                    </p>
                  </div>
                  <div className="mt-5 flex flex-wrap items-center gap-4 md:mt-6">
                    <button className="focus:ring-blue-500 inline-flex items-center justify-center whitespace-nowrap ring-offset-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-0 text-gray-900 gap-2 p-0 hover:text-blue-600">
                      Button
                      <svg
                        stroke="currentColor"
                        fill="none"
                        stroke-width="0"
                        viewBox="0 0 15 15"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features List Section: Use cases (Qatar) */}
      <section className="px-[5%] py-16 md:py-24 lg:py-28 bg-white">
        <div className="container mx-auto">
          <div className="mb-12 md:mb-18 lg:mb-20">
            <div className="mx-auto max-w-lg text-center">
              <p className="mb-3 font-semibold md:mb-4 text-blue-600 text-lg">
                Use cases (Qatar)
              </p>
              <h2 className="mb-5 text-4xl font-bold text-gray-900 md:mb-6 md:text-5xl lg:text-6xl">
                For individuals
              </h2>
              <p className="text-gray-700 text-lg">
                Home services (cleaning & maintenance). Automotive services
                (repair, detailing, tires). Events (weddings, corporate,
                birthdays). Construction & renovation (small works, fit-outs,
                repairs).
              </p>
            </div>
          </div>
          <div className="grid auto-cols-fr grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-4">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="flex flex-col border border-gray-200 rounded-2xl overflow-hidden bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex flex-1 flex-col justify-center p-6">
                  <div>
                    <p className="mb-2 text-sm font-semibold text-blue-600">
                      {index === 0 && "Home"}
                      {index === 1 && "Automotive"}
                      {index === 2 && "Events"}
                      {index === 3 && "Construction"}
                    </p>
                    <h3 className="mb-2 text-lg font-bold text-gray-900 leading-[1.4] md:text-xl">
                      {index === 0 && "Home services simplified"}
                      {index === 1 && "Car services made transparent"}
                      {index === 2 && "Wedding and corporate event planning"}
                      {index === 3 && "Home renovation made easy"}
                    </h3>
                    <p className="text-gray-700">
                      {index === 0 &&
                        "Clean apartments without the hassle of endless phone calls."}
                      {index === 1 &&
                        "Get precise quotes from mechanics who understand your vehicle."}
                      {index === 2 &&
                        "Connect with vendors who match your exact event requirements."}
                      {index === 3 &&
                        "Find contractors who understand your specific renovation needs."}
                    </p>
                  </div>
                  <div className="mt-5 md:mt-6">
                    <button className="focus:ring-blue-500 inline-flex items-center justify-center whitespace-nowrap ring-offset-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-0 text-gray-900 gap-2 p-0 hover:text-blue-600">
                      {index === 0 && "Explore"}
                      {index === 1 && "Learn"}
                      {index === 2 && "Discover"}
                      {index === 3 && "View"}
                      <svg
                        stroke="currentColor"
                        fill="none"
                        stroke-width="0"
                        viewBox="0 0 15 15"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="flex w-full flex-col items-center justify-center self-start p-6 bg-gray-50">
                  <img
                    src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                    alt="Relume placeholder image 1"
                    className="rounded-lg shadow-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section: For tenderers & bidders */}
      <section className="px-[5%] py-16 md:py-24 lg:py-28 bg-gray-50">
        <div className="container mx-auto">
          <div className="mb-12 grid grid-cols-1 gap-5 md:mb-18 md:grid-cols-2 md:gap-x-12 md:gap-y-8 lg:mb-20 lg:gap-x-20">
            <div>
              <p className="mb-3 font-semibold md:mb-4 text-blue-600 text-lg">
                For tenderers (buyers)
              </p>
              <h2 className="text-4xl font-bold text-gray-900 md:text-5xl lg:text-6xl">
                How it works
              </h2>
            </div>
            <div>
              <p className="text-gray-700 text-lg">
                Post your tender (title, category, deadline, optional budget,
                deliverables). Use Q/A to clarify specs or request
                revisions—without revealing identity. Compare & shortlist
                side-by-side, then award the winner (identities reveal after
                award).
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-y-12 md:grid-cols-2 md:gap-x-8 md:gap-y-16 lg:grid-cols-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="mb-5 flex justify-center md:mb-6">
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                  alt="Relume placeholder image 1"
                  className="rounded-lg shadow-sm"
                />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900 md:mb-4 md:text-2xl">
                How it works
              </h3>
              <p className="text-gray-700">
                Post your tender (title, category, deadline, optional budget,
                deliverables). Use Q/A to clarify specs or request
                revisions—without revealing identity. Compare & shortlist
                side-by-side, then award the winner (identities reveal after
                award).
              </p>
            </div>
          </div>
          <div className="mt-12 flex flex-wrap items-center gap-4 md:mt-18 lg:mt-20">
            <button className="focus:ring-blue-500 inline-flex gap-3 items-center justify-center whitespace-nowrap ring-offset-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-300 text-gray-900 bg-white px-6 py-3 rounded-xl hover:bg-gray-50 hover:shadow-md">
              Learn more
            </button>
            <button className="focus:ring-blue-500 inline-flex items-center justify-center whitespace-nowrap ring-offset-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-0 text-gray-900 gap-2 p-0 hover:text-blue-600">
              Get started
              <svg
                stroke="currentColor"
                fill="none"
                stroke-width="0"
                viewBox="0 0 15 15"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z"
                  fill="currentColor"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* How It Works Section: For bidders */}
      <section className="px-[5%] py-16 md:py-24 lg:py-28 bg-white">
        <div className="container mx-auto">
          <div className="flex flex-col items-center">
            <div className="mb-12 w-full max-w-lg text-center md:mb-18 lg:mb-20">
              <p className="mb-3 font-semibold md:mb-4 text-blue-600 text-lg">
                For bidders (suppliers)
              </p>
              <h2 className="mb-5 text-4xl font-bold text-gray-900 md:mb-6 md:text-5xl lg:text-6xl">
                How it works
              </h2>
              <p className="text-gray-700 text-lg">
                Register & browse matching tenders. Submit your bid (price, ETA,
                terms, attachments); update anytime before the deadline.
                Negotiate privately until the tenderer awards; identities reveal
                post-award for contracting.
              </p>
            </div>
            <div className="grid grid-cols-1 items-start justify-center gap-y-12 md:grid-cols-3 md:gap-x-8 md:gap-y-16 lg:gap-x-12">
              {[
                {
                  title: "Register & browse",
                  desc: "Register & browse matching tenders.",
                },
                {
                  title: "Submit your bid",
                  desc: "Submit your bid (price, ETA, terms, attachments); update anytime before the deadline.",
                },
                {
                  title: "Negotiate & award",
                  desc: "Negotiate privately until the tenderer awards; identities reveal post-award for contracting.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex w-full flex-col items-center text-center"
                >
                  <div className="mb-5 md:mb-6">
                    <img
                      src="https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg"
                      alt="Relume logo 1"
                      className="size-12 mx-auto"
                    />
                  </div>
                  <h3 className="mb-5 text-2xl font-bold text-gray-900 md:mb-6 md:text-3xl md:leading-[1.3] lg:text-4xl">
                    {item.title}
                  </h3>
                  <p className="text-gray-700">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 flex items-center gap-4 md:mt-14 lg:mt-16">
              <button className="focus:ring-blue-500 inline-flex gap-3 items-center justify-center whitespace-nowrap ring-offset-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-300 text-gray-900 bg-white px-6 py-3 rounded-xl hover:bg-gray-50 hover:shadow-md">
                Learn more
              </button>
              <button className="focus:ring-blue-500 inline-flex items-center justify-center whitespace-nowrap ring-offset-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-0 text-gray-900 gap-2 p-0 hover:text-blue-600">
                Get started
                <svg
                  stroke="currentColor"
                  fill="none"
                  stroke-width="0"
                  viewBox="0 0 15 15"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="overflow-hidden px-[5%] py-16 md:py-24 lg:py-28 bg-gray-50">
        <div className="container mx-auto">
          <div
            className="relative overflow-hidden"
            role="region"
            aria-roledescription="carousel"
          >
            <div className="relative pt-20 md:pb-20 md:pt-0">
              <div>
                <div className="flex ml-0">
                  {testimonials.map((testimonial, index) => (
                    <div
                      key={index}
                      role="group"
                      aria-roledescription="slide"
                      className={`min-w-0 shrink-0 grow-0 basis-full pl-0 transition-opacity duration-500 ${
                        currentSlide === index
                          ? "opacity-100"
                          : "opacity-0 absolute"
                      }`}
                    >
                      <div className="grid w-full auto-cols-fr grid-cols-1 items-center justify-center gap-12 md:grid-cols-2 md:gap-10 lg:gap-x-20">
                        <div className="order-last md:order-first">
                          <button
                            type="button"
                            aria-haspopup="dialog"
                            aria-expanded="false"
                            aria-controls={`radix-${index}`}
                            data-state="closed"
                            className="relative flex w-full items-center justify-center"
                          >
                            <img
                              src="https://d22po4pjz3o32e.cloudfront.net/placeholder-video-thumbnail.svg"
                              alt="Testimonial image 1"
                              className="size-full object-cover rounded-lg"
                            />
                            <span className="absolute inset-0 z-10 bg-black/50 rounded-lg"></span>
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              stroke-width="0"
                              viewBox="0 0 512 512"
                              className="absolute z-20 size-16 text-white"
                              height="1em"
                              width="1em"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c-7.6 4.2-12.3 12.3-12.3 20.9V344c0 8.7 4.7 16.7 12.3 20.9s16.8 4.1 24.3-.5l144-88c7.1-4.4 11.5-12.1 11.5-20.5s-4.4-16.1-11.5-20.5l-144-88c-7.4-4.5-16.7-4.7-24.3-.5z"></path>
                            </svg>
                          </button>
                        </div>
                        <div className="flex flex-col items-start">
                          <div className="mb-6 flex md:mb-8">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                stroke="currentColor"
                                fill="currentColor"
                                stroke-width="0"
                                viewBox="0 0 24 24"
                                className="size-6 text-yellow-400"
                                height="1em"
                                width="1em"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M21.947 9.179a1.001 1.001 0 0 0-.868-.676l-5.701-.453-2.467-5.461a.998.998 0 0 0-1.822-.001L8.622 8.05l-5.701.453a1 1 0 0 0-.619 1.713l4.213 4.107-1.49 6.452a1 1 0 0 0 1.53 1.057L12 18.202l5.445 3.63a1.001 1.001 0 0 0 1.517-1.106l-1.829-6.4 4.536-4.082c.297-.268.406-.686.278-1.065z"></path>
                              </svg>
                            ))}
                          </div>
                          <blockquote className="text-2xl font-bold text-gray-900 md:text-3xl">
                            {testimonial.quote}
                          </blockquote>
                          <div className="mt-6 flex flex-nowrap items-center gap-5 md:mt-8">
                            <div>
                              <p className="font-semibold text-gray-900">
                                {testimonial.author}
                              </p>
                              <p className="text-gray-700">
                                {testimonial.role}
                              </p>
                            </div>
                            <div className="mx-4 w-px self-stretch bg-gray-200 sm:mx-0"></div>
                            <div>
                              <img
                                src={testimonial.logo}
                                alt="Webflow logo 1"
                                className="max-h-12"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute top-0 flex w-full items-start justify-between md:bottom-0 md:top-auto md:items-end">
                <div className="mt-2.5 flex w-full items-start justify-start md:mb-2.5 md:mt-0">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      className={`mx-[3px] inline-block size-2 rounded-full ${
                        currentSlide === index ? "bg-blue-600" : "bg-gray-300"
                      }`}
                      onClick={() => setCurrentSlide(index)}
                    ></button>
                  ))}
                </div>
                <div className="flex items-end justify-end gap-2 md:gap-4">
                  <button
                    className="focus:ring-blue-500 inline-flex gap-3 items-center justify-center whitespace-nowrap ring-offset-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-300 text-gray-900 rounded-full bg-white left-0 static right-0 top-0 size-12 -translate-y-0 hover:bg-gray-50"
                    onClick={() =>
                      setCurrentSlide((prev) =>
                        prev === 0 ? testimonials.length - 1 : prev - 1
                      )
                    }
                  >
                    <svg
                      stroke="currentColor"
                      fill="none"
                      stroke-width="0"
                      viewBox="0 0 24 24"
                      className="size-6"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12.707 17.293 8.414 13H18v-2H8.414l4.293-4.293-1.414-1.414L4.586 12l6.707 6.707z"></path>
                    </svg>
                    <span className="sr-only">Previous slide</span>
                  </button>
                  <button
                    className="focus:ring-blue-500 inline-flex gap-3 items-center justify-center whitespace-nowrap ring-offset-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-300 text-gray-900 rounded-full bg-white static right-0 top-0 size-12 -translate-y-0 hover:bg-gray-50"
                    onClick={() =>
                      setCurrentSlide((prev) =>
                        prev === testimonials.length - 1 ? 0 : prev + 1
                      )
                    }
                  >
                    <svg
                      stroke="currentColor"
                      fill="none"
                      stroke-width="0"
                      viewBox="0 0 24 24"
                      className="size-6"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="m11.293 17.293 1.414 1.414L19.414 12l-6.707-6.707-1.414 1.414L15.586 11H6v2h9.586z"></path>
                    </svg>
                    <span className="sr-only">Next slide</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-[5%] py-16 md:py-24 lg:py-28 bg-white">
        <div className="container mx-auto">
          <div className="mb-12 w-full max-w-lg md:mb-18 lg:mb-20">
            <h2 className="mb-5 text-4xl font-bold text-gray-900 md:mb-6 md:text-5xl lg:text-6xl">
              FAQs
            </h2>
            <p className="text-gray-700 text-lg">
              Frequently asked questions about the Tenderly platform and how to
              get started.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-2xl overflow-hidden"
              >
                <button
                  className="w-full p-6 text-left flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
                  onClick={() => setActiveTab(index === activeTab ? -1 : index)}
                >
                  <span className="font-semibold text-gray-900">
                    {faq.question}
                  </span>
                  <svg
                    className={`w-5 h-5 text-gray-600 transform transition-transform ${
                      activeTab === index ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-500 ${
                    activeTab === index
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="p-6 bg-white">
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 md:mt-18 lg:mt-20">
            <h4 className="mb-3 text-2xl font-bold text-gray-900 md:mb-4 md:text-3xl md:leading-[1.3] lg:text-4xl">
              Still have questions?
            </h4>
            <p className="text-gray-700 text-lg">
              Contact our support team for more information.
            </p>
            <div className="mt-6 md:mt-8">
              <button className="focus:ring-blue-500 inline-flex gap-3 items-center justify-center whitespace-nowrap ring-offset-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-300 text-gray-900 bg-white px-6 py-3 rounded-xl hover:bg-gray-50 hover:shadow-md">
                Contact
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section: How It Works */}
      <section className="px-[5%] py-16 md:py-24 lg:py-28 bg-gray-50">
        <div className="container mx-auto">
          <div className="mb-12 md:mb-18 lg:mb-20">
            <div className="mx-auto max-w-lg text-center">
              <p className="mb-3 font-semibold md:mb-4 text-blue-600 text-lg">
                Process
              </p>
              <h2 className="mb-5 text-4xl font-bold text-gray-900 md:mb-6 md:text-5xl lg:text-6xl">
                How It Works
              </h2>
              <p className="text-gray-700 text-lg">
                Learn how to use the Tenderly platform to post tenders or submit
                bids.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 md:gap-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-4">
              <div className="flex flex-col border border-gray-200 rounded-2xl overflow-hidden bg-white hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-center bg-gray-50 p-6">
                  <img
                    src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                    alt="Relume placeholder image 1"
                    className="w-full object-cover rounded-lg"
                  />
                </div>
                <div className="flex flex-col justify-center p-6">
                  <div>
                    <p className="mb-2 text-sm font-semibold text-blue-600">
                      Step 1
                    </p>
                    <h3 className="mb-2 text-xl font-bold text-gray-900 md:text-2xl">
                      Sign up
                    </h3>
                    <p className="text-gray-700">
                      Create an account as a tenderer or bidder.
                    </p>
                  </div>
                  <div className="mt-5 flex items-center gap-4 md:mt-6">
                    <button className="focus:ring-blue-500 inline-flex items-center justify-center whitespace-nowrap ring-offset-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-0 text-gray-900 gap-2 p-0 hover:text-blue-600">
                      Learn
                      <svg
                        stroke="currentColor"
                        fill="none"
                        stroke-width="0"
                        viewBox="0 0 15 15"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex flex-col border border-gray-200 rounded-2xl overflow-hidden bg-white hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-center bg-gray-50 p-6">
                  <img
                    src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                    alt="Relume placeholder image 2"
                    className="w-full object-cover rounded-lg"
                  />
                </div>
                <div className="flex flex-col justify-center p-6">
                  <div>
                    <p className="mb-2 text-sm font-semibold text-blue-600">
                      Step 2
                    </p>
                    <h3 className="mb-2 text-xl font-bold text-gray-900 md:text-2xl">
                      Post or browse
                    </h3>
                    <p className="text-gray-700">
                      Post your tender or browse available tenders.
                    </p>
                  </div>
                  <div className="mt-5 flex items-center gap-4 md:mt-6">
                    <button className="focus:ring-blue-500 inline-flex items-center justify-center whitespace-nowrap ring-offset-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-0 text-gray-900 gap-2 p-0 hover:text-blue-600">
                      Learn
                      <svg
                        stroke="currentColor"
                        fill="none"
                        stroke-width="0"
                        viewBox="0 0 15 15"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 border border-gray-200 rounded-2xl overflow-hidden sm:col-span-2 sm:row-span-1 sm:grid-cols-2 bg-white hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-center bg-gray-50 p-6">
                  <img
                    src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-portrait.svg"
                    alt="Relume placeholder image 3"
                    className="size-full object-cover rounded-lg"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-center p-6">
                  <div>
                    <p className="mb-2 text-sm font-semibold text-blue-600">
                      Step 3
                    </p>
                    <h3 className="mb-2 text-xl font-bold text-gray-900 md:text-2xl">
                      Negotiate & award
                    </h3>
                    <p className="text-gray-700">
                      Negotiate and award the best bid.
                    </p>
                  </div>
                  <div className="mt-5 flex flex-wrap items-center gap-4 md:mt-6">
                    <button className="focus:ring-blue-500 inline-flex items-center justify-center whitespace-nowrap ring-offset-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-0 text-gray-900 gap-2 p-0 hover:text-blue-600">
                      Button
                      <svg
                        stroke="currentColor"
                        fill="none"
                        stroke-width="0"
                        viewBox="0 0 15 15"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-[5%] py-16 md:py-24 lg:py-28 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 gap-x-20 gap-y-12 md:gap-y-16 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="mb-5 text-4xl font-bold text-white md:mb-6 md:text-5xl lg:text-6xl">
                Join Us
              </h2>
              <p className="text-white text-lg">
                Whether you are buyers looking to post your first tender or
                suppliers ready to start bidding on opportunities, join our
                platform today.
              </p>
              <div className="mt-6 flex flex-wrap gap-4 md:mt-8">
                <button className="focus:ring-blue-500 inline-flex gap-3 items-center justify-center whitespace-nowrap ring-offset-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-white bg-white text-blue-600 px-6 py-3 rounded-xl hover:bg-gray-100 hover:shadow-lg">
                  Sign Up
                </button>
                <button className="focus:ring-blue-500 inline-flex gap-3 items-center justify-center whitespace-nowrap ring-offset-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-white text-white bg-transparent px-6 py-3 rounded-xl hover:bg-blue-700 hover:shadow-lg">
                  Learn More
                </button>
              </div>
            </div>
            <div>
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                className="w-full object-cover rounded-lg shadow-lg transition-transform duration-500 hover:scale-105"
                alt="Relume placeholder image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-[5%] py-12 md:py-18 lg:py-20 bg-gray-900 text-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 gap-x-[4vw] gap-y-12 pb-12 md:gap-y-16 md:pb-18 lg:grid-cols-[1fr_0.5fr] lg:gap-y-4 lg:pb-20">
            <div>
              <div className="mb-6 md:mb-8">
                <a href="#">
                  <img
                    src="https://d22po4pjz3o32e.cloudfront.net/logo-image.svg"
                    alt="Logo image"
                    className="inline-block"
                  />
                </a>
              </div>
              <div className="mb-6 md:mb-8">
                <p className="mb-1 text-sm font-semibold">Address:</p>
                <p className="mb-5 text-sm md:mb-6">
                  Level 1, 12 Sample St, Sydney NSW 2000
                </p>
                <p className="mb-1 text-sm font-semibold">Contact:</p>
                <a
                  href="tel:1800 123 4567"
                  className="block text-sm underline decoration-white underline-offset-1 hover:text-blue-300 transition-colors"
                >
                  1800 123 4567
                </a>
                <a
                  href="mailto:info@relume.io"
                  className="block text-sm underline decoration-white underline-offset-1 hover:text-blue-300 transition-colors"
                >
                  info@relume.io
                </a>
              </div>
              <div className="grid grid-flow-col grid-cols-[max-content] items-start justify-start gap-x-3">
                <a href="#" className="hover:text-blue-300 transition-colors">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    stroke-width="0"
                    viewBox="0 0 24 24"
                    className="size-6"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12.001 2.002c-5.522 0-9.999 4.477-9.999 9.999 0 4.99 3.656 9.126 8.437 9.879v-6.988h-2.54v-2.891h2.54V9.798c0-2.508 1.493-3.891 3.776-3.891 1.094 0 2.24.195 2.24.195v2.459h-1.264c-1.24 0-1.628.772-1.628 1.563v1.875h2.771l-.443 2.891h-2.328v6.988C18.344 21.129 22 16.992 22 12.001c0-5.522-4.477-9.999-9.999-9.999z"></path>
                  </svg>
                </a>
                <a href="#" className="hover:text-blue-300 transition-colors">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    stroke-width="0"
                    viewBox="0 0 24 24"
                    className="size-6"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M11.999 7.377a4.623 4.623 0 1 0 0 9.248 4.623 4.623 0 0 0 0-9.248zm0 7.627a3.004 3.004 0 1 1 0-6.008 3.004 3.004 0 0 1 0 6.008z"></path>
                    <circle cx="16.806" cy="7.207" r="1.078"></circle>
                    <path d="M20.533 6.111A4.605 4.605 0 0 0 17.9 3.479a6.606 6.606 0 0 0-2.186-.42c-.963-.042-1.268-.054-3.71-.054s-2.755 0-3.71.054a6.554 6.554 0 0 0-2.184.42 4.6 4.6 0 0 0-2.633 2.632 6.585 6.585 0 0 0-.419 2.186c-.043.962-.056 1.267-.056 3.71 0 2.442 0 2.753.056 3.71.015.748.156 1.486.419 2.187a4.61 4.61 0 0 0 2.634 2.632 6.584 6.584 0 0 0 2.185.45c.963.042 1.268.055 3.71.055s2.755 0 3.71-.055a6.615 6.615 0 0 0 2.186-.419 4.613 4.613 0 0 0 2.633-2.633c.263-.7.404-1.438.419-2.186.043-.962.056-1.267.056-3.71s0-2.753-.056-3.71a6.581 6.581 0 0 0-.421-2.217zm-1.218 9.532a5.043 5.043 0 0 1-.311 1.688 2.987 2.987 0 0 1-1.712 1.711 4.985 4.985 0 0 1-1.67.311c-.95.044-1.218.055-3.654.055-2.438 0-2.687 0-3.655-.055a4.96 4.96 0 0 1-1.669-.311 2.985 2.985 0 0 1-1.719-1.711 5.08 5.08 0 0 1-.311-1.669c-.043-.95-.053-1.218-.053-3.654 0-2.437 0-2.686.053-3.655a5.038 5.038 0 0 1 .311-1.687c.305-.789.93-1.41 1.719-1.712a5.01 5.01 0 0 1 1.669-.311c.951-.043 1.218-.055 3.655-.055s2.687 0 3.654.055a4.96 4.96 0 0 1 1.67.311 2.991 2.991 0 0 1 1.712 1.712 5.08 5.08 0 0 1 .311 1.669c.043.951.054 1.218.054 3.655 0 2.436 0 2.698-.043 3.654h-.011z"></path>
                  </svg>
                </a>
                <a href="#" className="hover:text-blue-300 transition-colors">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    stroke-width="0"
                    viewBox="0 0 512 512"
                    className="size-6 p-0.5"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"></path>
                  </svg>
                </a>
                <a href="#" className="hover:text-blue-300 transition-colors">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    stroke-width="0"
                    viewBox="0 0 24 24"
                    className="size-6"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zM8.339 18.337H5.667v-8.59h2.672v8.59zM7.003 8.574a1.548 1.548 0 1 1 0-3.096 1.548 1.548 0 0 1 0 3.096zm11.335 9.763h-2.669V14.16c0-.996-.018-2.277-1.388-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248h-2.667v-8.59h2.56v1.174h.037c.355-.675 1.227-1.387 2.524-1.387 2.704 0 3.203 1.778 3.203 4.092v4.71z"></path>
                  </svg>
                </a>
                <a href="#" className="hover:text-blue-300 transition-colors">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    stroke-width="0"
                    viewBox="0 0 24 24"
                    className="size-6"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M21.593 7.203a2.506 2.506 0 0 0-1.762-1.766C18.265 5.007 12 5 12 5s-6.264-.007-7.831.404a2.56 2.56 0 0 0-1.766 1.778c-.413 1.566-.417 4.814-.417 4.814s-.004 3.264.406 4.814c.23.857.905 1.534 1.763 1.765 1.582.43 7.83.437 7.83.437s6.265.007 7.831-.403a2.515 2.515 0 0 0 1.767-1.763c.414-1.565.417-4.812.417-4.812s.02-3.265-.407-4.831zM9.996 15.005l.005-6 5.207 3.005-5.212 2.995z"></path>
                  </svg>
                </a>
              </div>
            </div>
            <div className="grid grid-cols-1 items-start gap-x-6 gap-y-10 md:grid-cols-2 md:gap-x-8 md:gap-y-4">
              <ul>
                <li className="py-2 text-sm font-semibold hover:text-blue-300 transition-colors">
                  <a href="#">Link One</a>
                </li>
                <li className="py-2 text-sm font-semibold hover:text-blue-300 transition-colors">
                  <a href="#">Link Two</a>
                </li>
                <li className="py-2 text-sm font-semibold hover:text-blue-300 transition-colors">
                  <a href="#">Link Three</a>
                </li>
                <li className="py-2 text-sm font-semibold hover:text-blue-300 transition-colors">
                  <a href="#">Link Four</a>
                </li>
                <li className="py-2 text-sm font-semibold hover:text-blue-300 transition-colors">
                  <a href="#">Link Five</a>
                </li>
              </ul>
              <ul>
                <li className="py-2 text-sm font-semibold hover:text-blue-300 transition-colors">
                  <a href="#">Link Six</a>
                </li>
                <li className="py-2 text-sm font-semibold hover:text-blue-300 transition-colors">
                  <a href="#">Link Seven</a>
                </li>
                <li className="py-2 text-sm font-semibold hover:text-blue-300 transition-colors">
                  <a href="#">Link Eight</a>
                </li>
                <li className="py-2 text-sm font-semibold hover:text-blue-300 transition-colors">
                  <a href="#">Link Nine</a>
                </li>
                <li className="py-2 text-sm font-semibold hover:text-blue-300 transition-colors">
                  <a href="#">Link Ten</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="h-px w-full bg-gray-700"></div>
          <div className="flex flex-col-reverse items-start justify-between pb-4 pt-6 text-sm md:flex-row md:items-center md:pb-0 md:pt-8">
            <p className="mt-8 md:mt-0">© 2024 Relume. All rights reserved.</p>
            <ul className="grid grid-flow-row grid-cols-[max-content] justify-center gap-y-4 text-sm md:grid-flow-col md:gap-x-6 md:gap-y-0">
              <li className="underline hover:text-blue-300 transition-colors">
                <a href="#">Privacy Policy</a>
              </li>
              <li className="underline hover:text-blue-300 transition-colors">
                <a href="#">Terms of Service</a>
              </li>
              <li className="underline hover:text-blue-300 transition-colors">
                <a href="#">Cookies Settings</a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default QatarTenderPlatform;
