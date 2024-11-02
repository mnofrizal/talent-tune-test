"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Download, Eye, PlayCircle, Search } from "lucide-react";

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

const candidates = [
  {
    id: 1,
    name: "John Doe",
    nip: "12345",
    email: "john@example.com",
    jabatan: "Frontend Developer",
    bidang: "Engineering",
    status: "Completed",
  },
  {
    id: 2,
    name: "Jane Smith",
    nip: "23456",
    email: "jane@example.com",
    jabatan: "UX Designer",
    bidang: "Design",
    status: "In Progress",
  },
  {
    id: 3,
    name: "Mike Johnson",
    nip: "34567",
    email: "mike@example.com",
    jabatan: "Project Manager",
    bidang: "Management",
    status: "Pending",
  },
  {
    id: 4,
    name: "Emily Brown",
    nip: "45678",
    email: "emily@example.com",
    jabatan: "Backend Developer",
    bidang: "Engineering",
    status: "Completed",
  },
  {
    id: 5,
    name: "Chris Wilson",
    nip: "56789",
    email: "chris@example.com",
    jabatan: "Data Analyst",
    bidang: "Data Science",
    status: "In Progress",
  },
];

const bidangs = ["All", "Engineering", "Design", "Management", "Data Science"];
const statuses = ["All", "Pending", "In Progress", "Completed"];

export default function CandidatesPage() {
  const [search, setSearch] = useState("");
  const [bidang, setBidang] = useState("All");
  const [status, setStatus] = useState("All");

  const filteredCandidates = candidates.filter(
    (candidate) =>
      (candidate.name.toLowerCase().includes(search.toLowerCase()) ||
        candidate.nip.includes(search) ||
        candidate.email.toLowerCase().includes(search.toLowerCase())) &&
      (bidang === "All" || candidate.bidang === bidang) &&
      (status === "All" || candidate.status === status)
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
        <span>Candidates</span>
      </div>

      <h1 className="text-3xl font-bold tracking-tight">Candidates</h1>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search candidates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex gap-2">
          <Select value={bidang} onValueChange={setBidang}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Bidang" />
            </SelectTrigger>
            <SelectContent>
              {bidangs.map((b) => (
                <SelectItem key={b} value={b}>
                  {b}
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
            <TableHead>Name</TableHead>
            <TableHead>NIP</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Jabatan</TableHead>
            <TableHead>Bidang</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCandidates.map((candidate) => (
            <TableRow key={candidate.id}>
              <TableCell className="font-medium">{candidate.name}</TableCell>
              <TableCell>{candidate.nip}</TableCell>
              <TableCell>{candidate.email}</TableCell>
              <TableCell>{candidate.jabatan}</TableCell>
              <TableCell>{candidate.bidang}</TableCell>
              <TableCell>{candidate.status}</TableCell>
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
