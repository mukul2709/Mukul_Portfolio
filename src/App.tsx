import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Terminal as TerminalIcon, Cpu, Database, Sparkles, Layers, Send, Github, Linkedin, 
  Mail, Phone, MapPin, ExternalLink, FileText, Check, Copy, Sliders, ChevronRight,
  BookOpen, Star, RefreshCw, Layers3, Activity, TerminalSquare
} from "lucide-react";

import { 
  PROJECTS, WORK_EXPERIENCE, TECH_CATEGORIES, CONTACT_INFO, ACADEMIC_INFO 
} from "./data";
import InteractiveTerminal from "./components/InteractiveTerminal";
import SystemArchitectureVisualizer from "./components/SystemArchitectureVisualizer";
import DatabaseTuningSimulator from "./components/DatabaseTuningSimulator";
import AirbnbCaseStudy from "./components/AirbnbCaseStudy";
import BuildableAICaseStudy from "./components/BuildableAICaseStudy";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("Backend Core");
  const [copiedState, setCopiedState] = useState<string | null>(null);
  
  // Custom expandable state for projects list
  const [expandedProject, setExpandedProject] = useState<string | null>("airbnb-backend");

  // Contact Form simulation states
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [apiResponse, setApiResponse] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Copy helper
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedState(label);
    setTimeout(() => setCopiedState(null), 2000);
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setApiResponse(null);

    // Simulate 1.5s network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setApiResponse({
      timestamp: new Date().toISOString(),
      statusCode: 201,
      status: "CREATED",
      message: "REST Entity persisted successfully inside PostgreSQL database.",
      thread: `http-nio-3000-exec-${Math.floor(Math.random() * 8) + 1}`,
      databaseTx: "TX-COMMIT-SUCCESSFUL",
      payload: {
        receivedFrom: formData.name,
        senderEnvelope: formData.email,
        subjectHeader: formData.subject || "NO_SUBJECT",
        messageDigest: formData.message.substring(0, 50) + (formData.message.length > 50 ? "..." : ""),
        dispatchStatus: "DELIVERED_TO_MUKUL_SMTP"
      }
    });

    // Reset form fields
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 flex flex-col font-sans relative selection:bg-blue-900/60 selection:text-white">
      
      {/* Visual background accents */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-950/10 via-transparent to-transparent pointer-events-none z-0" />
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-blue-950/5 rounded-full filter blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-indigo-950/5 rounded-full filter blur-[120px] pointer-events-none z-0" />

      {/* Modern Navigation Header Bar */}
      <header className="sticky top-0 z-50 bg-[#050505]/85 backdrop-blur-md border-b border-white/5 px-4 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 p-[1px]">
            <div className="w-full h-full bg-slate-950 rounded-lg flex items-center justify-center font-mono font-bold text-sm text-blue-400">
              MA
            </div>
          </div>
          <div>
            <span className="font-display font-bold text-slate-100 tracking-tight block">
              Mukul Aggarwal
            </span>
            <span className="text-[10px] font-mono text-slate-500 font-semibold block leading-none">
              JAVA.BACKEND.SYSTEMS // V3.1.2
            </span>
          </div>
        </div>

        {/* Header Links */}
        <nav className="hidden xl:flex items-center gap-6 text-xs font-mono font-semibold text-slate-400">
          <a href="#sandbox" className="hover:text-blue-400 transition-colors">Architecture Sandbox</a>
          <a href="#tuning" className="hover:text-indigo-400 transition-colors">Tuning Arena</a>
          <a href="#projects" className="hover:text-blue-400 transition-colors">Projects</a>
          <a href="#airbnb-case-study" className="text-blue-400 hover:text-blue-355 transition-colors">★ Airbnb Case</a>
          <a href="#buildable-ai-case-study" className="text-violet-400 font-bold border border-violet-500/20 px-2 py-0.5 rounded bg-violet-950/20 hover:bg-violet-950/40 transition-colors">★ Buildable AI Case</a>
          <a href="#skills" className="hover:text-slate-200 transition-colors">Experience Matrix</a>
        </nav>

        {/* Dynamic Status / Actions */}
        <div className="flex items-center gap-2">
          {/* Quick email clipboard trigger */}
          <button
            onClick={() => handleCopy(CONTACT_INFO.email, "email")}
            className="bg-slate-900 border border-white/5 hover:border-blue-800/80 hover:bg-blue-950/20 text-xs font-mono font-semibold px-3.5 py-1.5 rounded-lg flex items-center gap-2 transition-all cursor-pointer text-slate-300"
          >
            {copiedState === "email" ? (
              <>
                <Check className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-blue-400 font-bold">Email Copied!</span>
              </>
            ) : (
              <>
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Email</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 md:py-16 space-y-24 z-10">
        
        {/* HERO INTRO BLOCK (Grid layout) */}
        <section id="hero" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            
            {/* Live capability token */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-blue-950/40 border border-blue-900/30 text-blue-400">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              SYSTEM ENGINEER // 3+ YEARS CORES EXPERIENCE @ TCS
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-slate-100 tracking-tight leading-tight">
                Engineering <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-sky-400 bg-clip-text text-transparent">High-Throughput</span> Backend Microservices
              </h1>
              <p className="text-base text-slate-400 max-w-xl font-sans">
                Professional Java backend specialist adept at crafting secure RESTful API layers, concurrency lock pipelines (JPA / PostgreSQL), streaming SSE clusters, and Docker scaling grids. Let's bypass legacy database overhead.
              </p>
            </div>

            {/* Micro KPI grid */}
            <div className="grid grid-cols-3 gap-4 border-y border-white/5 py-6 max-w-lg">
              <div>
                <span className="text-2xl md:text-3xl font-display font-bold text-blue-400 block">3+ Yrs</span>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mt-0.5">Enterprise Experience</span>
              </div>
              <div>
                <span className="text-2xl md:text-3xl font-display font-bold text-indigo-400 block">30%</span>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mt-0.5">DB Latency Saved</span>
              </div>
              <div>
                <span className="text-2xl md:text-3xl font-display font-bold text-indigo-400 block">100%</span>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mt-0.5">Double-Book Safety</span>
              </div>
            </div>

            {/* Social Contact coordinates */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={CONTACT_INFO.linkedin}
                target="_blank"
                rel="noreferrer"
                className="bg-[#0b0b0b] border border-white/5 text-xs font-mono font-semibold px-4 py-2 rounded-xl flex items-center gap-2 hover:text-blue-400 hover:border-blue-900/60 transition-colors cursor-pointer"
              >
                <Linkedin className="w-4 h-4 text-blue-400" />
                <span>LinkedIn Profile</span>
                <ExternalLink className="w-3 h-3 text-slate-600" />
              </a>

              <button
                onClick={() => handleCopy(CONTACT_INFO.phone, "phone")}
                className="bg-[#0b0b0b] border border-white/5 text-xs font-mono font-semibold px-4 py-2 rounded-xl flex items-center gap-2 hover:text-blue-400 hover:border-blue-950 transition-all cursor-pointer text-slate-300"
              >
                <Phone className="w-4 h-4 text-slate-400" />
                <span>{copiedState === "phone" ? "Mobile Copied!" : "Copy Call Phone"}</span>
              </button>
            </div>

          </div>

          {/* Core Embedded Console Window (5 cols) */}
          <div className="lg:col-span-5 h-full">
            <InteractiveTerminal />
          </div>

        </section>

        {/* SYSTEM DESIGN ARCHITECTURE SIMULATOR */}
        <section id="sandbox" className="space-y-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-display font-bold text-slate-100 tracking-tight flex items-center gap-2">
              <Layers className="w-7 h-7 text-blue-400" />
              Interactive Microservice Playground
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Select one of Mukul's system orchestration channels to see how network data maps safely across API Filters, Redis, and Spring transaction loops.
            </p>
          </div>

          <SystemArchitectureVisualizer />
        </section>

        {/* DATABASE & QUERY TUNING AREA */}
        <section id="tuning" className="space-y-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-display font-bold text-slate-100 tracking-tight flex items-center gap-2">
              <Database className="w-7 h-7 text-indigo-400" />
              Query Optimization Arena
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Analyze exactly how custom database locks, Join fetches, and JDBC batched templates eliminate parallel race conditions and save infrastructure costs.
            </p>
          </div>

          <DatabaseTuningSimulator />
        </section>

        {/* THE DEEP SYSTEM SHOWCASE - EXPANDABLE PORTFOLIO CARDS */}
        <section id="projects" className="space-y-6">
          <div className="max-w-xl">
            <h2 className="text-3xl font-display font-bold text-slate-100 tracking-tight flex items-center gap-2">
              <Cpu className="w-7 h-7 text-purple-400" />
              Detailed Project Cases
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Explore structural deep dives of Mukul's primary builds, complete with tech logs and core infrastructure charts.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {PROJECTS.map((project) => {
              const isExpanded = expandedProject === project.id;
              return (
                <div 
                  key={project.id}
                  className={`border bg-[#0a0a0a]/40 rounded-2xl overflow-hidden transition-all duration-300 ${
                    isExpanded 
                      ? "border-white/10 scale-[1.01]" 
                      : "border-white/5 hover:border-white/10"
                  }`}
                >
                  {/* Card Header clickable bar */}
                  <div 
                    onClick={() => setExpandedProject(isExpanded ? null : project.id)}
                    className="p-6 cursor-pointer flex items-start justify-between bg-[#0b0b0b] border-b border-white/5"
                  >
                    <div>
                      <span className={`text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded inline-block mb-2 ${
                        project.category === "Backend" 
                          ? "bg-blue-950/40 text-blue-400 border border-blue-900/40" 
                          : "bg-indigo-950/40 text-indigo-400 border border-indigo-900/40"
                      }`}>
                        {project.category} Core Architecture
                      </span>
                      <h3 className="text-xl font-display font-bold text-slate-200">
                        {project.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-mono mt-1">
                        Deployment profile: {project.period}
                      </p>
                    </div>

                    <div className="bg-stone-900 hover:bg-stone-800 px-3 py-1.5 rounded-lg border border-white/5 text-xs font-mono text-slate-400 select-none">
                      {isExpanded ? "Collapse" : "Open Board"}
                    </div>
                  </div>

                  {/* Stat Metrics Strip */}
                  <div className="grid grid-cols-3 divide-x divide-white/5 border-b border-white/5 text-center py-4 bg-black">
                    {project.metrics.map((m, idx) => (
                      <div key={idx} className="px-3">
                        <span className="text-lg md:text-xl font-display font-bold text-slate-100">{m.value}</span>
                        <span className="text-[10px] font-mono text-slate-500 block truncate mt-0.5">{m.label}</span>
                      </div>
                    ))}
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-6 space-y-6">
                          
                          {/* Core details bullet points */}
                          <div className="space-y-4">
                            <h4 className="text-xs font-mono font-bold uppercase text-slate-500 tracking-wider">
                              Key Technical Implementations
                            </h4>
                            <ul className="space-y-2.5">
                              {project.highlights.map((h, idx) => (
                                <li key={idx} className="text-sm text-slate-400 flex items-start gap-2.5 leading-relaxed">
                                  <Check className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                                  <span>{h}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Tech Stack Pills list */}
                          <div className="space-y-2">
                            <h4 className="text-xs font-mono font-bold uppercase text-slate-500 tracking-wider">
                              Sovereign Tech Stack
                            </h4>
                            <div className="flex flex-wrap gap-1.5">
                              {project.techStack.map((tech, idx) => (
                                <span 
                                  key={idx} 
                                  className="bg-slate-900 border border-white/5 rounded-md px-2.5 py-1 text-xs font-mono text-slate-300"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Static schema visualizer */}
                          <div className="bg-black border border-white/5 rounded-xl p-4">
                            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono mb-2">
                              <Layers3 className="w-3.5 h-3.5 text-indigo-400" />
                              <span>Topology Connection Layout</span>
                            </div>
                            <div className="space-y-2 text-xs font-mono">
                              {project.architecture.connections.slice(0, 3).map((conn, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-slate-400">
                                  <span className="text-slate-500">{conn.from}</span>
                                  <ChevronRight className="w-3 h-3 text-slate-600" />
                                  <span className="text-blue-400 bg-blue-950/20 px-1.5 py-0.5 rounded text-[10px]">{conn.label}</span>
                                  <ChevronRight className="w-3 h-3 text-slate-600" />
                                  <span className="text-slate-300">{conn.to}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* AIRBNB ANIMATED DETAILED CASE STUDY */}
        <AirbnbCaseStudy />

        {/* BUILDABLE AI ANIMATED CASE STUDY */}
        <BuildableAICaseStudy />

        {/* DETAILED CHRONOLOGICAL EXPERIENCES TIMELINE */}
        <section id="skills" className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Skill Metrics (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="max-w-md">
              <h2 className="text-3xl font-display font-bold text-slate-100 tracking-tight flex items-center gap-2">
                <Sliders className="w-7 h-7 text-blue-400" />
                Technical Competencies
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                A breakdown of Mukul's core technical proficiency profiles across multi-tier microservice structures.
              </p>
            </div>

            {/* Category selection Tabs */}
            <div className="flex flex-wrap gap-1.5 border-b border-white/5 pb-3">
              {TECH_CATEGORIES.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setActiveTab(cat.name)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                    activeTab === cat.name
                      ? "bg-blue-950/40 border border-blue-900/60 text-blue-400 font-bold"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Progress indicators list */}
            <div className="space-y-3.5 bg-[#0a0a0a] border border-white/5 rounded-2xl p-5">
              {TECH_CATEGORIES.find((c) => c.name === activeTab)?.skills.map((skill) => (
                <div key={skill.name} className="space-y-1.5 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200">{skill.name}</span>
                    <span className="text-slate-500 font-medium">{skill.level} ({skill.proficiency}%)</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <motion.div
                       key={`${activeTab}-${skill.name}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.proficiency}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="bg-gradient-to-r from-blue-600 to-indigo-550 h-full rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chronological Timeline (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-3xl font-display font-bold text-slate-100 tracking-tight flex items-center gap-2">
              <FileText className="w-7 h-7 text-indigo-400" />
              Professional Chronology
            </h2>

            <div className="space-y-8 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-[2px] before:bg-white/10">
              
              {/* TCS Role Node */}
              {WORK_EXPERIENCE.map((exp, idx) => (
                <div key={idx} className="relative pl-10 group">
                  {/* Timeline circle bullet */}
                  <span className="absolute left-1.5 top-1.5 w-5 h-5 rounded-full border-4 border-[#030712] bg-blue-500 group-hover:scale-110 transition-transform flex items-center justify-center pointer-events-none" />
                  
                  <div className="space-y-3 bg-[#0a0a0a]/40 border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-white/5 pb-3">
                      <div>
                        <span className="text-xs font-mono font-bold text-blue-400 block tracking-wide uppercase">
                          {exp.company}
                        </span>
                        <h3 className="text-lg font-display font-bold text-slate-200">
                          {exp.role}
                        </h3>
                      </div>
                      <span className="text-xs font-mono text-slate-500 bg-stone-900 border border-white/5 px-2.5 py-1 rounded-md inline-block">
                        {exp.period}
                      </span>
                    </div>

                    {/* Metrics achievements highlights row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 border-b border-white/5 pb-3">
                      {exp.metrics.map((met, mIdx) => (
                        <div key={mIdx} className="bg-black p-2 rounded-lg border border-white/5">
                          <span className="text-blue-400 font-mono font-bold text-sm block leading-none">{met.value}</span>
                          <span className="text-[9px] font-mono text-slate-500 mt-0.5 block truncate leading-tight uppercase font-medium">{met.label}</span>
                        </div>
                      ))}
                    </div>

                    <ul className="space-y-2 text-sm text-slate-400 leading-relaxed">
                      {exp.highlights.map((hl, hlIdx) => (
                        <li key={hlIdx} className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Technology Badge Strip */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {exp.techStack.map((tech, tIdx) => (
                        <span key={tIdx} className="bg-[#0b0b0b] border border-white/5 px-2.5 py-0.5 rounded text-[11px] font-mono text-slate-400">
                          {tech}
                        </span>
                      ))}
                    </div>

                  </div>
                </div>
              ))}

              {/* Education Node */}
              <div className="relative pl-10 group">
                <span className="absolute left-1.5 top-1.5 w-5 h-5 rounded-full border-4 border-[#030712] bg-indigo-550 group-hover:scale-110 transition-transform pointer-events-none" />
                
                <div className="space-y-3 bg-[#0a0a0a]/40 border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-white/5 pb-3">
                    <div>
                      <span className="text-xs font-mono font-bold text-indigo-400 block tracking-wide uppercase">
                        ACADEMIC COORDINATES
                      </span>
                      <h3 className="text-lg font-display font-bold text-slate-200">
                        {ACADEMIC_INFO.college}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        {ACADEMIC_INFO.degree}
                      </p>
                    </div>
                    <span className="text-xs font-mono text-slate-500 bg-stone-900 border border-white/5 px-2.5 py-1 rounded-md inline-block">
                      {ACADEMIC_INFO.period}
                    </span>
                  </div>

                  <p className="text-sm text-slate-400 leading-relaxed">
                    B.Tech degree in Computer Science and Engineering from Ghaziabad representing foundations in SQL databases, Object Oriented Programming, Operating Systems, design methodologies, and core data algorithms.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-[#050505] border-t border-white/5 mt-24 py-8 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© 2026 Mukul Aggarwal. Certified Secure Spring Boot Systems Dev.</p>
          <div className="flex gap-4">
            <a href="#hero" className="hover:text-blue-400 transition-colors">TOP ^</a>
            <span className="text-slate-800">|</span>
            <span>Ghaziabad, India</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
