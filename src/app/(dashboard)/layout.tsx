"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dumbbell, Camera, Activity, Menu, X, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserButton } from "@clerk/nextjs";
import Chatbot from "@/components/landing/Chatbot";

const navItems = [
  {
    href: "/workout",
    icon: <Dumbbell className="h-5 w-5" />,
    label: "Workouts",
  },
  {
    href: "/nutrition",
    icon: <Camera className="h-5 w-5" />,
    label: "Nutrition",
  },
  {
    href: "/weight",
    icon: <Scale className="h-5 w-5" />,
    label: "Weight",
  },
  {
    href: "/dashboard",
    icon: <Activity className="h-5 w-5" />,
    label: "Dashboard",
  },
];

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavItem = ({ href, icon, label, isActive }: NavItemProps) => (
  <Link href={href} className="w-full">
    <Button
      variant={isActive ? "default" : "ghost"}
      className={`w-full justify-start gap-3 rounded-xl ${
        isActive
          ? "bg-fitness-primary text-white"
          : "text-gray-400 hover:text-white"
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Button>
  </Link>
);

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#1B1B25] text-white">
      <aside className="hidden lg:flex flex-col lg:w-72 bg-[#22222e] p-6 fixed h-full z-40">
        <Link href="/">
          <div className="flex items-center gap-2 mb-10">
            {/* Logo SVG */}
            <svg
              className="h-8 w-8 text-fitness-primary"
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
            <span className="text-xl font-bold bg-clip-text bg-gradient-to-r from-fitness-primary to-white text-transparent">
              Fit<span className="font-light">Motion</span>
            </span>
          </div>
        </Link>

        <nav className="space-y-2 flex-1">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={pathname === item.href}
            />
          ))}
        </nav>

        <Separator className="my-6 bg-gray-800" />

        <div className="mt-auto p-4">
          <UserButton afterSignOutUrl="/" />
        </div>
      </aside>

      {/* Main content */}

      <div className="flex-1 lg:ml-72">
        {/* Mobile header */}

        <header className="lg:hidden sticky top-0 flex items-center justify-between p-4 border-b border-gray-800 bg-[#22222e] z-50">
          <div className="flex items-center gap-2">
            {/* Mobile Logo SVG */}
            <svg
              className="h-7 w-7 text-fitness-primary"
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
            <span className="text-lg font-bold bg-clip-text bg-gradient-to-r from-fitness-primary to-white text-transparent">
              Fit<span className="font-light">Motion</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <UserButton afterSignOutUrl="/" />
            <Button
              variant="ghost"
              className="p-1"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </header>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed top-16 left-0 right-0 bottom-0 z-[60] bg-[#1B1B25]">
            <nav className="p-4 space-y-2">
              {navItems.map((item) => (
                <NavItem
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  isActive={pathname === item.href}
                />
              ))}
            </nav>
          </div>
        )}

        <main className="p-4 relative">{children}</main>
      </div>

      <Chatbot />
    </div>
  );
}
