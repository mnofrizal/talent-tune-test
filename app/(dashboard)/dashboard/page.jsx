"use client";

import { motion } from "framer-motion";
import {
  BarChart2,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NewAssessmentDialog } from "@/components/new-assesment";

const statusCards = [
  {
    title: "Pending",
    count: 12,
    subtitle: "Assessments awaiting review",
    icon: <ClipboardList className="h-5 w-5 text-amber-600" />,
    bgColor: "bg-amber-50",
  },
  {
    title: "Ongoing",
    count: 8,
    subtitle: "Active assessments",
    icon: <Users className="h-5 w-5 text-blue-600" />,
    bgColor: "bg-blue-50",
  },
  {
    title: "Completed",
    count: 284,
    subtitle: "Total completed assessments",
    icon: <BarChart2 className="h-5 w-5 text-green-600" />,
    bgColor: "bg-green-50",
  },
];

const upcomingAssessments = [
  {
    title: "Technical Assessment",
    candidate: "John Doe",
    role: "Frontend Developer",
    date: "Tomorrow",
  },
  {
    title: "Leadership Assessment",
    candidate: "Jane Smith",
    role: "Project Manager",
    date: "Next Week",
  },
];

export default function DashboardPage() {
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold">Welcome back, Admin</h1>
        <p className="text-muted-foreground">
          Here's an overview of your assessment activities
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex gap-4"
      >
        <NewAssessmentDialog />
        <Button variant="outline">View Reports</Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid gap-4 md:grid-cols-3"
      >
        {statusCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold">
                {card.title}
              </CardTitle>
              <div className={`rounded-full p-3 ${card.bgColor}`}>
                {card.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{card.count}</div>
              <p className="text-sm text-muted-foreground">{card.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="font-medium">{currentMonth}</div>
                <Button variant="ghost" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-4 grid grid-cols-7 text-center text-sm">
                <div className="text-muted-foreground">Su</div>
                <div className="text-muted-foreground">Mo</div>
                <div className="text-muted-foreground">Tu</div>
                <div className="text-muted-foreground">We</div>
                <div className="text-muted-foreground">Th</div>
                <div className="text-muted-foreground">Fr</div>
                <div className="text-muted-foreground">Sa</div>
                {Array.from({ length: 35 }, (_, i) => (
                  <div
                    key={i}
                    className={`p-2 ${
                      i === 8
                        ? "rounded-md bg-primary text-primary-foreground"
                        : ""
                    }`}
                  >
                    {((i - 2) % 31) + 1}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Assessments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAssessments.map((assessment) => (
                  <div
                    key={assessment.candidate}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-medium">{assessment.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {assessment.candidate} • {assessment.role}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {assessment.date}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
