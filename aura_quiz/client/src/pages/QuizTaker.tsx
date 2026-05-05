import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, AlertCircle, CheckCircle2, XCircle, Award, Download, ChevronRight, ChevronLeft } from "lucide-react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import logo from "@/assets/logo.png";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizData {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
}

export default function QuizTaker() {
  const { id } = useParams();
  const { toast } = useToast();
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const { data: quizData, isLoading } = useQuery({
    queryKey: ["quiz", id],
    queryFn: async () => {
      const response = await fetch(`/api/quizzes/${id}`);
      if (!response.ok) throw new Error("Failed to fetch quiz");
      return response.json() as Promise<QuizData>;
    },
    enabled: !!id,
  });

  // Set time limit when quiz data is loaded
  useEffect(() => {
    if (quizData && timeLeft === null) {
      setTimeLeft(15 * 60); // 15 minutes default
    }
  }, [quizData, timeLeft]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (started && !isFinished && timeLeft !== null && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => (prev !== null ? prev - 1 : 0));
      }, 1000);
    } else if (timeLeft === 0 && !isFinished) {
      finishQuiz();
    }
    return () => clearInterval(timer);
  }, [started, isFinished, timeLeft]);

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return "00:00";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectAnswer = (optionIndex: number) => {
    setAnswers({ ...answers, [currentQuestion]: optionIndex });
  };

  const nextQuestion = () => {
    if (quizData && currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const finishQuiz = () => {
    if (!quizData) return;
    let finalScore = 0;
    quizData.questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) finalScore++;
    });
    setScore((finalScore / quizData.questions.length) * 100);
    setIsFinished(true);
  };

  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const certificateElement = document.getElementById("certificate-content");
      if (!certificateElement) {
        console.error("Certificate element not found");
        toast({
          title: "Error",
          description: "Certificate element not found",
          variant: "destructive",
        });
        setIsGeneratingPDF(false);
        return;
      }

      console.log("Starting PDF generation...");

      // Clone the element to avoid any styling issues
      const clonedElement = certificateElement.cloneNode(true) as HTMLElement;
      clonedElement.style.position = "absolute";
      clonedElement.style.left = "-9999px";
      clonedElement.style.top = "-9999px";
      clonedElement.style.width = certificateElement.offsetWidth + "px";
      clonedElement.style.visibility = "visible";
      document.body.appendChild(clonedElement);

      try {
        // Generate canvas from the cloned element
        const canvas = await html2canvas(clonedElement, {
          scale: 2,
          backgroundColor: "#ffffff",
          logging: true,
          useCORS: true,
          allowTaint: true,
          proxy: undefined,
          removeContainer: false,
        });

        console.log("Canvas generated successfully", canvas.width, canvas.height);

        const imgData = canvas.toDataURL("image/png");
        
        // Certificate format - Landscape orientation
        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: "a4",
        });

        const pageHeight = pdf.internal.pageSize.getHeight();
        const pageWidth = pdf.internal.pageSize.getWidth();

        // Calculate aspect ratio to fit the certificate
        const canvasAspectRatio = canvas.width / canvas.height;
        const pageAspectRatio = pageWidth / pageHeight;
        
        let finalWidth = pageWidth;
        let finalHeight = pageWidth / canvasAspectRatio;
        
        if (finalHeight > pageHeight) {
          finalHeight = pageHeight;
          finalWidth = pageHeight * canvasAspectRatio;
        }
        
        // Center the certificate on the page
        const xOffset = (pageWidth - finalWidth) / 2;
        const yOffset = (pageHeight - finalHeight) / 2;

        pdf.addImage(imgData, "PNG", xOffset, yOffset, finalWidth, finalHeight);
        pdf.save(`${quizData?.title?.replace(/\s+/g, "_") || "Certificate"}_Certificate.pdf`);

        console.log("PDF saved successfully");

        toast({
          title: "Success",
          description: "Certificate downloaded successfully!",
        });
      } finally {
        // Clean up the cloned element
        document.body.removeChild(clonedElement);
      }
    } catch (error) {
      console.error("PDF generation failed:", error);
      console.error("Error details:", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      toast({
        title: "Error",
        description: `Failed to generate PDF: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="h-12 w-12" />
          <p className="text-muted-foreground">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-8 md:p-12 text-center border-border/50">
          <div className="space-y-4">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
            <h2 className="text-2xl font-bold">Quiz not found</h2>
            <p className="text-muted-foreground">The quiz you're looking for doesn't exist.</p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/quizzes">Go to Quizzes</Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-8 md:p-12 text-center border-border/50 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-purple-600" />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="mx-auto w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-8">
              <Award className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-display tracking-tight">{quizData.title}</h1>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto">{quizData.description || "Test your knowledge on this topic"}</p>
            
            <div className="flex justify-center gap-8 py-8 border-y border-border/50 my-8">
              <div className="text-center">
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-bold mb-1">Questions</p>
                <p className="text-3xl font-display font-bold">{quizData.questions.length}</p>
              </div>
              <div className="w-px bg-border/50" />
              <div className="text-center">
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-bold mb-1">Time Limit</p>
                <p className="text-3xl font-display font-bold">15m</p>
              </div>
            </div>

            <Button size="lg" className="w-full sm:w-auto px-12 h-14 text-lg rounded-full shadow-lg hover:scale-105 transition-transform" onClick={() => setStarted(true)}>
              Start Quiz Now
            </Button>
          </motion.div>
        </Card>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8 flex flex-col items-center">
        <div className="max-w-4xl w-full space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-500/10 text-emerald-500 mb-4">
              <CheckCircle2 className="h-12 w-12" />
            </div>
            <h2 className="text-4xl font-bold font-display">Quiz Completed!</h2>
            <p className="text-xl text-muted-foreground">You scored {score}%</p>
          </div>

          {/* Certificate Preview for PDF Generation */}
          <Card className="border-2 border-border/50 overflow-hidden shadow-2xl relative max-w-6xl mx-auto" style={{ aspectRatio: '1.4 / 1' }}>
            {/* Download Overlay */}
            <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
               <Button size="lg" onClick={generatePDF} disabled={isGeneratingPDF} className="rounded-full shadow-xl">
                 {isGeneratingPDF ? "Generating..." : <><Download className="mr-2 h-5 w-5"/> Download PDF Certificate</>}
               </Button>
            </div>

            <div id="certificate-content" className="p-8 md:p-12 bg-white text-center relative flex flex-col justify-center min-h-full" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
              {/* Decorative corners */}
              <div className="absolute top-0 left-0 w-24 h-24 opacity-20" style={{ borderTop: '6px solid #6366f1', borderLeft: '6px solid #6366f1' }}></div>
              <div className="absolute top-0 right-0 w-24 h-24 opacity-20" style={{ borderTop: '6px solid #6366f1', borderRight: '6px solid #6366f1' }}></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 opacity-20" style={{ borderBottom: '6px solid #6366f1', borderLeft: '6px solid #6366f1' }}></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 opacity-20" style={{ borderBottom: '6px solid #6366f1', borderRight: '6px solid #6366f1' }}></div>
              
              <img src={logo} alt="Logo" className="w-12 h-12 mx-auto mb-4" />
              <p className="text-xs font-bold tracking-[0.2em] mb-2 uppercase" style={{ color: '#6366f1', letterSpacing: '0.05em' }}>Certificate of Achievement</p>
              <h3 className="text-2xl font-serif italic mb-4" style={{ color: '#726e7b' }}>This certifies that</h3>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 pb-2 inline-block px-8" style={{ color: '#000000', borderBottom: '2px solid #e5e7eb' }}>Alex Morgan</h2>
              <p className="text-base mb-2" style={{ color: '#666666' }}>has successfully completed the assessment</p>
              <h4 className="text-lg font-bold mb-6" style={{ color: '#000000' }}>{quizData.title}</h4>
              
              <div className="flex justify-between items-end px-8 gap-4">
                <div className="text-left">
                  <p className="font-bold text-xl" style={{ color: '#000000' }}>{score}%</p>
                  <p className="text-xs uppercase tracking-wider font-bold" style={{ color: '#726e7b' }}>Final Score</p>
                </div>
                <div className="text-center flex-1">
                  <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '8px' }}>
                    <p className="text-xs" style={{ color: '#726e7b' }}>___________________</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm" style={{ color: '#000000' }}>{new Date().toLocaleDateString()}</p>
                  <p className="text-xs uppercase tracking-wider font-bold" style={{ color: '#726e7b' }}>Date</p>
                </div>
              </div>
            </div>
          </Card>
          
          <div className="flex justify-center gap-4 pt-8">
            <Button variant="outline" size="lg" asChild>
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
            <Button size="lg" asChild>
              <Link href="/dashboard/analytics">View Detailed Analysis</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const q = quizData.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizData.questions.length) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Quiz Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <Button variant="ghost" size="icon" asChild className="shrink-0 text-muted-foreground hover:text-foreground">
                <Link href="/dashboard"><XCircle className="h-6 w-6" /></Link>
             </Button>
             <div className="hidden sm:block">
                <h2 className="font-bold truncate max-w-[200px] md:max-w-md">{quizData.title}</h2>
                <p className="text-xs text-muted-foreground">Question {currentQuestion + 1} of {quizData.questions.length}</p>
             </div>
          </div>
          
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono text-lg font-bold ${(timeLeft ?? 0) < 60 ? 'bg-destructive/10 text-destructive animate-pulse' : 'bg-secondary'}`}>
            <Clock className="h-5 w-5" />
            {formatTime(timeLeft)}
          </div>
        </div>
        <Progress value={progress} className="h-1 rounded-none bg-secondary" />
      </header>

      {/* Quiz Content */}
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 max-w-3xl flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1"
          >
            <div className="mb-8">
              <span className="text-primary font-bold tracking-wider text-sm uppercase mb-4 block">Question {currentQuestion + 1}</span>
              <h3 className="text-2xl md:text-3xl font-medium leading-tight">{q.question}</h3>
            </div>

            <div className="space-y-4">
              {q.options.map((opt, idx) => {
                const isSelected = answers[currentQuestion] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectAnswer(idx)}
                    className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-200 flex items-center gap-4 ${
                      isSelected 
                        ? 'border-primary bg-primary/5 shadow-md scale-[1.01]' 
                        : 'border-border/50 hover:border-primary/30 hover:bg-secondary/50'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      isSelected ? 'border-primary bg-primary' : 'border-muted-foreground'
                    }`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <span className="text-lg">{opt}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Footer */}
        <div className="mt-12 flex items-center justify-between pt-6 border-t">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={prevQuestion} 
            disabled={currentQuestion === 0}
            className="rounded-full px-6"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          
          {currentQuestion === quizData.questions.length - 1 ? (
            <Button 
              size="lg" 
              onClick={finishQuiz}
              className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 shadow-lg shadow-primary/25"
            >
              Submit Quiz
            </Button>
          ) : (
            <Button 
              size="lg" 
              onClick={nextQuestion}
              className="rounded-full px-8"
              variant={answers[currentQuestion] !== undefined ? "default" : "secondary"}
            >
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
