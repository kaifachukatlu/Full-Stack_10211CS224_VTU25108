import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import CreateQuiz from "@/pages/CreateQuiz";
import QuizTaker from "@/pages/QuizTaker";
import Analytics from "@/pages/Analytics";
import Quizzes from "@/pages/Quizzes";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/dashboard/quizzes" component={Quizzes} />
      <Route path="/dashboard/create" component={CreateQuiz} />
      <Route path="/dashboard/analytics" component={Analytics} />
      <Route path="/quiz/:id" component={QuizTaker} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
