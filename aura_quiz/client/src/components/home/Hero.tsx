import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Award } from "lucide-react";
import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.png";
import { Link } from "wouter";

export default function Hero() {
  return (
    <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden bg-background">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBg} 
          alt="Abstract geometric background" 
          className="w-full h-full object-cover object-center opacity-60 dark:opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6 text-center max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 border border-primary/20 backdrop-blur-md"
        >
          <Sparkles className="h-4 w-4" />
          <span>The next generation of learning</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground mb-6"
        >
          Master any subject with <br className="hidden md:block"/>
          <span className="text-gradient">intelligent quizzes.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto font-medium"
        >
          Create, share, and analyze quizzes with our world-class platform. Gamified learning, real-time analytics, and automatic PDF certificates.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 transition-all hover:scale-105" asChild>
            <Link href="/login">
              Start Learning Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-16 flex items-center justify-center gap-8 text-muted-foreground text-sm font-medium"
        >
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" />
            <span>Lightning Fast</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-indigo-500" />
            <span>Smart Analytics</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
