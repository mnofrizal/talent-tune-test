"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { format } from "date-fns";
import { Calendar, Plus, Search, Upload, Video, X } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function RoomsPage() {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);

  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchAssessments();
  }, []);

  async function fetchAssessments() {
    try {
      setLoading(true);
      const response = await fetch("/api/assessments");
      if (!response.ok) {
        throw new Error("Failed to fetch assessments");
      }
      const { data } = await response.json();
      setAssessments(data);
    } catch (err) {
      setError(err.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch assessments",
      });
    } finally {
      setLoading(false);
    }
  }

  const filteredAssessments = assessments
    .flatMap((assessment) =>
      assessment.participants.map((participant) => ({
        ...assessment,
        participant,
      }))
    )
    .filter((assessment) =>
      assessment.judul?.toLowerCase().includes(search.toLowerCase())
    );

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
  };

  const handleCloseDialog = () => {
    setSelectedRoom(null);
  };

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "SCHEDULED":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleActionButton = (action) => {
    let toastMessage = "";
    switch (action) {
      case "start":
        toastMessage = `Assessment for ${selectedRoom.judul} has started`;
        router.push(`/dashboard/rooms/${selectedRoom.id}`);
        break;
      case "join":
        if (
          selectedRoom.metodePelaksanaan === "online" &&
          selectedRoom.linkOnline
        ) {
          window.open(selectedRoom.linkOnline, "_blank");
        } else {
          toastMessage = `Joining the assessment for ${selectedRoom.judul}`;
          router.push(`/dashboard/rooms/${selectedRoom.id}`);
        }
        break;
      case "cancel":
      case "reschedule":
      case "invite":
        toastMessage = `Action ${action} for ${selectedRoom.judul}`;
        break;
    }
    toast({
      title: action.charAt(0).toUpperCase() + action.slice(1),
      description: toastMessage,
    });
    handleCloseDialog();
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} className="h-[200px] w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 p-6"
    >
      <div className="flex items-center text-sm text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground">
          Dashboard
        </Link>
        <span className="mx-2">/</span>
        <span>Rooms</span>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Assessment Rooms</h1>
      </div>

      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search assessments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8"
        />
      </div>

      <motion.div layout className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {filteredAssessments.length === 0 ? (
            <div className="col-span-full py-10 text-center">
              <p className="text-muted-foreground">No assessments found</p>
            </div>
          ) : (
            filteredAssessments.map((assessment, index) => (
              <motion.div
                key={index}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Card
                  className="cursor-pointer"
                  onClick={() => handleRoomClick(assessment)}
                >
                  <CardHeader className="relative">
                    <CardTitle className="text-xl">
                      {assessment.judul}
                    </CardTitle>
                    <span
                      className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        assessment.participant.status
                      )}`}
                    >
                      {assessment.participant.status || "N/A"}
                    </span>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold">
                      {assessment.participant.schedule
                        ? format(
                            new Date(assessment.participant.schedule),
                            "dd MMM"
                          )
                        : "N/A"}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {assessment.materi}
                    </p>
                    <p className="mt-2 text-sm">
                      Participant: {assessment.participant.user?.name || "N/A"}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <div className="flex -space-x-2">
                      {assessment.evaluators.map((evaluator) => (
                        <Avatar
                          key={evaluator.userId}
                          className="border-2 border-background"
                        >
                          <AvatarFallback>
                            {getInitials(evaluator.user.name)}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>

      <Dialog open={!!selectedRoom} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedRoom?.judul}</DialogTitle>
            <DialogDescription>
              {selectedRoom?.materi} - {selectedRoom?.metodePelaksanaan}
              {selectedRoom?.ruangan && ` - ${selectedRoom.ruangan}`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <p>
              <strong>Participant:</strong>{" "}
              {selectedRoom?.participant.user?.name || "N/A"}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {selectedRoom?.participant.status || "N/A"}
            </p>
            <p>
              <strong>Schedule:</strong>{" "}
              {selectedRoom?.participant.schedule
                ? format(new Date(selectedRoom.participant.schedule), "PPP p")
                : "N/A"}
            </p>
            <p>
              <strong>Evaluators:</strong>{" "}
              {selectedRoom?.evaluators
                .map((evaluator) => evaluator.user.name)
                .join(", ")}
            </p>
          </div>
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            {selectedRoom?.participant.status === "SCHEDULED" && (
              <Button onClick={() => handleActionButton("start")}>
                Start Assessment
              </Button>
            )}
            {selectedRoom?.participant.status === "IN_PROGRESS" && (
              <Button onClick={() => handleActionButton("join")}>
                {selectedRoom.metodePelaksanaan === "online"
                  ? "Join Meeting"
                  : "Join Room"}
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => handleActionButton("cancel")}
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={() => handleActionButton("reschedule")}
            >
              Reschedule
            </Button>
            {selectedRoom?.metodePelaksanaan === "online" && (
              <Button
                variant="outline"
                onClick={() => handleActionButton("invite")}
              >
                <Video className="mr-2 h-4 w-4" />
                Send Invitation
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
