import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { PlayCircle, Users, Trophy, TrendingUp, Plus, ArrowRight, Star } from "lucide-react";
import { Link } from "wouter";

const stats = [
  { title: "Total Quizzes", value: "24", icon: PlayCircle, trend: "+12%" },
  { title: "Active Participants", value: "1,204", icon: Users, trend: "+8%" },
  { title: "Average Score", value: "78%", icon: TrendingUp, trend: "+3%" },
  { title: "Global Rank", value: "#42", icon: Trophy, trend: "Top 5%" },
];

const recentQuizzes = [
  { id: 1, title: "Advanced React Patterns", plays: 245, avgScore: "82%", status: "Active" },
  { id: 2, title: "UI/UX Fundamentals", plays: 189, avgScore: "76%", status: "Active" },
  { id: 3, title: "TypeScript Basics", plays: 890, avgScore: "65%", status: "Draft" },
];

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Welcome back, Alex</h2>
            <p className="text-muted-foreground mt-1">Here's what's happening with your learning journey today.</p>
          </div>
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full shadow-md w-full sm:w-auto" asChild>
            <Link href="/dashboard/create">
              <Plus className="mr-2 h-5 w-5" />
              Create Quiz
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div 
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <Card className="hover:shadow-md transition-shadow border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between space-y-0 pb-2">
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <stat.icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2 mt-2">
                    <div className="text-3xl font-bold font-display">{stat.value}</div>
                    <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      {stat.trend}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart Area */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Recent Quizzes</CardTitle>
                <CardDescription>Manage and monitor your latest creations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentQuizzes.map((quiz) => (
                    <div key={quiz.id} className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-secondary/50 transition-colors group">
                      <div>
                        <h4 className="font-semibold text-lg">{quiz.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1"><Users className="h-3 w-3"/> {quiz.plays} plays</span>
                          <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3"/> {quiz.avgScore} avg</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${quiz.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                          {quiz.status}
                        </span>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowRight className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" className="w-full mt-4 text-primary" asChild>
                  <Link href="/dashboard/quizzes">View All Quizzes</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            <Card className="bg-gradient-to-br from-primary/90 to-indigo-700 text-white border-none shadow-lg">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="h-12 w-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                    <Star className="h-6 w-6 text-yellow-300" fill="currentColor" />
                  </div>
                  <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">PRO</span>
                </div>
                <h3 className="text-xl font-bold font-display mb-2">Upgrade to Pro</h3>
                <p className="text-white/80 text-sm mb-6">Unlock advanced analytics, custom branding, and unlimited PDF certificates.</p>
                <Button className="w-full bg-white text-primary hover:bg-white/90 rounded-full font-bold">
                  View Plans
                </Button>
              </CardContent>
            </Card>

             <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Streaks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-end">
                   <div>
                      <div className="text-4xl font-black font-display text-orange-500 flex items-center gap-2">
                         12 <span className="text-lg text-muted-foreground font-medium">days</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">You're on a roll! Keep it up.</p>
                   </div>
                   <div className="h-16 w-16 bg-orange-500/10 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-8 w-8 text-orange-500" />
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
