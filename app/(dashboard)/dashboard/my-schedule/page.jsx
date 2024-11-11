"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Clock, MapPin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export default function MySchedulePage() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [schedules, setSchedules] = useState({
    upcoming: [],
    pending: [],
    past: [],
    cancelled: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchAssessments = async () => {
      if (!user) return;

      try {
        const response = await fetch("/api/assessments");
        if (!response.ok) {
          throw new Error("Failed to fetch assessments");
        }
        const { data } = await response.json();

        // Categorize assessments
        const categorizedSchedules = {
          upcoming: [],
          pending: [],
          past: [],
          cancelled: [],
        };

        data.forEach((assessment) => {
          const isUserParticipant = assessment.participants.some(
            (p) => p.userId === user.id
          );

          if (!isUserParticipant) return;

          const assessmentDate = new Date(
            assessment.participants.find((p) => p.userId === user.id).schedule
          );
          const now = new Date();

          const scheduleItem = {
            id: assessment.id,
            date: assessmentDate,
            startTime: format(assessmentDate, "HH:mm"),
            endTime: format(
              new Date(assessmentDate.getTime() + 60 * 60 * 1000),
              "HH:mm"
            ), // 1 hour duration
            title: assessment.judul,
            location:
              assessment.metodePelaksanaan === "online"
                ? assessment.linkOnline || "Online"
                : assessment.ruangan || "Offline",
            participants: assessment.participants.map((p) => ({
              name: p.user.name,
              image: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                p.user.name
              )}`,
            })),
            status: assessment.status || "Undangan",
          };

          if (assessmentDate > now) {
            categorizedSchedules.upcoming.push(scheduleItem);
          } else {
            categorizedSchedules.past.push(scheduleItem);
          }
        });

        setSchedules(categorizedSchedules);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching assessments:", error);
        toast({
          title: "Error",
          description: "Failed to fetch assessments",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchAssessments();
  }, [user]);

  const handleCardClick = (assessmentId) => {
    router.push(`/dashboard/my-schedule/${assessmentId}`);
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        Loading assessments...
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="mb-4 flex items-center text-sm text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground">
          Dashboard
        </Link>
        <span className="mx-2">/</span>
        <span>My Schedule</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold">My Schedule</h1>
        <p className="mt-2 text-muted-foreground">
          See your scheduled assessments and meetings.
        </p>
      </motion.div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        {Object.entries(schedules).map(([status, events]) => (
          <TabsContent key={status} value={status} className="mt-6">
            {events.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">No {status} events</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {events.map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => handleCardClick(event.id)}
                  >
                    <Card className="cursor-pointer transition-shadow hover:shadow-md">
                      <div className="flex items-start p-6">
                        <div className="w-24 flex-shrink-0 text-center">
                          <div className="text-sm font-medium text-muted-foreground">
                            {format(event.date, "EEE")}
                          </div>
                          <div className="text-3xl font-bold text-primary">
                            {format(event.date, "dd")}
                          </div>
                        </div>
                        <div className="ml-6 flex-grow">
                          <div className="mb-2 flex items-center gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>
                                {event.startTime} - {event.endTime}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{event.location}</span>
                            </div>
                          </div>
                          <h3 className="mb-3 text-lg font-semibold">
                            {event.title}
                          </h3>
                          <div className="flex -space-x-2">
                            {event.participants.map((participant, index) => (
                              <Avatar
                                key={index}
                                className="border-2 border-background"
                              >
                                <AvatarImage
                                  src={participant.image}
                                  alt={participant.name}
                                />
                                <AvatarFallback>
                                  {participant.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
