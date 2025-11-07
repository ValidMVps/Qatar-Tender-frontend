"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTrigger,
  Input,
  Label,
  Textarea,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@relume_io/relume-ui";
import {
  ChevronRight,
  Facebook,
  Instagram,
  Linkedin,
  Play,
  Star,
  Twitter,
  Youtube,
} from "lucide-react";
import clsx from "clsx";

// --------------------------------------------------
// ConditionalRender (from Navbar22)
// --------------------------------------------------
const ConditionalRender = ({
  condition,
  children,
}: {
  condition: boolean;
  children: React.ReactNode;
}) => {
  return condition ? <>{children}</> : null;
};

// --------------------------------------------------
// useNavbarRelume (renamed from useRelume in Navbar22)
// --------------------------------------------------
const useNavbarRelume = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  const openDropdown = () => setIsDropdownOpen(true);
  const closeDropdown = () => setIsDropdownOpen(false);
  const animateMenu = isMenuOpen
    ? { menu: "open", menu2: "openSecond" }
    : { menu: "close", menu2: "closeSecond" };
  const animateDropdownMenu = isDropdownOpen ? "open" : "close";
  const animateDropdownMenuIcon = isDropdownOpen ? "rotated" : "initial";

  return {
    isDropdownOpen,
    toggleMenu,
    toggleDropdown,
    openDropdown,
    closeDropdown,
    animateMenu,
    animateDropdownMenu,
    animateDropdownMenuIcon,
    isMenuOpen,
  };
};

// --------------------------------------------------
// useForm (from Navbar22)
// --------------------------------------------------
const useForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleSetName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleSetEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleSetMessage = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  const handleSetCheckbox = (checked: boolean) => {
    setAcceptTerms(checked);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log({ name, email, message, acceptTerms });
  };

  return {
    name,
    email,
    message,
    acceptTerms,
    handleSubmit,
    handleSetName,
    handleSetEmail,
    handleSetMessage,
    handleSetCheckbox,
  };
};

// --------------------------------------------------
// Navbar22
// --------------------------------------------------
const Navbar22 = () => {
  const formState = useForm();
  const useActive = useNavbarRelume();
  return (
    <section
      id="relume"
      className="sticky top-0 z-[999] flex min-h-16 w-full items-center border-b border-b-border-primary bg-background-primary px-[5%] md:min-h-18"
    >
      <div className="mx-auto flex size-full items-center justify-between">
        <a href="#" className="relative z-50">
          <img
            src="https://d22po4pjz3o32e.cloudfront.net/logo-image.svg"
            alt="Relume placeholder logo"
          />
        </a>
        <div className="hidden lg:flex lg:items-center lg:justify-center lg:overflow-hidden lg:px-0 lg:text-center">
          <a
            href="#"
            className="block py-3 text-md lg:px-4 lg:py-2 lg:text-base"
          >
            Services
          </a>
          <a
            href="#"
            className="block py-3 text-md lg:px-4 lg:py-2 lg:text-base"
          >
            About
          </a>
          <a
            href="#"
            className="block py-3 text-md lg:px-4 lg:py-2 lg:text-base"
          >
            Blog
          </a>
        </div>
        <AnimatePresence>
          <ConditionalRender condition={true}>
            <div>
              <div className="grid grid-cols-1 gap-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  type="text"
                  id="name"
                  value={formState.name}
                  onChange={formState.handleSetName}
                />
              </div>
              <div className="grid grid-cols-1 gap-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  value={formState.email}
                  onChange={formState.handleSetEmail}
                />
              </div>
              <div className="grid grid-cols-1 gap-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Write your inquiry here"
                  className="min-h-[11.25rem] overflow-auto"
                  value={formState.message}
                  onChange={formState.handleSetMessage}
                />
              </div>
              <div className="mb-3 flex items-center md:mb-4">
                <Checkbox
                  id="terms"
                  checked={formState.acceptTerms}
                  onCheckedChange={formState.handleSetCheckbox}
                  className="mr-2"
                />
                <Label htmlFor="terms" className="cursor-pointer">
                  <span className="text-sm">
                    I accept the{" "}
                    <a href="#" className="underline">
                      Terms
                    </a>
                  </span>
                </Label>
              </div>
              <Button title="Login" className="mr-auto">
                Login
              </Button>
            </div>
            <div className="flex flex-col gap-y-6 px-[5vw] lg:absolute lg:inset-[auto_auto_3rem_5vw] lg:px-0">
              <div className="flex flex-col gap-y-0.5">
                <a href="#" className="mb-1 block text-sm underline">
                  Learn about our mission and vision
                </a>
                <a href="#" className="mb-1 block text-sm underline">
                  info@relume.io
                </a>
                <p className="text-sm">Get in touch with us</p>
                <div className="mt-5 flex items-center gap-3 md:mt-6">
                  <a href="#">
                    <Facebook className="size-6" />
                  </a>
                  <a href="#">
                    <Instagram className="size-6" />
                  </a>
                  <a href="#">
                    <Twitter className="size-6" />
                  </a>
                  <a href="#">
                    <Linkedin className="size-6" />
                  </a>
                  <a href="#">
                    <Youtube className="size-6" />
                  </a>
                </div>
              </div>
            </div>
          </ConditionalRender>
        </AnimatePresence>
      </div>
    </section>
  );
};

// --------------------------------------------------
// TabItem (general, used in all Layout491 variants and Layout494)
// --------------------------------------------------
const TabItem = ({ tabItem, index, activeTab }: any) => {
  if (index !== activeTab) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {tabItem.image && (
        <img
          src={tabItem.image.src}
          alt={tabItem.image.alt}
          className="object-cover size-full"
        />
      )}
      {tabItem.video && (
        <Dialog>
          <DialogTrigger className="relative flex items-center justify-center w-full">
            <img
              src={tabItem.video.image.src}
              alt={tabItem.video.image.alt}
              className="object-cover size-full"
            />
            <span className="absolute inset-0 z-10 bg-black/50" />
            <Play className="absolute z-20 text-white size-16" />
          </DialogTrigger>
          <DialogContent>
            <iframe
              className="w-full aspect-video"
              src={tabItem.video.url}
              title="Video"
              allowFullScreen
            />
          </DialogContent>
        </Dialog>
      )}
    </motion.div>
  );
};

// --------------------------------------------------
// useRelume (general for tabs)
// --------------------------------------------------
const useRelume = () => {
  const [activeTab, setActiveTab] = useState(0);
  const setActiveTabSetter = (index: number) => () => setActiveTab(index);
  const getActiveTabButtonStyles = (index: number) =>
    clsx("cursor-pointer border-b border-border-primary py-6", {
      "opacity-100": activeTab === index,
      "opacity-25": activeTab !== index,
    });
  const getActiveTabButtonContentStyles = (index: number) => ({
    height: activeTab === index ? "auto" : 0,
    opacity: activeTab === index ? 1 : 0,
  });
  return {
    setActiveTabSetter,
    getActiveTabButtonStyles,
    getActiveTabButtonContentStyles,
    activeTab,
  };
};

// --------------------------------------------------
// Layout491
// --------------------------------------------------
const Layout491 = () => {
  const useActive = useRelume();
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mx-auto mb-12 max-w-lg text-center md:mb-18 lg:mb-20">
          <p className="mb-3 font-semibold md:mb-4">Problems</p>
          <h1 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
            Challenges for tenderers
          </h1>
          <p className="md:text-md">
            Finding the right vendors can be complex and time-consuming.
            Traditional methods leave you searching through fragmented markets.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 md:mt-8">
            <Button title="Learn more" variant="secondary">
              Learn more
            </Button>
            <Button
              title="How it works"
              variant="link"
              size="link"
              iconRight={<ChevronRight />}
            >
              How it works
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 items-center gap-x-12 md:grid-cols-2 lg:gap-x-20">
          <div className="relative mb-8 grid auto-cols-fr grid-cols-1 grid-rows-[auto_auto] items-start md:mb-0 md:items-stretch">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                onClick={useActive.setActiveTabSetter(i)}
                className={useActive.getActiveTabButtonStyles(i)}
              >
                <h2 className="text-2xl font-bold md:text-3xl md:leading-[1.3] lg:text-4xl">
                  Fragmented market
                </h2>
                <motion.div
                  initial={false}
                  animate={useActive.getActiveTabButtonContentStyles(i)}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p className="mt-3 md:mt-4">
                    Vendors are scattered across different platforms and
                    locations. Finding the right match requires extensive
                    research.
                  </p>
                </motion.div>
              </div>
            ))}
          </div>

          <div className="flex max-h-full w-full items-center justify-center overflow-hidden">
            <AnimatePresence initial={false}>
              <TabItem
                tabItem={{
                  heading: "Short heading goes here",
                  description:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
                  image: {
                    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
                    alt: "Relume placeholder image 1",
                  },
                }}
                index={0}
                activeTab={useActive.activeTab}
              />
              <TabItem
                tabItem={{
                  heading: "Short heading goes here",
                  description:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
                  video: {
                    image: {
                      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-video-thumbnail.svg",
                      alt: "Relume placeholder image 2",
                    },
                    url: "https://www.youtube.com/embed/8DKLYsikxTs?si=Ch9W0KrDWWUiCMMW",
                  },
                }}
                index={1}
                activeTab={useActive.activeTab}
              />
              <TabItem
                tabItem={{
                  heading: "Short heading goes here",
                  description:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
                  image: {
                    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
                    alt: "Relume placeholder image 3",
                  },
                }}
                index={2}
                activeTab={useActive.activeTab}
              />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

// --------------------------------------------------
// Layout491_1
// --------------------------------------------------
const Layout491_1 = () => {
  const useActive = useRelume();
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mx-auto mb-12 max-w-lg text-center md:mb-18 lg:mb-20">
          <p className="mb-3 font-semibold md:mb-4">Solutions</p>
          <h1 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
            Streamline your tender process
          </h1>
          <p className="md:text-md">
            Tenderly transforms how you find and select vendors. Our platform
            simplifies complex procurement challenges.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 md:mt-8">
            <Button title="Get started" variant="secondary">
              Get started
            </Button>
            <Button
              title="Explore features"
              variant="link"
              size="link"
              iconRight={<ChevronRight />}
            >
              Explore features
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 items-center gap-x-12 md:grid-cols-2 lg:gap-x-20">
          <div className="relative mb-8 grid auto-cols-fr grid-cols-1 grid-rows-[auto_auto] items-start md:mb-0 md:items-stretch">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                onClick={useActive.setActiveTabSetter(i)}
                className={useActive.getActiveTabButtonStyles(i)}
              >
                <h2 className="text-2xl font-bold md:text-3xl md:leading-[1.3] lg:text-4xl">
                  Reach multiple bidders
                </h2>
                <motion.div
                  initial={false}
                  animate={useActive.getActiveTabButtonContentStyles(i)}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p className="mt-3 md:mt-4">
                    Post your tender once and instantly connect with multiple
                    qualified suppliers. No more endless phone calls.
                  </p>
                </motion.div>
              </div>
            ))}
          </div>

          <div className="flex max-h-full w-full items-center justify-center overflow-hidden">
            <AnimatePresence initial={false}>
              <TabItem
                tabItem={{
                  heading: "Short heading goes here",
                  description:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
                  image: {
                    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
                    alt: "Relume placeholder image 1",
                  },
                }}
                index={0}
                activeTab={useActive.activeTab}
              />
              <TabItem
                tabItem={{
                  heading: "Short heading goes here",
                  description:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
                  video: {
                    image: {
                      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-video-thumbnail.svg",
                      alt: "Relume placeholder image 2",
                    },
                    url: "https://www.youtube.com/embed/8DKLYsikxTs?si=Ch9W0KrDWWUiCMMW",
                  },
                }}
                index={1}
                activeTab={useActive.activeTab}
              />
              <TabItem
                tabItem={{
                  heading: "Short heading goes here",
                  description:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
                  image: {
                    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
                    alt: "Relume placeholder image 3",
                  },
                }}
                index={2}
                activeTab={useActive.activeTab}
              />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

// --------------------------------------------------
// Layout491_2
// --------------------------------------------------
const Layout491_2 = () => {
  const useActive = useRelume();
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mx-auto mb-12 max-w-lg text-center md:mb-18 lg:mb-20">
          <p className="mb-3 font-semibold md:mb-4">Benefits</p>
          <h1 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
            Empower your bidding strategy
          </h1>
          <p className="md:text-md">
            Tenderly provides tools that help suppliers submit competitive,
            precise bids efficiently.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 md:mt-8">
            <Button title="Get started" variant="secondary">
              Get started
            </Button>
            <Button
              title="Explore platform"
              variant="link"
              size="link"
              iconRight={<ChevronRight />}
            >
              Explore platform
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 items-center gap-x-12 md:grid-cols-2 lg:gap-x-20">
          <div className="relative mb-8 grid auto-cols-fr grid-cols-1 grid-rows-[auto_auto] items-start md:mb-0 md:items-stretch">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                onClick={useActive.setActiveTabSetter(i)}
                className={useActive.getActiveTabButtonStyles(i)}
              >
                <h2 className="text-2xl font-bold md:text-3xl md:leading-[1.3] lg:text-4xl">
                  Clarify project details
                </h2>
                <motion.div
                  initial={false}
                  animate={useActive.getActiveTabButtonContentStyles(i)}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p className="mt-3 md:mt-4">
                    Ask and answer questions publicly to understand project
                    requirements fully.
                  </p>
                </motion.div>
              </div>
            ))}
          </div>

          <div className="flex max-h-full w-full items-center justify-center overflow-hidden">
            <AnimatePresence initial={false}>
              <TabItem
                tabItem={{
                  heading: "Short heading goes here",
                  description:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
                  image: {
                    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
                    alt: "Relume placeholder image 1",
                  },
                }}
                index={0}
                activeTab={useActive.activeTab}
              />
              <TabItem
                tabItem={{
                  heading: "Short heading goes here",
                  description:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
                  video: {
                    image: {
                      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-video-thumbnail.svg",
                      alt: "Relume placeholder image 2",
                    },
                    url: "https://www.youtube.com/embed/8DKLYsikxTs?si=Ch9W0KrDWWUiCMMW",
                  },
                }}
                index={1}
                activeTab={useActive.activeTab}
              />
              <TabItem
                tabItem={{
                  heading: "Short heading goes here",
                  description:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
                  image: {
                    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
                    alt: "Relume placeholder image 3",
                  },
                }}
                index={2}
                activeTab={useActive.activeTab}
              />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

// --------------------------------------------------
// useCarousel (from Testimonial16)
// --------------------------------------------------
const useCarousel = () => {
  const [api, setApi] = useState<any>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const handleDotClick = (index: number) => () => {
    if (api) {
      api.scrollTo(index);
    }
  };

  const dotClassName = (index: number) => {
    return `mx-[3px] inline-block size-2 rounded-full ${
      current === index + 1 ? "bg-black" : "bg-neutral-light"
    }`;
  };

  return { api, setApi, current, handleDotClick, dotClassName };
};

// --------------------------------------------------
// Testimonial16
// --------------------------------------------------
const Testimonial16 = () => {
  const carousel = useCarousel();
  return (
    <section
      id="relume"
      className="overflow-hidden px-[5%] py-16 md:py-24 lg:py-28"
    >
      <div className="container">
        <Carousel
          setApi={carousel.setApi}
          opts={{ loop: true, align: "start" }}
          className="overflow-hidden"
        >
          <div className="relative pt-20 md:pb-20 md:pt-0">
            <CarouselContent className="ml-0">
              <CarouselItem className="pl-0">
                <div className="grid w-full auto-cols-fr grid-cols-1 items-center justify-center gap-12 md:grid-cols-2 md:gap-10 lg:gap-x-20">
                  <div className="order-last md:order-first">
                    <Dialog>
                      <DialogTrigger className="relative flex w-full items-center justify-center">
                        <img
                          src="https://d22po4pjz3o32e.cloudfront.net/placeholder-video-thumbnail.svg"
                          alt="Testimonial image 1"
                          className="size-full object-cover"
                        />
                        <span className="absolute inset-0 z-10 bg-black/50" />
                        <Play className="absolute z-20 size-16 text-white" />
                      </DialogTrigger>
                      <DialogContent>
                        <iframe
                          className="w-full aspect-video"
                          src="https://www.youtube.com/embed/8DKLYsikxTs?si=Ch9W0KrDWWUiCMMW"
                          title="Video"
                          allowFullScreen
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="flex flex-col items-start">
                    <div className="mb-6 flex md:mb-8">
                      <Star className="size-6" />
                      <Star className="size-6" />
                      <Star className="size-6" />
                      <Star className="size-6" />
                      <Star className="size-6" />
                    </div>
                    <blockquote className="text-xl font-bold md:text-2xl">
                      Tenderly transformed our procurement process from weeks of
                      back-and-forth to a streamlined, transparent experience.
                    </blockquote>
                    <div className="mt-6 flex flex-nowrap items-center gap-5 md:mt-8">
                      <div>
                        <p className="font-semibold">Mohammed Al-Thani</p>
                        <p>Procurement Manager, Gulf Enterprises</p>
                      </div>
                      <div className="mx-4 w-px self-stretch bg-background-alternative sm:mx-0" />
                      <div>
                        <img
                          src="https://d22po4pjz3o32e.cloudfront.net/webflow-logo.svg"
                          alt="Webflow logo 1"
                          className="max-h-12"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
              <CarouselItem className="pl-0">
                <div className="grid w-full auto-cols-fr grid-cols-1 items-center justify-center gap-12 md:grid-cols-2 md:gap-10 lg:gap-x-20">
                  <div className="order-last md:order-first">
                    <Dialog>
                      <DialogTrigger className="relative flex w-full items-center justify-center">
                        <img
                          src="https://d22po4pjz3o32e.cloudfront.net/placeholder-video-thumbnail.svg"
                          alt="Testimonial image 1"
                          className="size-full object-cover"
                        />
                        <span className="absolute inset-0 z-10 bg-black/50" />
                        <Play className="absolute z-20 size-16 text-white" />
                      </DialogTrigger>
                      <DialogContent>
                        <iframe
                          className="w-full aspect-video"
                          src="https://www.youtube.com/embed/8DKLYsikxTs?si=Ch9W0KrDWWUiCMMW"
                          title="Video"
                          allowFullScreen
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="flex flex-col items-start">
                    <div className="mb-6 flex md:mb-8">
                      <Star className="size-6" />
                      <Star className="size-6" />
                      <Star className="size-6" />
                      <Star className="size-6" />
                      <Star className="size-6" />
                    </div>
                    <blockquote className="text-xl font-bold md:text-2xl">
                      Tenderly transformed our procurement process from weeks of
                      back-and-forth to a streamlined, transparent experience.
                    </blockquote>
                    <div className="mt-6 flex flex-nowrap items-center gap-5 md:mt-8">
                      <div>
                        <p className="font-semibold">Mohammed Al-Thani</p>
                        <p>Procurement Manager, Gulf Enterprises</p>
                      </div>
                      <div className="mx-4 w-px self-stretch bg-background-alternative sm:mx-0" />
                      <div>
                        <img
                          src="https://d22po4pjz3o32e.cloudfront.net/webflow-logo.svg"
                          alt="Webflow logo 1"
                          className="max-h-12"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            </CarouselContent>
            <div className="absolute top-0 flex w-full items-start justify-between md:bottom-0 md:top-auto md:items-end">
              <div className="mt-2.5 flex w-full items-start justify-start md:mb-2.5 md:mt-0">
                <button
                  onClick={carousel.handleDotClick(0)}
                  className={carousel.dotClassName(0)}
                />
                <button
                  onClick={carousel.handleDotClick(1)}
                  className={carousel.dotClassName(1)}
                />
              </div>
              <div className="flex items-end justify-end gap-2 md:gap-4">
                <CarouselPrevious className="static right-0 top-0 size-12 -translate-y-0" />
                <CarouselNext className="static right-0 top-0 size-12 -translate-y-0" />
              </div>
            </div>
          </div>
        </Carousel>
      </div>
    </section>
  );
};

// --------------------------------------------------
// Stats55
// --------------------------------------------------
const Stats55 = () => (
  <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
    <div className="container">
      <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-[0.5fr_1fr] lg:items-center lg:gap-x-20">
        <div>
          <p className="mb-3 font-semibold md:mb-4">Impact</p>
          <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
            Tenderly's growth and market transformation
          </h2>
          <p className="md:text-md">
            Our platform continues to expand, connecting more businesses and
            delivering tangible results across industries.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
            <Button title="Explore" variant="secondary">
              Explore
            </Button>
            <Button
              title="Learn"
              variant="link"
              size="link"
              iconRight={<ChevronRight />}
            >
              Learn
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8 py-2 md:grid-cols-2">
          <div className="flex flex-col justify-center border border-border-primary p-8 text-center">
            <p className="mb-2 text-10xl font-bold leading-[1.3] md:text-[4rem] lg:text-[5rem]">
              500+
            </p>
            <h3 className="text-md font-bold leading-[1.4] md:text-xl">
              Tenders posted monthly
            </h3>
          </div>
          <div className="flex flex-col justify-center border border-border-primary p-8 text-center">
            <p className="mb-2 text-10xl font-bold leading-[1.3] md:text-[4rem] lg:text-[5rem]">
              250+
            </p>
            <h3 className="text-md font-bold leading-[1.4] md:text-xl">
              Active suppliers
            </h3>
          </div>
          <div className="flex flex-col justify-center border border-border-primary p-8 text-center">
            <p className="mb-2 text-10xl font-bold leading-[1.3] md:text-[4rem] lg:text-[5rem]">
              85%
            </p>
            <h3 className="text-md font-bold leading-[1.4] md:text-xl">
              User satisfaction rate
            </h3>
          </div>
          <div className="flex flex-col justify-center border border-border-primary p-8 text-center">
            <p className="mb-2 text-10xl font-bold leading-[1.3] md:text-[4rem] lg:text-[5rem]">
              3 days
            </p>
            <h3 className="text-md font-bold leading-[1.4] md:text-xl">
              Average tender resolution time
            </h3>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// --------------------------------------------------
// Layout494
// --------------------------------------------------
const Layout494 = () => {
  const useActive = useRelume();
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="relative flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 md:pr-6 lg:pr-10">
            <div className="order-last md:order-first">
              <div className="mb-8 md:hidden">
                <p className="mb-3 font-semibold md:mb-4">Tagline</p>
                <h1 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
                  Medium length section heading goes here
                </h1>
                <p className="md:text-md">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Suspendisse varius enim in eros elementum tristique. Duis
                  cursus, mi quis viverra ornare, eros dolor interdum nulla, ut
                  commodo diam libero vitae erat.
                </p>
              </div>
            </div>
            <div className="static flex flex-col flex-wrap justify-stretch md:block">
              <div className="relative grid auto-cols-fr grid-cols-1 grid-rows-[auto_auto] items-start md:mb-0 md:items-stretch">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    onClick={useActive.setActiveTabSetter(i)}
                    className={clsx(
                      "cursor-pointer border-b border-border-primary py-4",
                      {
                        "opacity-100": useActive.activeTab === i,
                        "opacity-25": useActive.activeTab !== i,
                      }
                    )}
                  >
                    <h2 className="text-xl font-bold md:text-2xl">
                      Vague specifications
                    </h2>
                    <motion.div
                      initial={false}
                      animate={useActive.getActiveTabButtonContentStyles(i)}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="mt-2">
                        Unclear project requirements make quoting risky and
                        time-consuming for suppliers.
                      </p>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
              <Button title="Learn more" variant="secondary">
                Learn more
              </Button>
              <Button
                title="How it works"
                variant="link"
                size="link"
                iconRight={<ChevronRight />}
              >
                How it works
              </Button>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex max-h-full items-center justify-center overflow-hidden">
            <AnimatePresence initial={false}>
              <TabItem
                tabItem={{
                  heading: "Short heading goes here",
                  description:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
                  image: {
                    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
                    alt: "Relume placeholder image 1",
                  },
                }}
                index={0}
                activeTab={useActive.activeTab}
              />
              <TabItem
                tabItem={{
                  heading: "Short heading goes here",
                  description:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
                  video: {
                    image: {
                      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-video-thumbnail.svg",
                      alt: "Relume placeholder image 2",
                    },
                    url: "https://www.youtube.com/embed/8DKLYsikxTs?si=Ch9W0KrDWWUiCMMW",
                  },
                }}
                index={1}
                activeTab={useActive.activeTab}
              />
              <TabItem
                tabItem={{
                  heading: "Short heading goes here",
                  description:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
                  image: {
                    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
                    alt: "Relume placeholder image 3",
                  },
                }}
                index={2}
                activeTab={useActive.activeTab}
              />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

// --------------------------------------------------
// Cta1
// --------------------------------------------------
const Cta1 = () => (
  <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
    <div className="container">
      <div className="grid grid-cols-1 gap-x-20 gap-y-12 md:gap-y-16 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
            Transform your tendering journey
          </h2>
          <p className="md:text-md">
            Take the first step towards simplified procurement and connect with
            the right suppliers in minutes.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 md:mt-8">
            <Button title="Post">Post</Button>
            <Button title="Button" variant="secondary">
              Button
            </Button>
          </div>
        </div>
        <div>
          <img
            src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
            className="w-full object-cover"
            alt="Relume placeholder image"
          />
        </div>
      </div>
    </div>
  </section>
);

// --------------------------------------------------
// Header84
// --------------------------------------------------
const Header84 = () => (
  <section id="relume" className="px-[5%] py-12 md:py-16 lg:py-20">
    <div className="container">
      <div className="grid auto-cols-fr grid-cols-1 border border-border-primary lg:grid-cols-2">
        <div className="flex flex-col justify-center p-8 md:p-12">
          <h1 className="mb-5 text-6xl font-bold md:mb-6 md:text-9xl lg:text-10xl">
            Post once. Get multiple quotes.
          </h1>
          <p className="md:text-md">
            A centralized tender marketplace connecting individuals and
            businesses. Describe your project, and watch bidders reply
            instantly.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
            <Button title="Post tender" variant="primary">
              Post tender
            </Button>
            <Button title="Browse tenders" variant="secondary">
              Browse tenders
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <img
            src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
            className="w-full object-cover"
            alt="Relume placeholder image"
          />
        </div>
      </div>
    </div>
  </section>
);

// --------------------------------------------------
// Layout370_1
// --------------------------------------------------
const Layout370_1 = () => (
  <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
    <div className="container">
      <div className="rb-12 mb-12 md:mb-18 lg:mb-20">
        <div className="mx-auto max-w-lg text-center">
          <p className="mb-3 font-semibold md:mb-4">Discover</p>
          <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
            How Tenderly transforms procurement
          </h2>
          <p className="md:text-md">
            A simple platform connecting buyers and suppliers with unprecedented
            efficiency
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:gap-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-4">
          {[
            {
              tag: "Smart",
              title: "Post your tender",
              desc: "Create detailed project requirements in minutes",
              link: "Learn",
            },
            {
              tag: "Smart",
              title: "Post your tender",
              desc: "Create detailed project requirements in minutes",
              link: "Learn",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex flex-col border border-border-primary"
            >
              <div className="flex items-center justify-center">
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                  alt="Relume placeholder image"
                  className="w-full object-cover"
                />
              </div>
              <div className="flex flex-col justify-center p-6">
                <div>
                  <p className="mb-2 text-sm font-semibold">{item.tag}</p>
                  <h3 className="mb-2 text-xl font-bold md:text-2xl">
                    {item.title}
                  </h3>
                  <p>{item.desc}</p>
                </div>
                <div className="mt-5 flex items-center gap-4 md:mt-6">
                  <Button
                    title={item.link}
                    variant="link"
                    size="link"
                    iconRight={<ChevronRight />}
                  >
                    {item.link}
                  </Button>
                </div>
              </div>
            </div>
          ))}

          <div className="grid grid-cols-1 border border-border-primary sm:col-span-2 sm:row-span-1 sm:grid-cols-2">
            <div className="flex items-center justify-center">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-portrait.svg"
                alt="Relume placeholder image 3"
                className="size-full object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col justify-center p-6">
              <div>
                <p className="mb-2 text-sm font-semibold">Secure</p>
                <h3 className="mb-2 text-xl font-bold md:text-2xl">
                  Complete your project with confidence
                </h3>
                <p>Negotiate and award the best supplier for your needs</p>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-4 md:mt-6">
                <Button
                  title="Award"
                  variant="link"
                  size="link"
                  iconRight={<ChevronRight />}
                >
                  Award
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// --------------------------------------------------
// Layout370
// --------------------------------------------------
const Layout370 = () => (
  <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
    <div className="container">
      <div className="rb-12 mb-12 md:mb-18 lg:mb-20">
        <div className="mx-auto max-w-lg text-center">
          <p className="mb-3 font-semibold md:mb-4">Process</p>
          <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
            How Tenderly works
          </h2>
          <p className="md:text-md">
            Three simple steps to transform your tendering experience.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:gap-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-4">
          {[
            {
              step: "Step 1",
              title: "Post your tender",
              desc: "Describe your project with clear, concise details.",
              link: "Learn more",
            },
            {
              step: "Step 1",
              title: "Post your tender",
              desc: "Describe your project with clear, concise details.",
              link: "Learn more",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex flex-col border border-border-primary"
            >
              <div className="flex items-center justify-center">
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                  alt="Relume placeholder image"
                  className="w-full object-cover"
                />
              </div>
              <div className="flex flex-col justify-center p-6">
                <div>
                  <p className="mb-2 text-sm font-semibold">{item.step}</p>
                  <h3 className="mb-2 text-xl font-bold md:text-2xl">
                    {item.title}
                  </h3>
                  <p>{item.desc}</p>
                </div>
                <div className="mt-5 flex items-center gap-4 md:mt-6">
                  <Button
                    title={item.link}
                    variant="link"
                    size="link"
                    iconRight={<ChevronRight />}
                  >
                    {item.link}
                  </Button>
                </div>
              </div>
            </div>
          ))}

          <div className="grid grid-cols-1 border border-border-primary sm:col-span-2 sm:row-span-1 sm:grid-cols-2">
            <div className="flex items-center justify-center">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-portrait.svg"
                alt="Relume placeholder image 3"
                className="size-full object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col justify-center p-6">
              <div>
                <p className="mb-2 text-sm font-semibold">Step 3</p>
                <h3 className="mb-2 text-xl font-bold md:text-2xl">
                  Award and communicate
                </h3>
                <p>Select the best bidder and finalize your project details.</p>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-4 md:mt-6">
                <Button
                  title="Learn more"
                  variant="link"
                  size="link"
                  iconRight={<ChevronRight />}
                >
                  Learn more
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// --------------------------------------------------
// Layout237
// --------------------------------------------------
const Layout237 = () => (
  <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
    <div className="container">
      <div className="flex flex-col items-center">
        <div className="rb-12 mb-12 w-full max-w-lg text-center md:mb-18 lg:mb-20">
          <p className="mb-3 font-semibold md:mb-4">Process</p>
          <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
            How Tenderly transforms tendering
          </h2>
          <p className="md:text-md">
            We simplify complex procurement with a clear, transparent platform.
            Connect, compare, and contract seamlessly.
          </p>
        </div>

        <div className="grid grid-cols-1 items-start justify-center gap-y-12 md:grid-cols-3 md:gap-x-8 md:gap-y-16 lg:gap-x-12">
          {[
            {
              title: "For tenderers",
              desc: "Post detailed project requirements with confidence.",
            },
            {
              title: "For suppliers",
              desc: "Submit precise bids matching exact project specifications.",
            },
            {
              title: "Award process",
              desc: "Select the most suitable vendor through transparent evaluation.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex w-full flex-col items-center text-center"
            >
              <div className="rb-5 mb-5 md:mb-6">
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg"
                  alt="Relume logo 1"
                  className="size-12"
                />
              </div>
              <h3 className="mb-5 text-2xl font-bold md:mb-6 md:text-3xl md:leading-[1.3] lg:text-4xl">
                {item.title}
              </h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-center gap-4 md:mt-14 lg:mt-16">
          <Button variant="secondary">Learn more</Button>
          <Button iconRight={<ChevronRight />} variant="link" size="link">
            Get started
          </Button>
        </div>
      </div>
    </div>
  </section>
);

// --------------------------------------------------
// Layout399
// --------------------------------------------------
const Layout399 = () => (
  <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
    <div className="container">
      <div className="mb-12 md:mb-18 lg:mb-20">
        <div className="mx-auto max-w-lg text-center">
          <p className="mb-3 font-semibold md:mb-4">Use cases</p>
          <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
            Real projects in Qatar
          </h2>
          <p className="md:text-md">
            Discover how Tenderly transforms local service procurement across
            multiple industries.
          </p>
        </div>
      </div>

      <div className="grid auto-cols-fr grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {[
          {
            tag: "Home",
            title: "Home services simplified",
            desc: "Clean apartments without the hassle of endless phone calls.",
            link: "Explore",
          },
          {
            tag: "Automotive",
            title: "Car services made transparent",
            desc: "Get precise quotes from mechanics who understand your vehicle.",
            link: "Learn",
          },
          {
            tag: "Events",
            title: "Wedding and corporate event planning",
            desc: "Connect with vendors who match your exact event requirements.",
            link: "Discover",
          },
          {
            tag: "Construction",
            title: "Home renovation made easy",
            desc: "Find contractors who understand your specific renovation needs.",
            link: "View",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="flex flex-col border border-border-primary"
          >
            <div className="flex flex-1 flex-col justify-center p-6">
              <div>
                <p className="mb-2 text-sm font-semibold">{item.tag}</p>
                <h3 className="mb-2 text-lg font-bold leading-[1.4] md:text-2xl">
                  {item.title}
                </h3>
                <p>{item.desc}</p>
              </div>
              <div className="mt-5 md:mt-6">
                <Button
                  title={item.link}
                  variant="link"
                  size="link"
                  iconRight={<ChevronRight />}
                >
                  {item.link}
                </Button>
              </div>
            </div>
            <div className="flex w-full flex-col items-center justify-center self-start">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                alt="Relume placeholder image 1"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// --------------------------------------------------
// Layout312
// --------------------------------------------------
const Layout312 = () => (
  <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
    <div className="container">
      <div className="mb-12 grid grid-cols-1 gap-5 md:mb-18 md:grid-cols-2 md:gap-x-12 md:gap-y-8 lg:mb-20 lg:gap-x-20">
        <div>
          <p className="mb-3 font-semibold md:mb-4">Business</p>
          <h2 className="text-5xl font-bold md:text-7xl lg:text-8xl">
            Professional solutions for enterprise needs
          </h2>
        </div>
        <div>
          <p className="md:text-md">
            Streamline your procurement process with targeted, efficient
            tendering. We help businesses find the right partners quickly and
            transparently.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-y-12 md:grid-cols-2 md:gap-x-8 md:gap-y-16 lg:grid-cols-4">
        {[
          {
            title: "Facilities management",
            desc: "Comprehensive maintenance solutions for modern workspaces.",
          },
          {
            title: "IT services",
            desc: "Technology support tailored to your specific infrastructure.",
          },
          {
            title: "Cloud solutions",
            desc: "Scalable and secure cloud infrastructure for growing businesses.",
          },
          {
            title: "Network management",
            desc: "Robust connectivity solutions designed for enterprise performance.",
          },
        ].map((item) => (
          <div key={item.title}>
            <div className="mb-5 flex justify-center md:mb-6">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                alt="Relume placeholder image 1"
              />
            </div>
            <h3 className="mb-3 text-xl font-bold md:mb-4 md:text-2xl">
              {item.title}
            </h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap items-center gap-4 md:mt-18 lg:mt-20">
        <Button title="Learn more" variant="secondary">
          Learn more
        </Button>
        <Button
          title="Get started"
          variant="link"
          size="link"
          iconRight={<ChevronRight />}
        >
          Get started
        </Button>
      </div>
    </div>
  </section>
);

// --------------------------------------------------
// Faq2
// --------------------------------------------------
const Faq2 = () => (
  <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
    <div className="container">
      <div className="rb-12 mb-12 w-full max-w-lg md:mb-18 lg:mb-20">
        <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
          FAQs
        </h2>
        <p className="md:text-md">
          Get answers to the most common questions about our tender marketplace
        </p>
      </div>

      <Accordion type="multiple">
        {[
          {
            q: "How does Tenderly work?",
            a: "Tenderly connects buyers and suppliers through a digital platform where you can post projects, receive bids, and negotiate terms anonymously until award",
          },
          {
            q: "Is the platform free?",
            a: "Posting tenders and browsing opportunities is free. We charge a small commission only when a project is successfully awarded",
          },
          {
            q: "How secure is my information?",
            a: "We use advanced encryption and privacy protocols to protect user data and ensure confidential communications",
          },
          {
            q: "Can I use Tenderly for any project?",
            a: "Our platform supports a wide range of services from home maintenance to complex business procurement",
          },
          {
            q: "How quickly can I get bids?",
            a: "Most tenders receive multiple competitive bids within 24 to 48 hours of posting",
          },
        ].map((item, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger className="md:py-5 md:text-md">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">{item.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mt-12 md:mt-18 lg:mt-20">
        <h4 className="mb-3 text-2xl font-bold md:mb-4 md:text-3xl md:leading-[1.3] lg:text-4xl">
          Need more information?
        </h4>
        <p className="md:text-md">
          Our support team is ready to help you navigate the platform
        </p>
        <div className="mt-6 md:mt-8">
          <Button title="Contact" variant="secondary">
            Contact
          </Button>
        </div>
      </div>
    </div>
  </section>
);

// --------------------------------------------------
// Footer3
// --------------------------------------------------
const Footer3 = () => (
  <footer id="relume" className="px-[5%] py-12 md:py-18 lg:py-20">
    <div className="container">
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
            <p className="mb-1 text-sm font-semibold">Address</p>
            <p className="mb-5 text-sm md:mb-6">
              Level 1, 12 Tender Street, Sydney NSW 2000
            </p>
            <p className="mb-1 text-sm font-semibold">Contact</p>
            <a
              href="tel:1800 123 4567"
              className="block text-sm underline decoration-black underline-offset-1"
            >
              1800 Tender Help
            </a>
            <a
              href="mailto:info@relume.io"
              className="block text-sm underline decoration-black underline-offset-1"
            >
              info@relume.io
            </a>
          </div>
          <div className="grid grid-flow-col grid-cols-[max-content] items-start justify-start gap-x-3">
            <a href="#">
              <Facebook className="size-6" />
            </a>
            <a href="#">
              <Instagram className="size-6" />
            </a>
            <a href="#">
              <Twitter className="size-6 p-0.5" />
            </a>
            <a href="#">
              <Linkedin className="size-6" />
            </a>
            <a href="#">
              <Youtube className="size-6" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-x-6 gap-y-10 md:grid-cols-2 md:gap-x-8 md:gap-y-4">
          <ul>
            {["Home", "About us", "Services", "Blog", "Pricing"].map((link) => (
              <li key={link} className="py-2 text-sm font-semibold">
                <a href="#">{link}</a>
              </li>
            ))}
          </ul>
          <ul>
            {[
              "Careers",
              "Partners",
              "Resources",
              "Community",
              "Help center",
            ].map((link) => (
              <li key={link} className="py-2 text-sm font-semibold">
                <a href="#">{link}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="h-px w-full bg-black" />
      <div className="flex flex-col-reverse items-start justify-between pb-4 pt-6 text-sm md:flex-row md:items-center md:pb-0 md:pt-8">
        <p className="mt-8 md:mt-0">© 2024 Relume. All rights reserved.</p>
        <ul className="grid grid-flow-row grid-cols-[max-content] justify-center gap-y-4 text-sm md:grid-flow-col md:gap-x-6 md:gap-y-0">
          <li className="underline">
            <a href="#">Privacy policy</a>
          </li>
          <li className="underline">
            <a href="#">Terms of service</a>
          </li>
          <li className="underline">
            <a href="#">Cookie settings</a>
          </li>
        </ul>
      </div>
    </div>
  </footer>
);

// --------------------------------------------------
// Main App Component
// --------------------------------------------------
export default function App() {
  return (
    <>
      <Navbar22 />
      <Header84 />
      <Layout491 />
      <Layout491_1 />
      <Layout491_2 />
      <Layout494 />
      <Layout370 />
      <Layout370_1 />
      <Layout237 />
      <Layout399 />
      <Layout312 />
      <Testimonial16 />
      <Stats55 />
      <Cta1 />
      <Faq2 />
      <Footer3 />
    </>
  );
}
