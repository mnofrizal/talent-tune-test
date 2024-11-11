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
import { NewAssessmentDialog } from "@/components/new-assesment";

const assessments = [
  {
    id: 1,
    positionFor: "MANAGER SINTANG POWER GENERATION UNIT",
    name: "John Doe",
    nip: "12345",
    position: "JUNIOR TECHNICIAN OPERASI CONTROL ROOM UNIT 2 (D) BLT POMU",
    schedule: "2024-03-15 10:00",
    status: "Scheduled",
  },
  {
    id: 2,
    positionFor: "KEPALA SATUAN PROJECT MANAGEMENT",
    name: "Jane Smith",
    nip: "23456",
    position: "JUNIOR TECHNICIAN OPERASI CONTROL ROOM UNIT 2 (A) BLT POMU",
    schedule: "2024-03-16 14:00",
    status: "In Progress",
  },
  {
    id: 3,
    positionFor: "ASSISTANT MANAGER PENGADAAN BARANG DAN JASA UNIT 1-4 SLA PGU",
    name: "Mike Johnson",
    nip: "34567",
    position: "JUNIOR TECHNICIAN OPERASI CONTROL ROOM UNIT 2 (C) BLB PGU",
    schedule: "2024-03-17 11:00",
    status: "Completed",
  },
  {
    id: 4,
    positionFor: "ASSISTANT MANAGER AKUNTANSI DAN ANGGARAN BLI PGU",
    name: "Emily Brown",
    nip: "45678",
    position: "JUNIOR TECHNICIAN OPERASI CONTROL ROOM UNIT 1 (A) BLB PGU",
    schedule: "2024-03-18 09:00",
    status: "Scheduled",
  },
  {
    id: 5,
    positionFor: "ASSISTANT MANAGER PEMELIHARAAN LISTRIK UNIT 5-7 SLA PGU",
    name: "Chris Wilson",
    nip: "56789",
    position: "JUNIOR TECHNICIAN OPERASI CONTROL ROOM UNIT 1 (D) BLB PGU",
    schedule: "2024-03-19 13:00",
    status: "In Progress",
  },
  {
    id: 6,
    positionFor: "OFFICER KNOWLEDGE MANAGEMENT DAN INOVASI SLA PGU",
    name: "Sarah Davis",
    nip: "67890",
    position: "JUNIOR TECHNICIAN OPERASI CONTROL ROOM UNIT 2 (D) BLB PGU",
    schedule: "2024-03-20 15:00",
    status: "Scheduled",
  },
  {
    id: 7,
    positionFor: "MANAGER SINTANG POWER GENERATION UNIT",
    name: "Alex Turner",
    nip: "78901",
    position: "JUNIOR TECHNICIAN OPERASI CONTROL ROOM UNIT 2 (C) BLT POMU",
    schedule: "2024-03-21 10:30",
    status: "In Progress",
  },
];

const departments = ["All", "BLT POMU", "BLB PGU", "SLA PGU", "BLI PGU"];

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
        assessment.positionFor.toLowerCase().includes(search.toLowerCase()) ||
        assessment.position.toLowerCase().includes(search.toLowerCase())) &&
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
        <NewAssessmentDialog />
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

      <div className="rounded-md border">
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
                <TableCell className="max-w-[300px] truncate">
                  {assessment.positionFor}
                </TableCell>
                <TableCell className="font-medium">{assessment.name}</TableCell>
                <TableCell>{assessment.nip}</TableCell>
                <TableCell className="max-w-[300px] truncate">
                  {assessment.position}
                </TableCell>
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
      </div>
    </motion.div>
  );
}
