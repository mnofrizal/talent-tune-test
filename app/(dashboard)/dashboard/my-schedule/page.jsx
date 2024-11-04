"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Clock, MapPin, Upload } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Dummy data for demonstration
const schedules = {
  upcoming: [
    {
      id: 1,
      date: new Date(2024, 1, 28),
      startTime: "09:00",
      endTime: "09:30",
      title: "30min Assessment Meeting with John",
      location: "Online",
      participants: [
        { name: "John Doe", image: "https://i.pravatar.cc/150?img=1" },
        { name: "Leslie Smith", image: "https://i.pravatar.cc/150?img=2" },
      ],
      status: "Undangan",
      roomId: "room-1",
    },
    {
      id: 2,
      date: new Date(2024, 1, 29),
      startTime: "11:15",
      endTime: "11:45",
      title: "30min Assessment Meeting with Team",
      location: "Online",
      participants: [
        { name: "Olivia Brown", image: "https://i.pravatar.cc/150?img=3" },
        { name: "Liam Wilson", image: "https://i.pravatar.cc/150?img=4" },
        { name: "Alban Jones", image: "https://i.pravatar.cc/150?img=5" },
      ],
      status: "Proses Fit and Proper",
      roomId: "room-2",
    },
    {
      id: 3,
      date: new Date(2024, 1, 30),
      startTime: "15:20",
      endTime: "16:20",
      title: "Leadership Assessment",
      location: "Meeting Room 1, Floor 3",
      participants: [
        { name: "Emma Davis", image: "https://i.pravatar.cc/150?img=6" },
        { name: "James Miller", image: "https://i.pravatar.cc/150?img=7" },
        { name: "Sophia Taylor", image: "https://i.pravatar.cc/150?img=8" },
        { name: "William Anderson", image: "https://i.pravatar.cc/150?img=9" },
      ],
      status: "Perencanaan",
      roomId: "room-3",
    },
  ],
  pending: [],
  recurring: [],
  past: [],
  cancelled: [],
};

const timelineSteps = [
  "Perencanaan",
  "Undangan",
  "Proses Fit and Proper",
  "Feedback",
  "Selesai",
];

export default function MySchedulePage() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const router = useRouter();

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleCloseDialog = () => {
    setSelectedEvent(null);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Here you would typically handle the file upload to your server
      console.log("File selected:", file.name);
    }
  };

  const handleJoinRoom = (roomId) => {
    router.push(`/dashboard/rooms/${roomId}`);
  };

  const isJoinButtonDisabled = (event) => {
    const now = new Date();
    const eventStart = new Date(event.date);
    eventStart.setHours(parseInt(event.startTime.split(":")[0]));
    eventStart.setMinutes(parseInt(event.startTime.split(":")[1]));
    return now < eventStart;
  };

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
          <TabsTrigger value="recurring">Recurring</TabsTrigger>
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
                  >
                    <Card
                      className="cursor-pointer transition-shadow hover:shadow-md"
                      onClick={() => handleEventClick(event)}
                    >
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

      <Dialog open={selectedEvent !== null} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <div className="col-span-3">
                {selectedEvent && format(selectedEvent.date, "MMMM d, yyyy")}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">
                Time
              </Label>
              <div className="col-span-3">
                {selectedEvent?.startTime} - {selectedEvent?.endTime}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <div className="col-span-3">{selectedEvent?.location}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <div className="col-span-3">{selectedEvent?.status}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="timeline" className="text-right">
                Timeline
              </Label>
              <div className="col-span-3">
                <div className="flex items-center space-x-2">
                  {timelineSteps.map((step, index) => (
                    <div key={step} className="flex items-center">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          timelineSteps.indexOf(selectedEvent?.status) >= index
                            ? "bg-primary"
                            : "bg-muted"
                        }`}
                      ></div>
                      {index < timelineSteps.length - 1 && (
                        <div
                          className={`w-8 h-0.5 ${
                            timelineSteps.indexOf(selectedEvent?.status) > index
                              ? "bg-primary"
                              : "bg-muted"
                          }`}
                        ></div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-1 flex justify-between text-xs">
                  {timelineSteps.map((step) => (
                    <span key={step}>{step.charAt(0)}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="file" className="text-right">
                Upload PPTX
              </Label>
              <div className="col-span-3">
                <Input
                  id="file"
                  type="file"
                  accept=".pptx"
                  onChange={handleFileUpload}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={() =>
                selectedEvent && handleJoinRoom(selectedEvent.roomId)
              }
              disabled={selectedEvent && isJoinButtonDisabled(selectedEvent)}
            >
              Join Room
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
