"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Document, Page, pdfjs } from "react-pdf";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Maximize, Minimize, ChevronLeft, ChevronRight } from "lucide-react";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

const mockUsers = [
  { id: 1, name: "John Doe", initials: "JD" },
  { id: 2, name: "Jane Smith", initials: "JS" },
  { id: 3, name: "Mike Johnson", initials: "MJ" },
  { id: 4, name: "Emily Brown", initials: "EB" },
];

export default function RoomPage() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isStarted, setIsStarted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [isContinued, setIsContinued] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { roomId } = useParams();
  const { toast } = useToast();
  const pdfContainerRef = useRef(null);
  const fullscreenContainerRef = useRef(null);
  const thumbnailsRef = useRef(null);
  const pdfUrl = useMemo(() => "/sample.pdf", []);
  const scaleRef = useRef(1);

  const pdfDimensions = useMemo(() => {
    if (pdfContainerRef.current) {
      const { width, height } = pdfContainerRef.current.getBoundingClientRect();
      return {
        width: isFullscreen ? window.innerWidth : width,
        height: isFullscreen ? window.innerHeight : height,
      };
    }
    return { width: 800, height: 1000 };
  }, [isFullscreen]);

  useEffect(() => {
    toast({
      title: "Room Joined",
      description: `You've joined room ${roomId}`,
    });
  }, [roomId, toast]);

  useEffect(() => {
    let timer;
    if (isStarted && !isTimeUp) {
      timer = setInterval(() => {
        setTimeElapsed((prevTime) => {
          if (prevTime + 1 === 60) {
            setIsTimeUp(true);
            return 60;
          }
          return prevTime + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isStarted, isTimeUp]);

  const handleFullscreenChange = useCallback(() => {
    const fullscreenElement = document.fullscreenElement;
    setIsFullscreen(!!fullscreenElement);
    if (fullscreenElement) {
      fullscreenElement.style.backgroundColor = "black";
    } else if (fullscreenContainerRef.current) {
      fullscreenContainerRef.current.style.backgroundColor = "";
    }
  }, []);

  useEffect(() => {
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [handleFullscreenChange]);

  const onDocumentLoadSuccess = useCallback(({ numPages }) => {
    setNumPages(numPages);
  }, []);

  const handleStart = useCallback(() => {
    setIsStarted(true);
    setTimeElapsed(0);
    setIsTimeUp(false);
    setIsContinued(false);
  }, []);

  const handleContinue = useCallback(() => {
    setIsTimeUp(false);
    setIsContinued(true);
  }, []);

  const handlePageChange = useCallback(
    (newPageNumber) => {
      setPageNumber((prevPageNumber) => {
        const updatedPageNumber = Math.max(
          1,
          Math.min(newPageNumber, numPages || 1)
        );
        if (thumbnailsRef.current && prevPageNumber !== updatedPageNumber) {
          const thumbnailWidth = 120 + 16; // 120px width + 16px margin
          const scrollPosition = (updatedPageNumber - 1) * thumbnailWidth;
          const scrollableWidth =
            thumbnailsRef.current.scrollWidth -
            thumbnailsRef.current.clientWidth;
          const targetScroll = Math.min(scrollPosition, scrollableWidth);
          thumbnailsRef.current.scrollTo({
            left: targetScroll,
            behavior: "smooth",
          });
        }
        return updatedPageNumber;
      });
    },
    [numPages]
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isStarted) {
        if (e.key === "ArrowRight") {
          handlePageChange(pageNumber + 1);
        } else if (e.key === "ArrowLeft") {
          handlePageChange(pageNumber - 1);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isStarted, pageNumber, handlePageChange]);

  const formatTime = useCallback((seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }, []);

  const handlePageLoadSuccess = useCallback(({ width, height }) => {
    if (pdfContainerRef.current) {
      const containerWidth = pdfContainerRef.current.offsetWidth;
      const containerHeight = pdfContainerRef.current.offsetHeight;
      const widthScale = containerWidth / width;
      const heightScale = containerHeight / height;
      scaleRef.current = Math.min(widthScale, heightScale, 1) * 1.2;
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!isFullscreen && fullscreenContainerRef.current) {
      if (fullscreenContainerRef.current.requestFullscreen) {
        fullscreenContainerRef.current.requestFullscreen();
      }
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }, [isFullscreen]);

  const pageControls = useMemo(
    () => (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`flex mt-4 items-center rounded-full bg-gray-800 bg-opacity-50 p-1
        ${
          isFullscreen
            ? " absolute bottom-4 left-1/2 -translate-x-1/2 transform"
            : " "
        }
      `}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handlePageChange(pageNumber - 1)}
          disabled={pageNumber <= 1}
          className="rounded-full text-white"
        >
          <ChevronLeft size={24} />
        </Button>
        <span className="mx-0 text-white">
          Page {pageNumber} of {numPages}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handlePageChange(pageNumber + 1)}
          disabled={pageNumber >= numPages}
          className="rounded-full text-white"
        >
          <ChevronRight size={24} />
        </Button>
        <div className="mx-1 h-4 w-[1px] bg-gray-400/50" />
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleFullscreen}
          className="rounded-full text-white"
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
        </Button>
      </motion.div>
    ),
    [isFullscreen, pageNumber, numPages, handlePageChange, toggleFullscreen]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex h-[calc(100vh-5rem)] flex-col overflow-hidden"
    >
      <div className="flex h-16 items-center justify-between bg-gray-200 px-4">
        {!isStarted ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button>Start Assessment</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will start the assessment timer.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleStart}>
                  Start
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <div>Assessment in progress</div>
        )}
        <div
          className={`text-xl font-semibold ${
            timeElapsed >= 60 ? "text-red-500" : ""
          }`}
        >
          Time: {formatTime(timeElapsed)}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex w-4/5 flex-col" ref={fullscreenContainerRef}>
          <div
            ref={pdfContainerRef}
            className={`flex-1 flex flex-col justify-center items-center overflow-auto relative ${
              isFullscreen ? "bg-black" : "bg-gray-100"
            }`}
            style={{ height: isFullscreen ? "100vh" : "auto" }}
          >
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              className="overflow-hidden rounded-xl shadow-lg"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={pageNumber}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Page
                    pageNumber={pageNumber}
                    height={isFullscreen ? pdfDimensions.height : undefined}
                    scale={isFullscreen ? undefined : scaleRef.current}
                    onLoadSuccess={handlePageLoadSuccess}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                </motion.div>
              </AnimatePresence>
            </Document>

            {pageControls}
          </div>

          {!isFullscreen && (
            <div className="border-t bg-white p-4">
              <ScrollArea className="h-full w-full" ref={thumbnailsRef}>
                <div className="flex space-x-4 p-4">
                  {Array.from(new Array(numPages), (el, index) => (
                    <motion.div
                      key={`thumb-${index}`}
                      className={`cursor-pointer rounded-lg overflow-hidden relative ${
                        pageNumber === index + 1 ? "ring-4 ring-blue-500" : ""
                      }`}
                      onClick={() => handlePageChange(index + 1)}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Document file={pdfUrl}>
                        <Page pageNumber={index + 1} width={120} />
                      </Document>
                      <motion.div
                        className="absolute left-0 top-0 h-full w-full bg-black bg-opacity-50 px-2 py-1 text-center text-xs text-white"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: pageNumber === index + 1 ? 1 : 0 }}
                        whileHover={{ opacity: 1 }}
                      >
                        <div className="mt-3 text-lg">Page {index + 1}</div>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          )}
        </div>

        <div className="w-1/5 border-l bg-white">
          <div className="p-4">
            <h2 className="mb-4 text-xl font-bold">Participants</h2>
            <ScrollArea className="h-[calc(100vh-8rem)]">
              {mockUsers.map((user) => (
                <div key={user.id} className="mb-4 flex items-center">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{user.initials}</AvatarFallback>
                  </Avatar>
                  <span className="ml-3">{user.name}</span>
                </div>
              ))}
            </ScrollArea>
          </div>
        </div>
      </div>

      {isTimeUp && !isContinued && (
        <AlertDialog open={isTimeUp} onOpenChange={setIsTimeUp}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Time's Up!</AlertDialogTitle>
              <AlertDialogDescription>
                The allocated time for this assessment has ended. You may
                continue if needed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={handleContinue}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </motion.div>
  );
}
