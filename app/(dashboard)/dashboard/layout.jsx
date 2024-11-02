"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  BarChart2,
  Settings,
  Menu,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Candidates", href: "/dashboard/candidates", icon: Users },
  { name: "Assessments", href: "/dashboard/assessments", icon: ClipboardCheck },
  { name: "Reports", href: "/dashboard/reports", icon: BarChart2 },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
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

  const showSidebar = isMounted && (!isMobile || sidebarOpen);

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
              <nav className="flex flex-col gap-1 p-4">
                <AnimatePresence>
                  {sidebarItems.map((item, index) => (
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
                  ))}
                </AnimatePresence>
              </nav>
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
            <Button variant="ghost" size="sm">
              Account
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
