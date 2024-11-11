"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  Video,
  BarChart2,
  Settings,
  Menu,
  X,
  Calendar,
  LogOut,
  UserPlus,
  PenLine,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";

// Define menu items with role restrictions
const menuItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["ADMINISTRATOR", "USER", "EVALUATOR"],
  },
  {
    name: "Users",
    href: "/dashboard/users",
    icon: UserPlus,
    roles: ["ADMINISTRATOR"],
  },
  {
    name: "Candidates",
    href: "/dashboard/candidates",
    icon: Users,
    roles: ["ADMINISTRATOR"],
  },
  {
    name: "Assessments",
    href: "/dashboard/assessments",
    icon: ClipboardCheck,
    roles: ["ADMINISTRATOR"],
  },
  {
    name: "Rooms",
    href: "/dashboard/rooms",
    icon: Video,
    roles: ["ADMINISTRATOR", "USER", "EVALUATOR"],
  },
  {
    name: "Reports",
    href: "/dashboard/reports",
    icon: BarChart2,
    roles: ["ADMINISTRATOR"],
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    roles: ["ADMINISTRATOR"],
  },
  {
    name: "My Schedule",
    href: "/dashboard/my-schedule",
    icon: Calendar,
    roles: ["ADMINISTRATOR", "USER", "EVALUATOR"],
  },
  {
    name: "Penilaian",
    href: "/dashboard/settings",
    icon: PenLine,
    roles: ["EVALUATOR"],
  },
];

const sidebarVariants = {
  open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
  closed: {
    x: "-100%",
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
};

const linkVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const sidebarRef = useRef(null);
  const { user, loading } = useAuth();

  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();

    const handleOutsideClick = (event) => {
      if (
        isMobile &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        setSidebarOpen(false);
      }
    };

    const handleResize = () => {
      checkMobile();
      if (!isMobile) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isMobile]);

  const handleNavigation = (href) => {
    router.push(href);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        router.push("/auth/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const showSidebar = isMounted && (!isMobile || sidebarOpen);

  // Filter menu items based on user role
  const filteredMenuItems = loading
    ? menuItems.filter((item) => item.roles.includes("USER")) // Show basic menu during loading
    : menuItems.filter((item) => !user?.role || item.roles.includes(user.role));

  // Render loading state or error state if not authenticated
  if (!isMounted) return null;
  if (!loading && !user) {
    router.push("/auth/login");
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AnimatePresence>
        {showSidebar && (
          <motion.aside
            ref={sidebarRef}
            initial={isMobile ? "closed" : "open"}
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            className={cn(
              "fixed inset-y-0 left-0 z-50 w-64 bg-white",
              isMobile ? "shadow-lg" : "shadow-none lg:static"
            )}
          >
            <div className="flex h-full flex-col border-r">
              <div className="flex h-16 items-center justify-between px-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Link href="/dashboard" className="text-xl font-semibold">
                    TalentTune
                  </Link>
                </motion.div>
                {isMobile && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <X className="h-6 w-6" />
                  </Button>
                )}
              </div>

              {/* Navigation Menu */}
              <nav className="flex flex-1 flex-col gap-1 p-4">
                <AnimatePresence mode="wait">
                  {loading ? (
                    // Show loading skeleton during loading
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="px-3 py-2">
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-5 w-5" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  ) : (
                    // Show actual menu items when loaded
                    filteredMenuItems.map((item, index) => (
                      <motion.div
                        key={item.name}
                        variants={linkVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ delay: index * 0.1 }}
                      >
                        <Button
                          variant="ghost"
                          className={cn(
                            "w-full justify-start gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100",
                            pathname === item.href && "bg-gray-100 font-medium"
                          )}
                          onClick={() => handleNavigation(item.href)}
                        >
                          <item.icon className="h-5 w-5" />
                          {item.name}
                        </Button>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </nav>

              {/* User Profile Section */}
              <AnimatePresence mode="wait">
                {loading ? (
                  <div className="border-t p-4">
                    <div className="mb-3 flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="mb-1 h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                    <Skeleton className="h-9 w-full" />
                  </div>
                ) : (
                  user && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-t p-4"
                    >
                      <div className="mb-3 flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {user.name?.charAt(0) || user.email.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-gray-900">
                            {user.name || user.email}
                          </p>
                          <p className="truncate text-xs text-gray-500">
                            {user.role}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-5 w-5" />
                        Logout
                      </Button>
                    </motion.div>
                  )
                )}
              </AnimatePresence>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Navbar */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex h-16 items-center justify-between border-b bg-white px-4 lg:px-6"
        >
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          )}
          <div className="ml-auto flex items-center gap-4">
            <Button variant="ghost" size="sm">
              Help
            </Button>
          </div>
        </motion.header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-white p-4 lg:p-2">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
