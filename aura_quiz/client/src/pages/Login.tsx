import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, Sparkles, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.png";
import { Link, useLocation } from "wouter";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [, setLocation] = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement login logic
    console.log("Login attempt:", formData);
    // For now, just redirect to dashboard
    setLocation("/dashboard");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt="Abstract geometric background"
          className="w-full h-full object-cover object-center opacity-60 dark:opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background"></div>
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 border border-primary/20 backdrop-blur-md"
            >
              <Sparkles className="h-4 w-4" />
              <span>Welcome back</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2"
            >
              Sign in to Aura
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-muted-foreground"
            >
              Continue your learning journey
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="border-border/50 shadow-2xl backdrop-blur-md bg-background/80">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">Login</CardTitle>
                <CardDescription className="text-center">
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="Enter your username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="h-12 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-12 w-12 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 text-lg rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 transition-all hover:scale-105"
                  >
                    Sign In
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </form>

                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <button 
                      onClick={() => setLocation("/dashboard")}
                      className="text-primary hover:underline cursor-pointer"
                    >
                      Continue as Guest
                    </button>
                  </p>
                  <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    ← Back to home
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}