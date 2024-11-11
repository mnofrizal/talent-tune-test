"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Clock,
  MapPin,
  FileText,
  ChevronRight,
  Upload,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function UserAssessmentDetail() {
  const { toast } = useToast();
  const params = useParams();
  const [assessment, setAssessment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [progress, setProgress] = useState(0);
  const [attendanceConfirmed, setAttendanceConfirmed] = useState(false);
  const [attendanceType, setAttendanceType] = useState("");
  const [attendanceReason, setAttendanceReason] = useState("");
  const [questionnaireCompleted, setQuestionnaireCompleted] = useState(false);
  const [pptUploaded, setPptUploaded] = useState(false);
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState({
    question1: "",
    question2: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [assessmentStatus, setAssessmentStatus] = useState("Scheduled");

  useEffect(() => {
    async function fetchAssessmentDetails() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/assessments/${params.id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch assessment details");
        }

        const data = await response.json();
        setAssessment(data);

        // Additional logic to set initial state based on fetched data
        // You might want to adjust these based on your actual data structure
        setAssessmentStatus(data.status || "Scheduled");
      } catch (error) {
        console.error("Error fetching assessment:", error);
        toast({
          title: "Error",
          description: "Failed to load assessment details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchAssessmentDetails();
  }, [params.id, toast]);

  useEffect(() => {
    if (attendanceConfirmed && attendanceType === "tidak-hadir") {
      setProgress(100);
      setAssessmentStatus("Canceled");
    } else {
      updateProgress();
    }
  }, [
    attendanceConfirmed,
    attendanceType,
    questionnaireCompleted,
    pptUploaded,
  ]);

  const handleAttendanceConfirmation = (e) => {
    e.preventDefault();
    setAttendanceConfirmed(true);
    if (attendanceType === "tidak-hadir") {
      setAssessmentStatus("Canceled");
      setProgress(100);
    } else {
      setAssessmentStatus("Scheduled");
      updateProgress();
    }
  };

  const handleQuestionnaireSubmit = (e) => {
    e.preventDefault();
    setQuestionnaireCompleted(true);
    updateProgress();
  };

  const handlePPTUpload = (e) => {
    e.preventDefault();
    if (selectedFile) {
      setPptUploaded(true);
      updateProgress();
    }
  };

  const updateProgress = () => {
    let newProgress = 0;
    if (attendanceConfirmed) newProgress += 33;
    if (questionnaireCompleted) newProgress += 33;
    if (pptUploaded) newProgress += 34;
    setProgress(newProgress);
  };

  // Fallback evaluators if no data from API
  const defaultEvaluators = [
    { name: "Dr. Jane Smith", position: "Senior Evaluator", avatar: "JS" },
    {
      name: "Prof. Michael Johnson",
      position: "Technical Expert",
      avatar: "MJ",
    },
    { name: "Sarah Lee", position: "HR Specialist", avatar: "SL" },
  ];

  const evaluators =
    assessment?.evaluators?.map((evaluator) => ({
      name: evaluator.user.name,
      position: `${evaluator.user.jabatan} - ${evaluator.user.bidang}`,
      avatar: evaluator.user.name
        .split(" ")
        .map((n) => n[0])
        .join(""),
    })) || defaultEvaluators;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!assessment) {
    return <div>No assessment found</div>;
  }

  return (
    <div className="mx-auto p-6">
      <div className="mb-4 flex items-center text-sm text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground">
          Dashboard
        </Link>
        <span className="mx-2">/</span>
        <Link href="/dashboard/my-schedule" className="hover:text-foreground">
          My Schedule
        </Link>
        <span className="mx-2">/</span>
        <span>Assessment Detail</span>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">User Assessment Detail</h1>
        <Button disabled={progress < 100 || assessmentStatus === "Canceled"}>
          {assessmentStatus === "Canceled" ? "Canceled" : "Go to Room"}
        </Button>
      </div>

      <div className="mb-6">
        <h2 className="mb-2 text-xl font-semibold">Completion Status</h2>
        <Progress value={progress} className="w-full" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Assessment Details</CardTitle>
              <CardDescription>
                Information about your upcoming assessment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span>
                  Date: {new Date(assessment.date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span>
                  Time: {assessment.startTime} - {assessment.endTime}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span>
                  Location: {assessment.location || "Online via Zoom"}
                </span>
              </div>
              <Badge
                variant={
                  assessmentStatus === "Canceled" ? "destructive" : "default"
                }
              >
                Status: {assessmentStatus}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Evaluators</CardTitle>
              <CardDescription>Meet your assessment team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {evaluators.map((evaluator, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 rounded-lg border p-2"
                  >
                    <Avatar>
                      <AvatarImage
                        src={`https://api.dicebear.com/6.x/initials/svg?seed=${evaluator.avatar}`}
                      />
                      <AvatarFallback>{evaluator.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none">
                        {evaluator.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {evaluator.position}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card
            className={`${
              attendanceConfirmed
                ? "outline outline-1 outline-green-200"
                : "outline outline-1 outline-red-200"
            }`}
          >
            <CardHeader>
              <CardTitle>Konfirmasi Kehadiran</CardTitle>
              <CardDescription>
                Pilihan metode kehadiran Anda untuk sesi assessment
              </CardDescription>
            </CardHeader>
            <CardContent>
              {attendanceConfirmed ? (
                <Badge variant="outline">
                  {attendanceType === "hadir" ? "Hadir" : "Tidak Hadir"}
                </Badge>
              ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Konfirmasi Kehadiran</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Konfirmasi Kehadiran</DialogTitle>
                      <DialogDescription>
                        Pilih metode kehadiran Anda untuk sesi assessment
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAttendanceConfirmation}>
                      <RadioGroup
                        value={attendanceType}
                        onValueChange={(value) => {
                          setAttendanceType(value);
                          if (value === "tidak-hadir") {
                            setProgress(100);
                            setAssessmentStatus("Canceled");
                          } else {
                            updateProgress();
                          }
                        }}
                        className="grid gap-4"
                      >
                        <Label
                          htmlFor="hadir"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                        >
                          <RadioGroupItem
                            value="hadir"
                            id="hadir"
                            className="sr-only"
                          />
                          <span className="text-lg font-semibold">Hadir</span>
                        </Label>
                        <Label
                          htmlFor="tidak-hadir"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                        >
                          <RadioGroupItem
                            value="tidak-hadir"
                            id="tidak-hadir"
                            className="sr-only"
                          />
                          <span className="text-lg font-semibold">
                            Tidak Hadir
                          </span>
                        </Label>
                      </RadioGroup>
                      {attendanceType === "tidak-hadir" && (
                        <div className="mt-4">
                          <Label htmlFor="attendance-reason">
                            Alasan tidak hadir:
                          </Label>
                          <Textarea
                            id="attendance-reason"
                            value={attendanceReason}
                            onChange={(e) =>
                              setAttendanceReason(e.target.value)
                            }
                            required
                          />
                        </div>
                      )}
                      <Button type="submit" className="mt-4 w-full">
                        Konfirmasi
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </CardContent>
          </Card>

          <Card
            className={`${
              questionnaireCompleted
                ? "outline outline-1 outline-green-200"
                : "outline outline-1 outline-red-200"
            }`}
          >
            <CardHeader>
              <CardTitle>Kuisioner</CardTitle>
              <CardDescription>
                Pertanyaan yang harus dijawab sebelum assessment
              </CardDescription>
            </CardHeader>
            <CardContent>
              {questionnaireCompleted ? (
                <Badge variant="outline">Completed</Badge>
              ) : attendanceConfirmed && attendanceType === "tidak-hadir" ? (
                <Badge variant="secondary">Disabled</Badge>
              ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Isi Kuisioner</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Kuisioner</DialogTitle>
                      <DialogDescription>
                        Mohon jawab pertanyaan berikut dengan jujur dan lengkap.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleQuestionnaireSubmit}>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="question1">
                            Apa motivasi Anda mengikuti assessment ini?
                          </Label>
                          <Textarea
                            id="question1"
                            value={questionnaireAnswers.question1}
                            onChange={(e) =>
                              setQuestionnaireAnswers({
                                ...questionnaireAnswers,
                                question1: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="question2">
                            Bagaimana Anda mempersiapkan diri untuk assessment
                            ini?
                          </Label>
                          <Textarea
                            id="question2"
                            value={questionnaireAnswers.question2}
                            onChange={(e) =>
                              setQuestionnaireAnswers({
                                ...questionnaireAnswers,
                                question2: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Submit</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </CardContent>
          </Card>

          <Card
            className={`${
              pptUploaded
                ? "outline outline-1 outline-green-200"
                : "outline outline-1 outline-red-200"
            }`}
          >
            <CardHeader>
              <CardTitle>Upload PPT</CardTitle>
              <CardDescription>
                Status unggahan file presentasi Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pptUploaded ? (
                <div className="space-y-2">
                  <Badge variant="outline">
                    {selectedFile?.name || "No file selected"}
                  </Badge>
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">Change</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Change PPT</DialogTitle>
                          <DialogDescription>
                            Select a new PPT or PPTX file to upload.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handlePPTUpload}>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="ppt-file">File PPT</Label>
                              <Input
                                id="ppt-file"
                                type="file"
                                accept=".ppt,.pptx"
                                onChange={(e) =>
                                  setSelectedFile(
                                    e.target.files ? e.target.files[0] : null
                                  )
                                }
                                required
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="submit">Upload</Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                    {selectedFile && (
                      <Button variant="outline">
                        <a
                          href={URL.createObjectURL(selectedFile)}
                          download={selectedFile.name}
                        >
                          Download
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              ) : attendanceConfirmed && attendanceType === "tidak-hadir" ? (
                <Badge variant="secondary">Disabled</Badge>
              ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Upload className="mr-2 h-4 w-4" /> Upload PPT
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Upload PPT</DialogTitle>
                      <DialogDescription>
                        Pilih file PPT atau PPTX untuk diunggah.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handlePPTUpload}>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="ppt-file">File PPT</Label>
                          <Input
                            id="ppt-file"
                            type="file"
                            accept=".ppt,.pptx"
                            onChange={(e) =>
                              setSelectedFile(
                                e.target.files ? e.target.files[0] : null
                              )
                            }
                            required
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Upload</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
