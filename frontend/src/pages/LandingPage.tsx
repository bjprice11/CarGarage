import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Wrench, Car, DollarSign, BarChart3, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Car, title: "Vehicle Tracking", desc: "Monitor every machine in your garage with detailed specs and status." },
  { icon: Wrench, title: "Maintenance Logs", desc: "Never miss a service interval. Track every oil change, brake job, and tune-up." },
  { icon: DollarSign, title: "Expense Management", desc: "Know exactly what each vehicle costs you, down to the last bolt." },
  { icon: BarChart3, title: "Analytics", desc: "Visualize spending trends, maintenance patterns, and fleet health." },
  { icon: Shield, title: "Service History", desc: "Complete documented history for every vehicle you own." },
  { icon: Zap, title: "Smart Alerts", desc: "Get notified when service is due based on mileage or time intervals." },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.2, 0, 0, 1] as const } },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-14 px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Wrench className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-foreground">Torque</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                Sign In
              </Button>
            </Link>
            <Link to="/login">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial="hidden"
          animate="show"
          variants={stagger}
        >
          <motion.div variants={fadeUp}>
            <span className="inline-block px-3 py-1 text-[10px] uppercase tracking-widest font-bold text-primary bg-primary/10 rounded-full mb-6">
              Fleet & Maintenance Tracker
            </span>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tighter text-foreground leading-[1.1] mb-6"
          >
            Your garage,
            <br />
            under control.
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed"
          >
            Track every vehicle, every service, every dollar. Torque is the digital service manual
            built for enthusiasts who treat maintenance as a critical path.
          </motion.p>
          <motion.div variants={fadeUp} className="flex items-center justify-center gap-4">
            <Link to="/login">
              <Button size="lg" className="h-12 px-8">
                Start Tracking
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline" size="lg" className="h-12 px-8">
                View Demo
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-12 px-6 border-y border-border">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8">
          {[
            { value: "10K+", label: "Vehicles Tracked" },
            { value: "$2.4M", label: "Expenses Logged" },
            { value: "99.9%", label: "Uptime" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-semibold tracking-tight font-tabular text-foreground">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold tracking-tight text-center mb-12 text-foreground">
            Everything you need
          </h2>
          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                className="p-6 rounded-xl bg-card glass-shadow hover:glass-shadow-hover hover:-translate-y-0.5 transition-all duration-150 ease-expo"
              >
                <f.icon className="w-5 h-5 text-primary mb-4" />
                <h3 className="text-sm font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-semibold tracking-tight mb-4 text-foreground">
            Ready to take control?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of enthusiasts who trust Torque to manage their machines.
          </p>
          <Link to="/login">
            <Button size="lg" className="h-12 px-10">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-xs text-muted-foreground">© 2026 Torque. All rights reserved.</span>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center">
              <Wrench className="w-3 h-3 text-primary" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
