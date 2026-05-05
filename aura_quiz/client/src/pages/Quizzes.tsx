import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { PlayCircle, Clock, Users, Star, ArrowRight, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";

interface Quiz {
  id: string;
  title: string;
  description?: string;
  category?: string;
}

export default function Quizzes() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: quizzes, isLoading } = useQuery({
    queryKey: ["quizzes"],
    queryFn: async () => {
      const response = await fetch("/api/quizzes");
      if (!response.ok) throw new Error("Failed to fetch quizzes");
      return response.json() as Promise<Quiz[]>;
    },
  });

  const filteredQuizzes = quizzes?.filter((quiz) =>
    quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    quiz.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    quiz.category?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Explore Quizzes</h2>
            <p className="text-muted-foreground mt-1">Discover and take assessments across various topics.</p>
          </div>
          
          <div className="flex w-full md:w-auto items-center gap-2">
             <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search quizzes..." 
                  className="pl-9 rounded-full bg-secondary/50 border-transparent focus:bg-background"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>
             <Button variant="outline" size="icon" className="rounded-full shrink-0">
                <Filter className="h-4 w-4" />
             </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-80 rounded-lg" />
            ))}
          </div>
        ) : filteredQuizzes.length === 0 ? (
          <Card className="text-center p-12">
            <CardContent className="flex flex-col items-center gap-4">
              <PlayCircle className="h-12 w-12 text-muted-foreground" />
              <div>
                <h3 className="font-semibold text-lg">No quizzes found</h3>
                <p className="text-muted-foreground">Try adjusting your search query</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz, i) => (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <Card className="h-full flex flex-col hover:shadow-lg transition-shadow border-border/50 group">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                        {quiz.category || "General"}
                      </span>
                    </div>
                    <CardTitle className="line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                      {quiz.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 mt-2">
                      {quiz.description || "Test your knowledge on this topic"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-auto">
                      <div className="flex items-center gap-1">
                        <PlayCircle className="h-4 w-4" /> Start Quiz
                      </div>
                    </div>
                  </CardContent>
                  <div className="p-6 pt-0 mt-auto">
                    <Button className="w-full rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-colors" variant="secondary" asChild>
                      <Link href={`/quiz/${quiz.id}`}>
                        Start Quiz <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
