import { useState, useRef, useEffect } from "react";
import { Terminal, Shield, Play, HelpCircle, CornerDownLeft, Sparkles, CheckCircle } from "lucide-react";
import { motion } from "motion/react";
import { CONTACT_INFO, PROJECTS } from "../data";

interface LogLine {
  text: string;
  type: "input" | "system" | "success" | "error" | "output";
}

export default function InteractiveTerminal() {
  const [history, setHistory] = useState<LogLine[]>([
    { text: "MukulAggarwalOS v3.1.2 Initialization complete.", type: "system" },
    { text: "All Java Microservices status: ONLINE [✓]", type: "success" },
    { text: "Secure JWT Endpoint Protection activated.", type: "success" },
    { text: "Type 'help' or click standard action buttons below to query database profile.", type: "system" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (cmd: string) => {
    const cleanCmd = cmd.trim().toLowerCase();
    if (!cleanCmd) return;

    const newHistory = [...history, { text: `mukul-aggarwal@backend:~$ ${cmd}`, type: "input" as const }];

    switch (cleanCmd) {
      case "help":
        setHistory([
          ...newHistory,
          { text: "Available Commands:", type: "system" },
          { text: "  about     - View Mukul's professional summary.", type: "output" },
          { text: "  skills    - Print verified technical stack and core competencies.", type: "output" },
          { text: "  projects  - List live high-performance system designs.", type: "output" },
          { text: "  health    - Run active diagnostics on Spring Boot & PostgreSQL containers.", type: "output" },
          { text: "  contact   - Display secure developer communication protocols.", type: "output" },
          { text: "  clear     - Wipe local terminal stream logs.", type: "output" }
        ]);
        break;
      case "about":
        setHistory([
          ...newHistory,
          { text: "--- PROFESSIONAL SUMMARY ---", type: "system" },
          { text: "Experienced Java Backend Developer with over 3 years of expertise constructing high-performance, secure, and distributed microservice grids under TCS & proprietary labs.", type: "output" },
          { text: "Expertise: Spring Boot, PostgreSQL, JPA, JPA pessimistic locking, Docker, Kubernetes, and secure integration of AI large language models with real-time stream pipes.", type: "output" }
        ]);
        break;
      case "skills":
        setHistory([
          ...newHistory,
          { text: "--- TECHNICAL ECOSYSTEM CORES ---", type: "system" },
          { text: "• LANGUAGES: Java (11, 21), Python, SQL", type: "success" },
          { text: "• BACKEND SYSTEMS: Spring Boot, Spring Security, Hibernate, JPA, Microservices, RESTful APIs, JWT, Maven", type: "output" },
          { text: "• DATABASES: PostgreSQL, Oracle SQL, Sybase, MongoDB, Redis, MinIO S3", type: "output" },
          { text: "• INTEGRATIONS: OpenAI API (Streaming / SSE), Stripe Payments, Apache Kafka", type: "output" },
          { text: "• DEVOPS & TESTING: Docker, Kubernetes, CI/CD, JUnit, Mockito, Git", type: "output" }
        ]);
        break;
      case "projects":
        setHistory([
          ...newHistory,
          { text: "--- ENTERPRISE & INDEPENDENT BUILDS ---", type: "system" },
          ...PROJECTS.map(p => ({
            text: `▶ ${p.title} (${p.category}) - Tech: ${p.techStack.slice(0, 4).join(", ")}. Primary Improvement: ${p.metrics[0].value} ${p.metrics[0].label}.`,
            type: "success" as const
          })),
          { text: "Type 'project <id>' (e.g. 'project airbnb-backend' or 'project buildable-ai') for microarchitecture specification.", type: "system" }
        ]);
        break;
      case "project airbnb-backend":
        setHistory([
          ...newHistory,
          { text: "=== PROPERTY RESERVATION MICROSERVICE GRID ===", type: "system" },
          { text: "• Concurrency protection: Pessimistic locks prevent 100% of parallel double bookings.", type: "success" },
          { text: "• Authentication: Stateless Spring Security filter validation decoding JWT signatures.", type: "output" },
          { text: "• Deployment architecture: Multi-stage Dockerized containers managed under Kubernetes resource specifications.", type: "output" }
        ]);
        break;
      case "project buildable-ai":
        setHistory([
          ...newHistory,
          { text: "=== BUILDABLE AI GENERATOR UTILITY ===", type: "system" },
          { text: "• Real-time streaming UI: Spring Boot streaming codes to browser via Server-Sent Events (SSE).", type: "success" },
          { text: "• Storage cluster: Integrated MinIO S3 client for isolated developer workspace snapshots.", type: "output" },
          { text: "• Monetary compliance: Fully-integrated Stripe billing engine listening to safe webhook pings.", type: "output" }
        ]);
        break;
      case "health":
        setHistory([
          ...newHistory,
          { text: "🚀 Running full-grid diagnostics...", type: "system" },
          { text: "[OK] Spring Boot Microservice Container Client: UP (ping: 1ms)", type: "success" },
          { text: "[OK] PostgreSQL Cluster Pool (HikariCP): Active Connections: 18/50 (ping: 4ms)", type: "success" },
          { text: "[OK] Redis Level 2 Query Cache Layer: HIT RATE: 94.2%", type: "success" },
          { text: "[OK] MinIO Object Workspace Storage: REACHABLE (99.9% uptime)", type: "success" },
          { text: "Status: ALL SYSTEMS NOMINAL AND SAFE FOR PRODUCTION DEPLOYMENT.", type: "success" }
        ]);
        break;
      case "contact":
        setHistory([
          ...newHistory,
          { text: "--- HOST PORT CHANNELS ---", type: "system" },
          { text: `📧 Direct Email: ${CONTACT_INFO.email}`, type: "output" },
          { text: `📞 Mobile Connection: ${CONTACT_INFO.phone}`, type: "output" },
          { text: `💼 Linkedin: ${CONTACT_INFO.linkedin}`, type: "output" },
          { text: "Location: Ghaziabad, Uttar Pradesh, India (GMT+5:30)", type: "output" }
        ]);
        break;
      case "clear":
        setHistory([]);
        break;
      default:
        setHistory([
          ...newHistory,
          { text: `Command not found: '${cmd}'. Enter 'help' to review authorized execution syntax.`, type: "error" }
        ]);
    }
    setInputValue("");
  };

  const focusInput = () => {
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <div className="w-full bg-[#060606] border border-white/10 rounded-xl overflow-hidden shadow-2xl font-mono text-sm shadow-blue-500/5">
      {/* Top Bar resembling standard IDE console or server shell */}
      <div className="bg-[#0b0b0b] border-b border-white/5 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-blue-500/80 inline-block"></span>
          </div>
          <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5 ml-2">
            <Terminal className="w-4 h-4 text-blue-500" />
            mukul-aggarwal@production-server:~
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-blue-950/40 border border-blue-900/40 text-[10px] text-blue-400 font-semibold px-2 py-0.5 rounded flex items-center gap-1">
            <Shield className="w-3 h-3" /> SSL SECURE
          </span>
        </div>
      </div>

      {/* Terminal Output Screen */}
      <div 
        ref={containerRef}
        onClick={focusInput}
        className="h-80 overflow-y-auto px-5 py-4 space-y-2 bg-black cursor-text scrollbar"
      >
        {history.map((line, idx) => (
          <div key={idx} className="leading-relaxed whitespace-pre-wrap">
            {line.type === "input" && (
              <span className="text-blue-400 font-medium">{line.text}</span>
            )}
            {line.type === "system" && (
              <span className="text-slate-400 font-semibold">{line.text}</span>
            )}
            {line.type === "success" && (
              <span className="text-blue-400 font-medium">{line.text}</span>
            )}
            {line.type === "error" && (
              <span className="text-rose-400">{line.text}</span>
            )}
            {line.type === "output" && (
              <span className="text-slate-300 font-normal">{line.text}</span>
            )}
          </div>
        ))}
      </div>

      {/* Input box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCommand(inputValue);
        }}
        className="flex items-center gap-2 px-5 py-3 border-t border-white/5 bg-[#0a0a0a]"
      >
        <span className="text-blue-400 font-bold">mukul-aggarwal@backend:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type 'help' or try preset actions..."
          className="flex-1 bg-transparent text-slate-100 border-none outline-none focus:ring-0 leading-relaxed font-mono selection:bg-blue-900/60"
          autoFocus={false}
        />
        <button
          type="submit"
          className="text-slate-400 hover:text-blue-400 transition-colors pointer-events-auto p-1 rounded-md hover:bg-slate-800/50"
          title="Execute Command"
        >
          <CornerDownLeft className="w-4 h-4" />
        </button>
      </form>

      {/* Suggestion Quick Pills */}
      <div className="bg-[#080808] border-t border-white/5 px-4 py-3 flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-500 font-semibold flex items-center gap-1 mr-1">
          <HelpCircle className="w-3.5 h-3.5 text-slate-600" /> Click to execute:
        </span>
        {[
          { label: "Diagnostics", cmd: "health", icon: Play },
          { label: "Tech Stack", cmd: "skills", icon: Sparkles },
          { label: "Systems Core", cmd: "projects", icon: CheckCircle },
          { label: "Connect", cmd: "contact", icon: Terminal },
          { label: "About", cmd: "about", icon: Terminal }
        ].map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleCommand(item.cmd)}
            className="bg-white/5 hover:bg-blue-600/10 border border-white/10 hover:border-blue-500/30 transition-all text-xs font-medium text-slate-300 hover:text-blue-400 px-3 py-1.5 rounded-lg flex items-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <item.icon className="w-3.5 h-3.5" />
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
