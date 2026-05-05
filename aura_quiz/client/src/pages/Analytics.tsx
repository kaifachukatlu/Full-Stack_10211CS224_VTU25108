import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, Users, Target, Clock } from "lucide-react";
import { useState } from "react";

const performanceData = [
  { name: "Mon", score: 65, avg: 60 },
  { name: "Tue", score: 72, avg: 62 },
  { name: "Wed", score: 68, avg: 65 },
  { name: "Thu", score: 85, avg: 66 },
  { name: "Fri", score: 78, avg: 68 },
  { name: "Sat", score: 92, avg: 70 },
  { name: "Sun", score: 88, avg: 72 },
];

const categoryData = [
  { name: "React", completion: 85 },
  { name: "UI/UX", completion: 60 },
  { name: "TypeScript", completion: 92 },
  { name: "Backend", completion: 45 },
];

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("7d");

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Analytics Overview</h2>
            <p className="text-muted-foreground mt-1">Deep dive into your performance metrics and learner engagement.</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last Quarter</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                  <p className="text-3xl font-bold font-display">84.2%</p>
                </div>
                <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                  <Target className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-emerald-500 font-medium">
                <TrendingUp className="h-4 w-4 mr-1" /> +2.4% from last week
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Total Participants</p>
                  <p className="text-3xl font-bold font-display">1,204</p>
                </div>
                <div className="p-2 bg-primary/10 text-primary rounded-lg">
                  <Users className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-emerald-500 font-medium">
                <TrendingUp className="h-4 w-4 mr-1" /> +145 new users
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Avg. Time Spent</p>
                  <p className="text-3xl font-bold font-display">14m 20s</p>
                </div>
                <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
                  <Clock className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-muted-foreground font-medium">
                Consistent with average
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-primary text-primary-foreground">
            <CardContent className="p-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-primary-foreground/80">Platform Score</p>
                <p className="text-4xl font-bold font-display">A+</p>
              </div>
              <div className="mt-4 text-sm text-primary-foreground/90 font-medium">
                Top 5% of creators globally
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>Average scores vs platform baseline</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      dx={-10}
                    />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      name="Your Score"
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3} 
                      dot={{ r: 4, strokeWidth: 2 }} 
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="avg" 
                      name="Platform Avg"
                      stroke="hsl(var(--muted-foreground))" 
                      strokeWidth={2} 
                      strokeDasharray="5 5"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Category Mastery</CardTitle>
              <CardDescription>Completion rates across different topics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
                    <XAxis 
                      type="number"
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                    />
                    <YAxis 
                      dataKey="name" 
                      type="category"
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'hsl(var(--foreground))', fontSize: 12, fontWeight: 500 }}
                    />
                    <RechartsTooltip 
                      cursor={{ fill: 'hsl(var(--muted))' }}
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    />
                    <Bar 
                      dataKey="completion" 
                      name="Completion %"
                      fill="hsl(var(--primary))" 
                      radius={[0, 4, 4, 0]} 
                      barSize={32}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
