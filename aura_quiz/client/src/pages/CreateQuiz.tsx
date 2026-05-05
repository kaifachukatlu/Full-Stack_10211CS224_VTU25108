import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, GripVertical, Settings2, Save } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CreateQuiz() {
  const [questions, setQuestions] = useState([
    { id: 1, type: "multiple-choice", text: "", options: ["", ""], points: 10 }
  ]);

  const addQuestion = () => {
    setQuestions([...questions, { 
      id: Date.now(), 
      type: "multiple-choice", 
      text: "", 
      options: ["", ""],
      points: 10 
    }]);
  };

  const removeQuestion = (id: number) => {
    if(questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Main Editor */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Create Quiz</h2>
            <Button variant="outline" className="hidden md:flex gap-2">
              <Settings2 className="h-4 w-4" /> Advanced Settings
            </Button>
          </div>

          {/* Quiz Metadata */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Quiz Details</CardTitle>
              <CardDescription>Basic information about your assessment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Quiz Title</label>
                <Input placeholder="e.g., Advanced React Patterns" className="text-lg py-6" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea placeholder="What is this quiz about?" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tech">Technology</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Difficulty</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Questions List */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">Questions <span className="bg-primary/10 text-primary text-sm px-2 py-1 rounded-md">{questions.length}</span></h3>
            
            <AnimatePresence>
              {questions.map((q, index) => (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="border-border/50 shadow-sm group">
                    <div className="flex">
                      <div className="w-10 bg-secondary/50 flex flex-col items-center py-4 border-r border-border/50 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors rounded-l-xl">
                        <span className="font-bold text-sm mb-4">{index + 1}</span>
                        <GripVertical className="h-5 w-5" />
                      </div>
                      <div className="flex-1 p-6">
                        <div className="flex justify-between items-start mb-4 gap-4">
                          <Input placeholder="Enter your question here..." className="font-medium text-lg border-transparent hover:border-input focus:border-input transition-colors px-0 h-auto py-2" />
                          <div className="flex items-center gap-2 shrink-0">
                            <Select defaultValue={q.type}>
                              <SelectTrigger className="w-[160px] h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                                <SelectItem value="checkbox">Checkboxes</SelectItem>
                                <SelectItem value="short-answer">Short Answer</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button variant="ghost" size="icon" onClick={() => removeQuestion(q.id)} className="text-muted-foreground hover:text-destructive transition-colors h-9 w-9">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Options Editor */}
                        <div className="space-y-3 pl-4 border-l-2 border-primary/20">
                          {q.options.map((opt, oIndex) => (
                            <div key={oIndex} className="flex items-center gap-3">
                              <div className="h-4 w-4 rounded-full border border-primary flex-shrink-0" />
                              <Input placeholder={`Option ${oIndex + 1}`} className="flex-1 h-10 border-dashed bg-secondary/30 focus:bg-background" />
                            </div>
                          ))}
                          <Button variant="ghost" size="sm" className="text-primary mt-2 ml-7 h-8">
                            <Plus className="h-3 w-3 mr-2" /> Add Option
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>

            <Button onClick={addQuestion} variant="outline" className="w-full py-8 border-dashed border-2 hover:border-primary/50 hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary">
              <Plus className="h-5 w-5 mr-2" /> Add New Question
            </Button>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="w-full md:w-80 space-y-6">
          <div className="sticky top-24 space-y-6">
            <Card className="border-border/50 shadow-sm bg-primary/5 border-primary/20">
              <CardContent className="p-6 space-y-4">
                <Button className="w-full gap-2 rounded-full h-12 text-md shadow-md bg-primary hover:bg-primary/90 text-white">
                  <Save className="h-5 w-5" /> Save Quiz
                </Button>
                <Button variant="outline" className="w-full rounded-full h-12">
                  Preview
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">Time Limit</label>
                    <p className="text-xs text-muted-foreground">In minutes</p>
                  </div>
                  <Input type="number" defaultValue="30" className="w-20 text-center" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">Shuffle Questions</label>
                  </div>
                  <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary transition-colors cursor-pointer">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">Generate Certificate</label>
                    <p className="text-xs text-muted-foreground">PDF on completion</p>
                  </div>
                  <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary transition-colors cursor-pointer">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
