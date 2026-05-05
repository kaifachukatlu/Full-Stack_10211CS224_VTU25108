import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import { motion } from "framer-motion";
import { BarChart3, Clock, Trophy, FileText, CheckCircle2 } from "lucide-react";

const features = [
  {
    icon: <Clock className="h-6 w-6 text-primary" />,
    title: "Timed Assessments",
    description: "Keep learners on their toes with precise, customizable timers for every quiz section."
  },
  {
    icon: <BarChart3 className="h-6 w-6 text-primary" />,
    title: "Deep Analytics",
    description: "Track performance, identify knowledge gaps, and watch progress over time with modern charts."
  },
  {
    icon: <Trophy className="h-6 w-6 text-primary" />,
    title: "Gamification",
    description: "Earn badges, maintain streaks, and compete on the global leaderboard."
  },
  {
    icon: <FileText className="h-6 w-6 text-primary" />,
    title: "Instant PDF Reports",
    description: "Generate beautiful, professional PDF certificates and detailed performance reports instantly."
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        
        {/* Features Section */}
        <section className="py-24 bg-secondary/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Everything you need to <span className="text-gradient">succeed.</span></h2>
              <p className="text-muted-foreground text-lg">A powerful suite of tools designed for educators, students, and professionals to create and take world-class assessments.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="bg-card p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
                >
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-24 border-t border-b">
           <div className="container mx-auto px-4 md:px-6 text-center">
              <h2 className="text-2xl font-bold mb-12 text-muted-foreground">Trusted by top institutions globally</h2>
              <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale">
                 {/* Mock Logos */}
                 <div className="text-2xl font-black font-display tracking-tighter">STANFORD</div>
                 <div className="text-2xl font-black font-display tracking-tighter">MIT X</div>
                 <div className="text-2xl font-black font-display tracking-tighter">HARVARD</div>
                 <div className="text-2xl font-black font-display tracking-tighter">OXFORD</div>
              </div>
           </div>
        </section>
      </main>
    </div>
  );
}
