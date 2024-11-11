"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPin, Wifi, X, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function MultiStepAssessmentForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [evaluators, setEvaluators] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [formData, setFormData] = useState({
    judul: "",
    materi: "",
    metodePelaksanaan: "offline",
    ruangan: "",
    linkOnline: "",
    notaDinas: null,
    evaluators: [],
    participants: [],
  });

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files?.[0] || null : value,
    }));
  };

  const handleSelectChange = (name) => (value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEvaluatorSelect = (evaluatorId) => {
    const selectedEvaluator = evaluators.find((e) => e.id === evaluatorId);
    if (
      selectedEvaluator &&
      !formData.evaluators.some((e) => e.id === evaluatorId)
    ) {
      setFormData((prev) => ({
        ...prev,
        evaluators: [...prev.evaluators, selectedEvaluator],
      }));
    }
  };

  const handleRemoveEvaluator = (evaluatorId) => {
    setFormData((prev) => ({
      ...prev,
      evaluators: prev.evaluators.filter((e) => e.id !== evaluatorId),
    }));
  };

  const handleUserSelect = (userId) => {
    const selectedUser = candidates.find((u) => u.id === userId);
    if (selectedUser && !formData.participants.some((u) => u.id === userId)) {
      setFormData((prev) => ({
        ...prev,
        participants: [...prev.participants, { ...selectedUser, schedule: "" }],
      }));
    }
  };

  const handleRemoveUser = (userId) => {
    setFormData((prev) => ({
      ...prev,
      participants: prev.participants.filter((u) => u.id !== userId),
    }));
  };

  const handleUserScheduleChange = (userId, schedule) => {
    setFormData((prev) => ({
      ...prev,
      participants: prev.participants.map((u) =>
        u.id === userId ? { ...u, schedule } : u
      ),
    }));
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        return (
          formData.judul &&
          formData.materi &&
          formData.metodePelaksanaan &&
          (formData.metodePelaksanaan === "offline"
            ? formData.ruangan
            : formData.linkOnline)
        );
      case 2:
        return formData.evaluators.length > 0;
      case 3:
        return (
          formData.participants.length > 0 &&
          formData.participants.every((user) => user.schedule)
        );
      default:
        return false;
    }
  };

  const handleNextStep = (e) => {
    e.preventDefault(); // Prevent any form submission
    console.log("Next button clicked, current step:", step);
    if (validateStep()) {
      if (step < 3) {
        console.log("Moving to next step");
        setStep(step + 1);
      }
    } else {
      console.log("Validation failed for step:", step);
      alert("Please fill in all required fields before proceeding.");
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submit button clicked, current step:", step);
    if (validateStep() && step === 3) {
      try {
        const response = await fetch("/api/assessments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            judul: formData.judul,
            materi: formData.materi,
            metodePelaksanaan: formData.metodePelaksanaan,
            ruangan: formData.ruangan,
            linkOnline: formData.linkOnline,
            notaDinas: formData.notaDinas,
            evaluators: formData.evaluators.map((evaluator) => evaluator.id),
            participants: formData.participants.map((participant) => ({
              userId: participant.id,
              schedule: participant.schedule,
            })),
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to create assessment");
        }

        const result = await response.json();
        console.log("Assessment created:", result);

        setIsOpen(false);
        // Reset the form data
        setFormData({
          judul: "",
          materi: "",
          metodePelaksanaan: "offline",
          ruangan: "",
          linkOnline: "",
          notaDinas: null,
          evaluators: [],
          participants: [],
        });
        setStep(1);
        // toast.success("Assessment created successfully");
      } catch (error) {
        console.error("Failed to create assessment:", error);
        // toast.error(error.message || "Failed to create assessment");
      }
    } else {
      console.log("Submit validation failed or not on final step");
      alert(
        "Please fill in all required fields and complete all steps before submitting."
      );
    }
  };

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

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="judul">Judul</Label>
              <Input
                id="judul"
                name="judul"
                value={formData.judul}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="materi">Materi</Label>
              <Input
                id="materi"
                name="materi"
                value={formData.materi}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label>Metode Pelaksanaan</Label>
              <RadioGroup
                name="metodePelaksanaan"
                value={formData.metodePelaksanaan}
                onValueChange={handleSelectChange("metodePelaksanaan")}
                className="grid grid-cols-2 gap-4 pt-2"
              >
                <div>
                  <RadioGroupItem
                    value="offline"
                    id="offline"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="offline"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <MapPin className="mb-3 h-6 w-6" />
                    Offline
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="online"
                    id="online"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="online"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Wifi className="mb-3 h-6 w-6" />
                    Online
                  </Label>
                </div>
              </RadioGroup>
            </div>
            {formData.metodePelaksanaan === "offline" ? (
              <div>
                <Label htmlFor="ruangan">Ruangan</Label>
                <Select
                  name="ruangan"
                  value={formData.ruangan}
                  onValueChange={handleSelectChange("ruangan")}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih ruangan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ruang1">Ruang 1</SelectItem>
                    <SelectItem value="ruang2">Ruang 2</SelectItem>
                    <SelectItem value="ruang3">Ruang 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div>
                <Label htmlFor="linkOnline">Link Zoom/Teams</Label>
                <Input
                  id="linkOnline"
                  name="linkOnline"
                  value={formData.linkOnline}
                  onChange={handleInputChange}
                  placeholder="https://zoom.us/j/example"
                  required={formData.metodePelaksanaan === "online"}
                />
              </div>
            )}
            <div>
              <Label htmlFor="notaDinas">Nota Dinas</Label>
              <Input
                id="notaDinas"
                name="notaDinas"
                type="file"
                onChange={handleInputChange}
                className="cursor-pointer"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="evaluator">Pilih Evaluator</Label>
              <Select onValueChange={handleEvaluatorSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih evaluator" />
                </SelectTrigger>
                <SelectContent>
                  {evaluators.map((evaluator) => (
                    <SelectItem key={evaluator.id} value={evaluator.id}>
                      {evaluator.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {formData.evaluators.length === 0 && (
              <p className="text-red-500">
                Please select at least one evaluator.
              </p>
            )}
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {formData.evaluators.map((evaluator) => (
                  <Card key={evaluator.id}>
                    <CardContent className="flex items-center p-4">
                      <Avatar className="mr-4 h-10 w-10">
                        <AvatarImage
                          src={evaluator.avatar}
                          alt={evaluator.name}
                        />
                        <AvatarFallback>
                          {evaluator.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-grow">
                        <h3 className="font-semibold">{evaluator.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {evaluator.jabatan}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveEvaluator(evaluator.id)}
                        aria-label={`Remove ${evaluator.name}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="user">Pilih User</Label>
              <Select onValueChange={handleUserSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih user" />
                </SelectTrigger>
                <SelectContent>
                  {candidates.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {formData.participants.length === 0 && (
              <p className="text-red-500">
                Please select at least one user and set their schedule.
              </p>
            )}
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {formData.participants.map((user) => (
                  <Card key={user.id}>
                    <CardContent className="flex items-center p-4">
                      <Avatar className="mr-4 h-10 w-10">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-grow">
                        <h3 className="font-semibold">{user.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {user.jabatan}
                        </p>
                        <Input
                          type="datetime-local"
                          value={user.schedule || ""}
                          onChange={(e) =>
                            handleUserScheduleChange(user.id, e.target.value)
                          }
                          className="mt-2"
                          required
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveUser(user.id)}
                        aria-label={`Remove ${user.name}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
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
          <Plus className="mr-2 h-4 w-4" /> New Assessment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[700px]">
        <DialogTitle className="hidden">Multi-Step Assessment Form</DialogTitle>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>
              Step {step} of 3 -{" "}
              {step === 1
                ? "Assessment Details"
                : step === 2
                ? "Evaluators"
                : "Users"}
            </CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>{renderStep()}</CardContent>
            <CardFooter className="flex justify-between">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePreviousStep}
                >
                  Previous
                </Button>
              )}
              {step < 3 ? (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  disabled={!validateStep()}
                >
                  Next
                </Button>
              ) : (
                <Button type="submit" disabled={!validateStep() || step < 3}>
                  Submit
                </Button>
              )}
            </CardFooter>
          </form>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
