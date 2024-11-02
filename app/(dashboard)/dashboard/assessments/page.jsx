"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Download, Eye, PlayCircle, Plus, Search, Video } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const assessments = [
  {
    id: 1,
    positionFor: "Frontend Developer",
    name: "John Doe",
    nip: "12345",
    position: "Software Engineer",
    schedule: "2024-03-15 10:00",
    status: "Scheduled",
  },
  {
    id: 2,
    positionFor: "UX Designer",
    name: "Jane Smith",
    nip: "23456",
    position: "UI/UX Designer",
    schedule: "2024-03-16 14:00",
    status: "In Progress",
  },
  {
    id: 3,
    positionFor: "Project Manager",
    name: "Mike Johnson",
    nip: "34567",
    position: "Team Lead",
    schedule: "2024-03-17 11:00",
    status: "Completed",
  },
  {
    id: 4,
    positionFor: "Backend Developer",
    name: "Emily Brown",
    nip: "45678",
    position: "Software Engineer",
    schedule: "2024-03-18 09:00",
    status: "Scheduled",
  },
  {
    id: 5,
    positionFor: "Data Analyst",
    name: "Chris Wilson",
    nip: "56789",
    position: "Business Analyst",
    schedule: "2024-03-19 13:00",
    status: "In Progress",
  },
];

const departments = [
  "All",
  "Engineering",
  "Design",
  "Management",
  "Data Science",
];
const statuses = ["All", "Scheduled", "In Progress", "Completed"];

export default function AssessmentsPage() {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [status, setStatus] = useState("All");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredAssessments = assessments.filter(
    (assessment) =>
      (assessment.name.toLowerCase().includes(search.toLowerCase()) ||
        assessment.nip.includes(search) ||
        assessment.positionFor.toLowerCase().includes(search.toLowerCase())) &&
      (department === "All" || assessment.position.includes(department)) &&
      (status === "All" || assessment.status === status)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 p-6"
    >
      <div className="flex items-center text-sm text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground">
          Dashboard
        </Link>
        <span className="mx-2">/</span>
        <span>Assessments</span>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Assessments</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create Assessment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Assessment</DialogTitle>
              <DialogDescription>
                Set up a new assessment for a candidate.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="position" className="text-right">
                  Position
                </Label>
                <Input id="position" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="candidate" className="text-right">
                  Candidate
                </Label>
                <Input id="candidate" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Date
                </Label>
                <Input id="date" type="date" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={() => setIsDialogOpen(false)}>
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
        <div className="flex gap-2">
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Position For</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>NIP</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Assessment Schedule</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAssessments.map((assessment) => (
            <TableRow key={assessment.id}>
              <TableCell>{assessment.positionFor}</TableCell>
              <TableCell className="font-medium">{assessment.name}</TableCell>
              <TableCell>{assessment.nip}</TableCell>
              <TableCell>{assessment.position}</TableCell>
              <TableCell>{assessment.schedule}</TableCell>
              <TableCell>{assessment.status}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      <span>View Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <PlayCircle className="mr-2 h-4 w-4" />
                      <span>Start Assessment</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Video className="mr-2 h-4 w-4" />
                      <span>Join Assessment</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Download className="mr-2 h-4 w-4" />
                      <span>Download Report</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
}
