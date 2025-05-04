"use client";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { navLinks } from "@/lib/constants";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-fitness-secondary/90 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <motion.div
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative h-10 w-10 bg-fitness-primary rounded-md flex items-center justify-center overflow-hidden">
                  <svg
                    className="h-6 w-6 text-white"
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
              </motion.div>
              <motion.span
                className="text-xl font-bold text-white"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                Fit
                <span className="text-fitness-primary">Motion</span>
              </motion.span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <motion.a
                key={link.title}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  if (link.href === "/") {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  } else {
                    scrollToSection(link.href.substring(1));
                  }
                }}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                {link.title}
              </motion.a>
            ))}

            <div className="flex items-center gap-3">
              <Link href="/sign-in">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    className="font-medium text-gray-300  hover:text-black"
                  >
                    Sign in
                  </Button>
                </motion.div>
              </Link>
              <Link href="/sign-up">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button className="bg-fitness-primary hover:bg-fitness-primary/90 text-white font-medium">
                    Try free
                  </Button>
                </motion.div>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <div className="flex items-center gap-2">
              <Link href="/sign-in">
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-medium text-gray-300 hover:text-black"
                >
                  Sign in
                </Button>
              </Link>
              <motion.button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-300"
                whileTap={{ scale: 0.9 }}
                aria-label={
                  isMobileMenuOpen
                    ? "Close navigation menu"
                    : "Open navigation menu"
                }
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <motion.div
        id="mobile-menu"
        className={`md:hidden ${isMobileMenuOpen ? "block" : "hidden"}`}
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: isMobileMenuOpen ? 1 : 0,
          height: isMobileMenuOpen ? "auto" : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-fitness-secondary backdrop-blur-md shadow-lg rounded-b-lg">
          {navLinks.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                if (link.href === "/") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  setIsMobileMenuOpen(false);
                } else {
                  scrollToSection(link.href.substring(1));
                }
              }}
              className="block px-3 py-4 text-base font-medium text-gray-300 hover:text-white hover:bg-fitness-gray/30 rounded-lg transition-colors duration-200"
            >
              {link.title}
            </Link>
          ))}
          <div className="pt-4 pb-2">
            <Link
              href="/sign-up"
              className="block w-full text-center px-4 py-3 bg-fitness-primary hover:bg-fitness-primary/90 text-white font-medium rounded-lg transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Try free
            </Link>
          </div>
        </div>
      </motion.div>
    </nav>
  );
};

export default Navbar;
