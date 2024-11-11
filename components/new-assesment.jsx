"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ChevronRight, ChevronLeft, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/sonner";

export function NewAssessmentDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState("offline");
  const [assessmentData, setAssessmentData] = useState({
    title: "",
    materi: "",
    method: "offline",
    roomId: null,
    virtualMeetingLink: "",
    documentPath: null,
    evaluators: [],
    candidates: [],
  });

  const [evaluatorSearch, setEvaluatorSearch] = useState("");
  const [candidateSearch, setCandidateSearch] = useState("");
  const [evaluators, setEvaluators] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    // Fetch evaluators
    const fetchEvaluators = async () => {
      try {
        const response = await fetch("/api/users?role=EVALUATOR");
        const data = await response.json();
        setEvaluators(data);
      } catch (error) {
        console.error("Failed to fetch evaluators:", error);
        toast.error("Failed to load evaluators");
      }
    };

    // Fetch candidates
    const fetchCandidates = async () => {
      try {
        const response = await fetch("/api/users?role=USER");
        const data = await response.json();
        setCandidates(data);
      } catch (error) {
        console.error("Failed to fetch candidates:", error);
        toast.error("Failed to load candidates");
      }
    };

    if (isOpen) {
      fetchEvaluators();
      fetchCandidates();
    }
  }, [isOpen]);

  const handleNextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePreviousStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleAddEvaluator = (evaluator) => {
    if (!assessmentData.evaluators.find((e) => e.id === evaluator.id)) {
      setAssessmentData((prev) => ({
        ...prev,
        evaluators: [...prev.evaluators, evaluator],
      }));
    }
  };

  const handleRemoveEvaluator = (evaluatorId) => {
    setAssessmentData((prev) => ({
      ...prev,
      evaluators: prev.evaluators.filter((e) => e.id !== evaluatorId),
    }));
  };

  const handleAddCandidate = (candidate) => {
    if (!assessmentData.candidates.find((c) => c.id === candidate.id)) {
      setAssessmentData((prev) => ({
        ...prev,
        candidates: [...prev.candidates, candidate],
      }));
    }
  };

  const handleRemoveCandidate = (candidateId) => {
    setAssessmentData((prev) => ({
      ...prev,
      candidates: prev.candidates.filter((c) => c.id !== candidateId),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/assessments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(assessmentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create assessment");
      }

      const newAssessment = await response.json();
      toast.success("Assessment created successfully");
      setIsOpen(false);
      router.push(`/dashboard/assessments/${newAssessment.id}`);
    } catch (error) {
      console.error("Assessment creation error:", error);
      toast.error(error.message || "Failed to create assessment");
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Judul
              </Label>
              <Input
                id="title"
                className="col-span-3"
                value={assessmentData.title}
                onChange={(e) =>
                  setAssessmentData((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="materi" className="text-right">
                Materi
              </Label>
              <Input
                id="materi"
                className="col-span-3"
                value={assessmentData.materi}
                onChange={(e) =>
                  setAssessmentData((prev) => ({
                    ...prev,
                    materi: e.target.value,
                  }))
                }
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Metode Pelaksanaan</Label>
              <RadioGroup
                value={method}
                onValueChange={(value) => {
                  setMethod(value);
                  setAssessmentData((prev) => ({
                    ...prev,
                    method: value,
                  }));
                }}
                className="col-span-3 flex"
                required
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="offline" id="offline" />
                  <Label htmlFor="offline">Offline</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="online" id="online" />
                  <Label htmlFor="online">Online</Label>
                </div>
              </RadioGroup>
            </div>
            {method === "offline" ? (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="room" className="text-right">
                  Ruangan
                </Label>
                <Select
                  onValueChange={(value) =>
                    setAssessmentData((prev) => ({
                      ...prev,
                      roomId: parseInt(value),
                    }))
                  }
                  required
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Pilih ruangan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Ruang Rapat 1</SelectItem>
                    <SelectItem value="2">Ruang Rapat 2</SelectItem>
                    <SelectItem value="3">Ruang Rapat 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="link" className="text-right">
                  Link Virtual Meeting
                </Label>
                <Input
                  id="link"
                  className="col-span-3"
                  value={assessmentData.virtualMeetingLink}
                  onChange={(e) =>
                    setAssessmentData((prev) => ({
                      ...prev,
                      virtualMeetingLink: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="document" className="text-right">
                Nota Dinas
              </Label>
              <Input
                id="document"
                type="file"
                className="col-span-3"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setAssessmentData((prev) => ({
                      ...prev,
                      documentPath: file.name,
                    }));
                  }
                }}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Pilih Evaluator</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    Tambah Evaluator
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" side="bottom" align="start">
                  <Command>
                    <CommandInput
                      placeholder="Cari evaluator..."
                      value={evaluatorSearch}
                      onValueChange={setEvaluatorSearch}
                    />
                    <CommandList>
                      <CommandEmpty>No evaluators found.</CommandEmpty>
                      <CommandGroup>
                        {evaluators
                          .filter(
                            (evaluator) =>
                              evaluator.name
                                .toLowerCase()
                                .includes(evaluatorSearch.toLowerCase()) ||
                              evaluator.position
                                .toLowerCase()
                                .includes(evaluatorSearch.toLowerCase())
                          )
                          .map((evaluator) => (
                            <CommandItem
                              key={evaluator.id}
                              value={evaluator.name}
                              onSelect={() => handleAddEvaluator(evaluator)}
                            >
                              <div>
                                <div>{evaluator.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {evaluator.position}
                                </div>
                              </div>
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <div className="flex flex-wrap gap-2">
                {assessmentData.evaluators.map((evaluator) => (
                  <Badge
                    key={evaluator.id}
                    variant="secondary"
                    className="flex items-center"
                  >
                    {evaluator.name}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2 h-4 w-4 p-0"
                      onClick={() => handleRemoveEvaluator(evaluator.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Pilih Kandidat</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    Tambah Kandidat
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" side="bottom" align="start">
                  <Command>
                    <CommandInput
                      placeholder="Cari kandidat..."
                      value={candidateSearch}
                      onValueChange={setCandidateSearch}
                    />
                    <CommandList>
                      <CommandEmpty>No candidates found.</CommandEmpty>
                      <CommandGroup>
                        {candidates
                          .filter(
                            (candidate) =>
                              candidate.name
                                .toLowerCase()
                                .includes(candidateSearch.toLowerCase()) ||
                              candidate.position
                                .toLowerCase()
                                .includes(candidateSearch.toLowerCase())
                          )
                          .map((candidate) => (
                            <CommandItem
                              key={candidate.id}
                              value={candidate.name}
                              onSelect={() => handleAddCandidate(candidate)}
                            >
                              <div>
                                <div>{candidate.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {candidate.position}
                                </div>
                              </div>
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <div className="flex flex-wrap gap-2">
                {assessmentData.candidates.map((candidate) => (
                  <Badge
                    key={candidate.id}
                    variant="secondary"
                    className="flex items-center"
                  >
                    {candidate.name}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2 h-4 w-4 p-0"
                      onClick={() => handleRemoveCandidate(candidate.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Assessment
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Assessment</DialogTitle>
          <DialogDescription>
            {step === 1 && "Fill in basic assessment details"}
            {step === 2 && "Select evaluators for the assessment"}
            {step === 3 && "Select candidates for the assessment"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          <DialogFooter>
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePreviousStep}
                className="mr-2"
                disabled={loading}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
            )}
            {step < 3 ? (
              <Button type="button" onClick={handleNextStep} disabled={loading}>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Assessment"
                )}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
