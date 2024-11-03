"use client";

import { useState } from "react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const rooms = [
  {
    id: 1,
    title: "Frontend Developer Interview",
    date: "2024-02-12",
    positionFor: "Senior Frontend Developer",
    status: "Scheduled",
    assignees: ["JD", "AS", "MB"],
  },
  {
    id: 2,
    title: "UX Designer Assessment",
    date: "2024-02-15",
    positionFor: "Lead UX Designer",
    status: "In Progress",
    assignees: ["EL", "RK"],
  },
  {
    id: 3,
    title: "Backend Engineer Technical Test",
    date: "2024-02-18",
    positionFor: "Backend Engineer",
    status: "Completed",
    assignees: ["TW", "SL", "JH"],
  },
  {
    id: 4,
    title: "Product Manager Interview",
    date: "2024-02-20",
    positionFor: "Senior Product Manager",
    status: "Scheduled",
    assignees: ["AM", "BN"],
  },
  {
    id: 5,
    title: "Data Scientist Coding Challenge",
    date: "2024-02-22",
    positionFor: "Data Scientist",
    status: "Scheduled",
    assignees: ["CP", "DM", "EF"],
  },
];

const offlineRooms = ["Room A", "Room B", "Room C", "Room D"];

export default function RoomsPage() {
  const [search, setSearch] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const filteredRooms = rooms.filter(
    (room) =>
      room.title.toLowerCase().includes(search.toLowerCase()) ||
      room.positionFor.toLowerCase().includes(search.toLowerCase())
  );

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
    toast({
      title: "Room Selected",
      description: `You've selected the room for ${room.title}`,
    });
  };

  const handleCloseDialog = () => {
    setSelectedRoom(null);
  };

  const handleActionButton = (action) => {
    let toastMessage = "";
    switch (action) {
      case "start":
        setSelectedRoom({ ...selectedRoom, status: "In Progress" });
        toastMessage = `Assessment for ${selectedRoom.title} has started`;
        router.push(`/dashboard/rooms/${selectedRoom.id}`);
        break;
      case "join":
        toastMessage = `Joining the assessment for ${selectedRoom.title}`;
        router.push(`/dashboard/rooms/${selectedRoom.id}`);
        break;
      case "cancel":
        toastMessage =
          selectedRoom.status === "Scheduled"
            ? `Assessment for ${selectedRoom.title} has been cancelled`
            : `Assessment for ${selectedRoom.title} has been stopped`;
        break;
      case "reschedule":
        toastMessage = `Rescheduling the assessment for ${selectedRoom.title}`;
        break;
      case "invite":
        toastMessage = `Invitation sent for ${selectedRoom.title}`;
        break;
    }
    toast({
      title: action.charAt(0).toUpperCase() + action.slice(1),
      description: toastMessage,
    });
    handleCloseDialog();
  };

  const handleCreateRoom = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newRoom = {
      id: rooms.length + 1,
      title: formData.get("title"),
      date: formData.get("date"),
      positionFor: formData.get("title"), // Assuming the title is the position for now
      status: "Scheduled",
      assignees: ["New"], // This would typically be selected or added dynamically
    };
    rooms.push(newRoom);
    setIsCreateDialogOpen(false);
    toast({
      title: "Room Created",
      description: `New room "${newRoom.title}" has been created`,
    });
  };

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
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create Room
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Room</DialogTitle>
              <DialogDescription>
                Set up a new assessment room.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateRoom}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Date & Time
                  </Label>
                  <Input
                    id="date"
                    name="date"
                    type="datetime-local"
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="method" className="text-right">
                    Method
                  </Label>
                  <Select name="method" required>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="room" className="text-right">
                    Room
                  </Label>
                  <Select name="room">
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select room" />
                    </SelectTrigger>
                    <SelectContent>
                      {offlineRooms.map((room) => (
                        <SelectItem key={room} value={room}>
                          {room}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="document" className="text-right">
                    Document
                  </Label>
                  <div className="col-span-3">
                    <Input id="document" name="document" type="file" />
                    <p className="mt-1 text-sm text-muted-foreground">
                      Upload nota dinas
                    </p>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Create Room</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search rooms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8"
        />
      </div>

      <motion.div layout className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {filteredRooms.map((room) => (
            <motion.div
              key={room.id}
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
                onClick={() => handleRoomClick(room)}
              >
                <CardHeader className="relative">
                  <CardTitle className="text-xl">{room.title}</CardTitle>
                  <span
                    className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${
                      room.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : room.status === "In Progress"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {room.status}
                  </span>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">
                    {format(new Date(room.date), "dd MMM")}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {room.positionFor}
                  </p>
                </CardContent>
                <CardFooter>
                  <div className="flex -space-x-2">
                    {room.assignees.map((assignee, index) => (
                      <Avatar
                        key={index}
                        className="border-2 border-background"
                      >
                        <AvatarFallback>{assignee}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <Dialog open={!!selectedRoom} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedRoom?.title}</DialogTitle>
            <DialogDescription>
              {selectedRoom?.positionFor} -{" "}
              {selectedRoom?.date
                ? format(new Date(selectedRoom.date), "PPP")
                : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <p>
              <strong>Status:</strong> {selectedRoom?.status}
            </p>
            <p>
              <strong>Assignees:</strong> {selectedRoom?.assignees.join(", ")}
            </p>
          </div>
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            {selectedRoom?.status === "Scheduled" && (
              <Button onClick={() => handleActionButton("start")}>
                Start Assessment
              </Button>
            )}
            {selectedRoom?.status === "In Progress" && (
              <Button onClick={() => handleActionButton("join")}>
                Join Assessment
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => handleActionButton("cancel")}
            >
              {selectedRoom?.status === "Scheduled" ? "Cancel" : "Stop"}
            </Button>
            <Button
              variant="outline"
              onClick={() => handleActionButton("reschedule")}
            >
              Reschedule
            </Button>
            <Button
              variant="outline"
              onClick={() => handleActionButton("invite")}
            >
              <Video className="mr-2 h-4 w-4" />
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
