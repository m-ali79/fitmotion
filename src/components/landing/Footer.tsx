"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { socialLinks, footerLinks } from "@/lib/constants";

const Footer = () => {
  const year = new Date().getFullYear();

  const handleLinkClick = (href: string) => {
    if (href.startsWith("#")) {
      const element = document.getElementById(href.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer className="bg-black text-white pt-24 md:pt-32 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top section with logo and text */}
        <div className="mb-12 md:mb-16">
          <Link href="/" className="flex items-center mb-3">
            <div className="relative h-12 w-12 bg-fitness-primary rounded-md flex items-center justify-center overflow-hidden">
              <svg
                className="h-8 w-8 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <span className="text-xl md:text-2xl lg:text-3xl font-bold text-white ml-3">
              Fit<span className="text-fitness-primary">Motion</span>
            </span>
          </Link>
          <p className="text-base md:text-lg text-gray-400 max-w-md">
            Get results with smart workouts tailored to your fitness goals
          </p>
        </div>

        {/* Links section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-x-6 gap-y-10 pb-16">
          {/* Logo and social links */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex space-x-5 mb-8">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-full bg-fitness-gray flex items-center justify-center text-white hover:bg-fitness-primary transition-colors duration-300"
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <IconComponent size={20} />
                  </motion.a>
                );
              })}
            </div>

            {/* App store buttons container  */}
            <div className="flex flex-wrap gap-3">
              <a href="#" className="inline-block">
                <div className="bg-fitness-card flex items-center justify-center gap-2 py-2 px-4 rounded-lg hover:bg-fitness-gray transition-colors">
                  <svg
                    className="h-6 w-6 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.37-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.37C2.08 14.75 3.26 6.12 9.15 5.93c1.53-.07 2.6.78 3.48.78.87 0 2.51-.98 4.22-.83 1.73.15 3.06.9 3.93 2.31-3.47 2.11-2.92 6.82.35 8.43-.95 1.92-2.2 3.81-4.08 4.66z" />
                    <path d="M12.9 4.21c.17-1.65 1.46-3.02 3.08-3.21.24 1.78-.46 3.28-1.42 4.36-.94 1.05-2.21 1.88-3.76 1.71-.23-1.6.46-3.09 1.4-4.14.23-.27.47-.51.7-.72z" />
                  </svg>
                  <div>
                    <div className="text-xs text-gray-400">Download on the</div>
                    <div className="text-sm font-semibold text-white">
                      App Store
                    </div>
                  </div>
                </div>
              </a>
              {/* Google Play Store Button */}
              <a
                href="#"
                className="inline-flex items-center justify-center px-4 py-2 bg-fitness-card rounded-lg hover:bg-fitness-gray transition-colors"
              >
                <svg
                  className="h-6 w-6 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M3 22V2L21 12L3 22Z" />
                </svg>
                <span className="ml-3 text-white">
                  <span className="block text-xs text-gray-400">GET IT ON</span>
                  <span className="block text-sm font-medium">Google Play</span>
                </span>
              </a>
            </div>
          </div>

          {/* Middle gap - only show on large screens */}
          <div className="hidden lg:block"></div>

          {/* Responsive link sections container */}
          <div className="sm:col-span-2 lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-10">
            {footerLinks.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-5">
                  {section.title}
                </h4>
                <ul className="space-y-4">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href={link.href}
                        onClick={(e) => {
                          if (link.href.startsWith("#")) {
                            e.preventDefault();
                            handleLinkClick(link.href);
                          }
                        }}
                        className="text-base text-white hover:text-fitness-primary transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Big logo section */}
        <div className="border-t border-gray-800 py-14 flex justify-center">
          <div className="flex flex-col items-center">
            <div className="flex items-center mb-3">
              <div className="relative h-14 w-14 md:h-20 md:w-20 bg-fitness-primary rounded-md flex items-center justify-center overflow-hidden">
                <svg
                  className="h-10 w-10 md:h-14 md:w-14 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h1 className="ml-4 text-4xl md:text-6xl lg:text-7xl font-bold">
                Fit<span className="text-fitness-primary">Motion</span>
              </h1>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 mb-4 md:mb-0">
            © {year} FitMotion. All rights reserved
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link
              href="/refund"
              className="text-sm text-gray-500 hover:text-white transition-colors duration-200"
            >
              Refund Policy
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-gray-500 hover:text-white transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-gray-500 hover:text-white transition-colors duration-200"
            >
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
