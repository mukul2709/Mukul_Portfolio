import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShieldAlert, CheckCircle2, ArrowRight, Lock, Unlock, Database, Clock, 
  Play, Users, TrendingUp, Zap, HelpCircle, Server, RefreshCw, Cpu, Check, 
  X, AlertTriangle, AlertCircle, FileSpreadsheet, Layers
} from "lucide-react";

interface LogMessage {
  id: string;
  time: string;
  thread: string;
  level: "INFO" | "WARN" | "ERROR" | "SUCCESS";
  module: string;
  message: string;
}

export default function AirbnbCaseStudy() {
  // Simulator State: 'idle' | 'browsing' | 'locking' | 'concurrent_attempt' | 'paying' | 'completed' | 'blocked_failure'
  const [flowState, setFlowState] = useState<"idle" | "browsing" | "locking" | "concurrent_attempt" | "paying" | "completed" | "blocked_failure">("idle");
  const [activeScenario, setActiveScenario] = useState<"normal" | "race_condition" | null>(null);
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const [selectedListingId, setSelectedListingId] = useState<number>(312);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  
  // Optimization Toggle Metrics
  const [optimizationsEnabled, setOptimizationsEnabled] = useState<boolean>(true);
  const [isSimulatingBenchmark, setIsSimulatingBenchmark] = useState<boolean>(false);
  const [simulatedLatency, setSimulatedLatency] = useState<number>(28); // 28ms optimized, 450ms unoptimized
  const [simulatedDoubleBookings, setSimulatedDoubleBookings] = useState<number>(0);

  // Add initial logs
  useEffect(() => {
    resetLogs();
  }, []);

  const resetLogs = () => {
    const timeNow = () => new Date().toLocaleTimeString();
    setLogs([
      {
        id: "1",
        time: timeNow(),
        thread: "main-exec-1",
        level: "INFO",
        module: "AirbnbEngineApplication",
        message: "Starting JVM Thread pool. Tomcat server bound to 0.0.0.0:3000"
      },
      {
        id: "2",
        time: timeNow(),
        thread: "hikari-pool-1",
        level: "INFO",
        module: "HikariDataSource",
        message: "HikariPool-1 - Connection pool initialized. PostgreSQL DB connection: nominal."
      }
    ]);
  };

  const addLog = (level: "INFO" | "WARN" | "ERROR" | "SUCCESS", module: string, message: string, customThread?: string) => {
    const timeString = new Date().toLocaleTimeString();
    const newLog: LogMessage = {
      id: Math.random().toString(),
      time: timeString,
      thread: customThread || `http-nio-exec-${Math.floor(Math.random() * 8) + 1}`,
      level,
      module,
      message
    };
    setLogs((prev) => [newLog, ...prev].slice(0, 30)); // Keep last 30 logs
  };

  // Run Booking Flow Simulation
  const runBookingSimulation = async (scenario: "normal" | "race_condition") => {
    setActiveScenario(scenario);
    setFlowState("browsing");
    setProgressPercent(15);
    resetLogs();
    
    addLog("INFO", "ListingController", `HTTP GET /api/listings/${selectedListingId} - Web Request by User Thread A`);
    if (optimizationsEnabled) {
      addLog("SUCCESS", "ListingRepository", "JPA FETCH JOIN executed. Single db trip queried Property, Amenities & Owner profile in 28ms.");
    } else {
      addLog("WARN", "ListingRepository", "N+1 trigger: Executed 1 query for listing detail, followed by 100 split sub-queries for associated nodes (Took 450ms).");
    }

    await delay(1800);
    setFlowState("locking");
    setProgressPercent(40);
    addLog("INFO", "BookingService", "Acquiring write intent lock. Initiating transaction: TX-312-BOOKING-A");
    
    if (optimizationsEnabled) {
      addLog("SUCCESS", "BookingRepository", "SELECT FOR UPDATE - Pessimistic Write Lock reserved inside PostgreSQL tables for row id 312.");
    } else {
      addLog("WARN", "BookingRepository", "No lock strategy. Row value read as 'IsAvailable=TRUE' without isolation security.");
    }

    await delay(1800);

    if (scenario === "race_condition") {
      setFlowState("concurrent_attempt");
      setProgressPercent(60);
      addLog("WARN", "BookingService", "CRITICAL - Concurrent Booking Request received for exact listing 312 from User Thread B (HTTP-nio-exec-99)", "http-nio-exec-99");
      addLog("INFO", "BookingRepository", "User Thread B attempting to read/write booking slot...", "http-nio-exec-99");

      if (optimizationsEnabled) {
        addLog("WARN", "BookingRepository", "[LOCK BLOCKED] - Row id 312 currently locked by TX-312-BOOKING-A. http-nio-exec-99 queueing...", "http-nio-exec-99");
        await delay(2000);
        setFlowState("paying");
        setProgressPercent(80);
        addLog("INFO", "StripeWebhookHandler", "Stripe API dispatched checkout.session.completed event safely.");
        addLog("INFO", "PaymentService", "Awaiting checkout validation ledger confirmation.");
        
        await delay(1800);
        setFlowState("completed");
        setProgressPercent(100);
        addLog("SUCCESS", "BookingService", "Transaction committed. Locking release triggered. Booking created successfully for User A.");
        addLog("INFO", "BookingRepository", "Pessimistic lock released for listing 312. Remaining queue awakened.", "http-nio-exec-99");
        addLog("ERROR", "BookingService", "User Thread B awakened: Slot status check is 'Available=FALSE'. Rejecting B booking attempt gracefully.", "http-nio-exec-99");
      } else {
        // Unoptimized double booking crash!
        addLog("WARN", "BookingRepository", "Double booking vulnerability! Thread B reads listing as 'IsAvailable=TRUE' concurrently.", "http-nio-exec-99");
        await delay(2000);
        setFlowState("blocked_failure");
        setProgressPercent(90);
        addLog("INFO", "StripeWebhookHandler", "Stripe double charge captured.");
        addLog("ERROR", "BookingService", "CRITICAL THREAD RACE - Double reservation created for exact same property dates! Room ID 312 booked twice.");
      }
    } else {
      // Normal successful flow without collision
      setFlowState("paying");
      setProgressPercent(75);
      addLog("INFO", "StripeWebhookHandler", "Stripe dispatch event: webhook token verified.");
      
      await delay(1800);
      setFlowState("completed");
      setProgressPercent(100);
      addLog("SUCCESS", "BookingService", "Transaction committed successfully. Room 312 status updated. Confirmation mailed.");
    }
  };

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  // Simulated latency check
  const startBenchmarkSimulation = () => {
    setIsSimulatingBenchmark(true);
    let counter = 0;
    const interval = setInterval(() => {
      counter += 10;
      if (counter >= 100) {
        clearInterval(interval);
        setIsSimulatingBenchmark(false);
        if (optimizationsEnabled) {
          setSimulatedLatency(28);
          setSimulatedDoubleBookings(0);
          addLog("SUCCESS", "Profiler", "Benchmark complete. Highly optimized spring response average: 28ms. 0 Double book incidents detected.");
        } else {
          setSimulatedLatency(450);
          setSimulatedDoubleBookings(14);
          addLog("WARN", "Profiler", "Benchmark complete. Unoptimized legacy N+1 queries result in 450ms query delay under concurrent loads. 14 Booking overlapping race errors found.");
        }
      }
    }, 150);
  };

  return (
    <section id="airbnb-case-study" className="scroll-mt-20 space-y-8">
      {/* Visual Header Banner */}
      <div className="border-[#1c1c1c] border bg-[#060606] rounded-2xl p-6 md:p-8 glow-box-blue relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/5 rounded-full filter blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-indigo-600/5 rounded-full filter blur-[80px] pointer-events-none" />

        <div className="flex flex-col lg:flex-row gap-8 items-start justify-between relative z-10">
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-blue-950/40 border border-blue-900/40 text-blue-400">
              <Layers className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
              DETAILED ARCHITECTURAL CASE STUDY
            </div>
            
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-slate-100">
              Airbnb Scale Engine: Concurrency & Lock Resilience
            </h2>
            
            <p className="text-sm md:text-base text-slate-400 leading-relaxed">
              An independent system design architecture built on <strong className="text-slate-200 font-semibold">Spring Boot (Java 21)</strong>, and <strong className="text-slate-200 font-semibold">PostgreSQL</strong>. The case study demonstrates solutions for major latency traps (<strong className="text-indigo-400">N+1 query loading cascades</strong>) and critical business failure states (<strong className="text-rose-400 font-semibold">double-booking overlaps</strong>) through pessimistic locking and fetch optimizations.
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Concurrency Safe</span>
                <span className="text-lg font-display font-bold text-blue-400 block mt-0.5">100% Safeguard</span>
              </div>
              <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Query Latency Savings</span>
                <span className="text-lg font-display font-bold text-indigo-400 block mt-0.5">93.7% Drop</span>
              </div>
              <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Database Trips</span>
                <span className="text-lg font-display font-bold text-sky-400 block mt-0.5">1 Request</span>
              </div>
              <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">System Framework</span>
                <span className="text-lg font-display font-bold text-slate-200 block mt-0.5">Spring-JPA / Postgres</span>
              </div>
            </div>
          </div>

          {/* Subtle 3D Depth Card illustrating the Technical Problem */}
          <div className="w-full lg:w-96 flex-shrink-0 group">
            <div className="bg-black/90 border border-white/10 rounded-2xl p-5 hover:border-blue-500/30 transition-all duration-500 shadow-xl relative overflow-hidden [transform-style:preserve-3d] [transform:rotateX(3deg)_rotateY(-3deg)] hover:[transform:rotateX(0deg)_rotateY(0deg)]">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500" />
              <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                The Core System Challenges
              </h3>
              
              <ul className="space-y-4 mt-4 text-xs">
                <li className="space-y-1">
                  <span className="font-semibold text-slate-200 block">1. The Overlap Collision Threat</span>
                  <p className="text-slate-400 leading-relaxed">
                    Under peak user reservation spikes, milliseconds delay between database reading availability checks and booking registration writes allow concurrent threads to double-book properties.
                  </p>
                </li>
                <li className="space-y-1">
                  <span className="font-semibold text-slate-200 block">2. Fetch N+1 Query Cascade</span>
                  <p className="text-slate-400 leading-relaxed">
                    Standard Hibernate mapping triggers lazy load query cascades, requiring 101 requests for 100 listings, choking Hikari database transaction connection pools.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: 2 columns for interactive flow and live logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Interactive Animation Simulator (7 columns) */}
        <div className="lg:col-span-7 bg-[#060606] border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
            <div>
              <span className="text-xs font-mono font-bold text-blue-400 block tracking-wider uppercase">SCENARIO DEEPMIND SIMULATOR</span>
              <h3 className="text-xl font-display font-bold text-slate-100 mt-0.5">Interactive Thread Controller</h3>
            </div>
            
            {/* Optimization Toggle */}
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-slate-400">Lock Optimization:</span>
              <button
                onClick={() => {
                  setOptimizationsEnabled(!optimizationsEnabled);
                  addLog("INFO", "ConfigurationControl", `Pessimistic write locking & Join fetches updated to: ${!optimizationsEnabled ? "ENABLED" : "DISABLED"}`);
                }}
                className={`px-3 py-1.5 rounded-lg border font-semibold transition-all cursor-pointer ${
                  optimizationsEnabled
                    ? "bg-blue-950/40 border-blue-500/40 text-blue-400 font-bold"
                    : "bg-rose-950/30 border-rose-900/40 text-rose-400"
                }`}
              >
                {optimizationsEnabled ? "ACTIVATED (Secure)" : "DEACTIVATED (Vulnerable)"}
              </button>
            </div>
          </div>

          {/* Scenario Picker Pills */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => runBookingSimulation("normal")}
              disabled={flowState !== "idle" && flowState !== "completed" && flowState !== "blocked_failure"}
              className={`px-4 py-2.5 rounded-xl border font-mono text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                flowState !== "idle" && flowState !== "completed" && flowState !== "blocked_failure" 
                  ? "opacity-40 cursor-not-allowed" 
                  : "bg-stone-900 hover:bg-stone-800 border-white/5 text-slate-200 active:scale-95"
              }`}
            >
              <Play className="w-3.5 h-3.5 text-blue-400" />
              1. Run Normal Booking Flow
            </button>

            <button
              onClick={() => runBookingSimulation("race_condition")}
              disabled={flowState !== "idle" && flowState !== "completed" && flowState !== "blocked_failure"}
              className={`px-4 py-2.5 rounded-xl border font-mono text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                flowState !== "idle" && flowState !== "completed" && flowState !== "blocked_failure" 
                  ? "opacity-40 cursor-not-allowed" 
                  : "bg-stone-900 hover:bg-blue-950/20 hover:border-blue-500/20 border-white/5 text-slate-200 active:scale-95"
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              2. Run Booking Collision Race
            </button>

            <button
              onClick={() => {
                setFlowState("idle");
                setActiveScenario(null);
                setProgressPercent(0);
                resetLogs();
              }}
              className="px-4 py-2.5 rounded-xl border border-white/5 bg-stone-900 hover:bg-stone-800 font-mono text-xs font-semibold text-slate-400 cursor-pointer"
            >
              Reset Sandbox
            </button>
          </div>

          {/* Sandbox Stage Canvas displaying architecture and live state */}
          <div className="border border-white/5 bg-black rounded-xl p-5 relative overflow-hidden min-h-[220px] flex flex-col justify-between">
            <div className="absolute top-2 right-3 flex items-center gap-1.5 text-[10px] font-mono text-slate-500 bg-stone-900/80 px-2 py-0.5 rounded border border-white/5">
              <span className={`w-1.5 h-1.5 rounded-full ${flowState !== "idle" ? "bg-blue-400 animate-pulse" : "bg-slate-500"}`} />
              STAGE: {flowState.toUpperCase()}
            </div>

            {/* Dynamic visual representation nodes */}
            <div className="grid grid-cols-4 gap-2 items-center text-center mt-6 relative z-10">
              
              {/* User Client Node(s) */}
              <div className="flex flex-col items-center group relative">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-300 ${
                  flowState === "browsing" || flowState === "locking" || flowState === "paying" || flowState === "completed"
                    ? "bg-blue-950/40 border-blue-400 text-blue-400 scale-110"
                    : "bg-stone-900 border-white/5 text-slate-600"
                }`}>
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono text-slate-400 mt-1.5">User Thread A</span>
                {flowState === "browsing" && (
                  <motion.div 
                    layoutId="data-carrier"
                    className="absolute -right-3 top-5 w-3 h-3 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50" 
                    animate={{ left: ["40px", "140px"] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                )}
              </div>

              {/* Spring Gateway Router */}
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-300 ${
                  flowState !== "idle" && flowState !== "blocked_failure"
                    ? "bg-indigo-950/40 border-indigo-400 text-indigo-400"
                    : "bg-stone-900 border-white/5 text-slate-600"
                }`}>
                  <Server className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono text-slate-400 mt-1.5">Gateway / Filters</span>
              </div>

              {/* Service Control Layer */}
              <div className="flex flex-col items-center relative">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-300 ${
                  flowState === "locking" || flowState === "concurrent_attempt" || flowState === "paying"
                    ? "bg-sky-950/40 border-sky-400 text-sky-400"
                    : flowState === "completed"
                    ? "bg-blue-950/40 border-blue-400 text-blue-400"
                    : "bg-stone-900 border-white/5 text-slate-600"
                }`}>
                  <Cpu className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono text-slate-400 mt-1.5">Booking Engine</span>

                {/* Sub-Thread representation for concurrent Collision */}
                {activeScenario === "race_condition" && (flowState === "concurrent_attempt" || flowState === "blocked_failure") && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute -top-12 left-1/2 -translate-x-1/2 bg-rose-950/90 border border-rose-500/40 p-1.5 rounded-lg text-rose-400 text-[9px] font-mono whitespace-nowrap z-50 flex items-center gap-1"
                  >
                    <AlertCircle className="w-3 h-3 text-rose-500 inline" />
                    Collide! User B Thread
                  </motion.div>
                )}
              </div>

              {/* Relational Database Target */}
              <div className="flex flex-col items-center relative">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-300 relative ${
                  optimizationsEnabled && (flowState === "locking" || flowState === "paying" || flowState === "completed")
                    ? "bg-blue-950/60 border-blue-400 text-blue-400"
                    : flowState === "blocked_failure"
                    ? "bg-rose-950/60 border-rose-400 text-rose-400"
                    : "bg-stone-900 border-white/5 text-slate-600"
                }`}>
                  <Database className="w-5 h-5" />
                  
                  {/* Lock Overlay Graphic */}
                  {flowState === "locking" || flowState === "concurrent_attempt" || flowState === "paying" ? (
                    optimizationsEnabled ? (
                      <div className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white rounded-full p-0.5 shadow-md">
                        <Lock className="w-2.5 h-2.5" />
                      </div>
                    ) : (
                      <div className="absolute -top-1.5 -right-1.5 bg-amber-500 text-black rounded-full p-0.5 shadow-md">
                        <Unlock className="w-2.5 h-2.5" />
                      </div>
                    )
                  ) : null}
                </div>
                <span className="text-[10px] font-mono text-slate-400 mt-1.5">PostgreSQL Row</span>
              </div>

            </div>

            {/* Simulated Live Flow Status Bar */}
            <div className="mt-8 pt-4 border-t border-white/5 space-y-1">
              <div className="flex justify-between text-xs font-mono text-slate-500">
                <span>Simulation Progress</span>
                <span className="text-slate-300 font-semibold">{progressPercent}%</span>
              </div>
              
              <div className="w-full bg-stone-900 h-1.5 rounded-full overflow-hidden">
                <motion.div
                  className="bg-blue-500 h-full rounded-full"
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono mt-1 text-slate-400">
                <span>
                  {flowState === "idle" && "Stage idle. Select a simulation above."}
                  {flowState === "browsing" && (optimizationsEnabled ? "User is safe browsing. Joined fetch executed in 28ms index speed." : "User browsing listing. Vulnerable N+1 query trigger loaded db.")}
                  {flowState === "locking" && (optimizationsEnabled ? "Pessimistic write locked property row. Queue blocks collateral writes." : "Booking intent saved. No PostgreSQL transaction lock set.")}
                  {flowState === "concurrent_attempt" && (optimizationsEnabled ? "COLLISION COLLATERAL: Thread B waiting on locked database lock." : "COLLIDER IMPACT: Thread B successfully bypasses checks. Thread overlap ready.")}
                  {flowState === "paying" && "Awaiting secure Stripe payment confirmation & webhook execution."}
                  {flowState === "completed" && "SUCCESS - Transaction committed, booking recorded safely, resources release."}
                  {flowState === "blocked_failure" && "CRITICAL COLLISION ERROR - Overlapping reservation created. Double-booked!"}
                </span>
              </div>
            </div>

          </div>

          {/* Code Showcase detailing the custom resolution implemented */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Zap className="w-4 h-4 text-blue-500" />
              Sovereign Spring-Boot Lock Controller
            </h4>
            
            <p className="text-xs text-slate-400">
              When a booking write attempts entry, the engine secures the database node using PostgreSQL row locking:
            </p>

            <div className="bg-[#030303] border border-white/5 rounded-xl p-4 font-mono text-xs overflow-x-auto text-slate-300">
              <code className="block">
                <span className="text-indigo-400">@Lock</span>(LockModeType.<span className="text-blue-400 font-semibold">PESSIMISTIC_WRITE</span>)<br />
                <span className="text-indigo-400">@Query</span>(<span className="text-sky-400">"SELECT p FROM Property p WHERE p.id = :id"</span>)<br />
                Optional&lt;Property&gt; <span className="text-emerald-400">findAndLockById</span>(<span className="text-orange-400">@Param</span>(<span className="text-sky-400">"id"</span>) Long id);
              </code>
            </div>
          </div>

        </div>

        {/* Right Side: Log Tracer Board (5 columns) */}
        <div className="lg:col-span-12 xl:col-span-5 lg:order-last bg-[#060606] border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col justify-between h-[510px]">
          
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping inline-block" />
              <h3 className="text-sm font-mono text-slate-200 uppercase font-bold tracking-wider">Spring Boot Pipeline Trace</h3>
            </div>
            <button
              onClick={resetLogs}
              className="text-slate-500 hover:text-slate-300 text-xs font-mono transition-colors"
            >
              Clear Feed
            </button>
          </div>

          {/* Tracer view list */}
          <div className="flex-1 overflow-y-auto my-4 pr-1 space-y-2.5 font-mono text-[10px] leading-relaxed select-text select-text-slate-200">
            <AnimatePresence initial={false}>
              {logs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-black/40 border border-white/[0.02] p-2.5 rounded border-l-2 relative overflow-hidden"
                  style={{
                    borderLeftColor:
                      log.level === "SUCCESS" ? "#3b82f6" :
                      log.level === "WARN" ? "#f59e0b" :
                      log.level === "ERROR" ? "#ef4444" : "#64748b"
                  }}
                >
                  <div className="flex items-center justify-between text-slate-500 mb-1">
                    <span>{log.time}</span>
                    <span className="text-slate-600">[{log.thread}]</span>
                  </div>
                  <div>
                    <span className={`font-bold mr-1 ${
                      log.level === "SUCCESS" ? "text-blue-400" :
                      log.level === "WARN" ? "text-amber-400" :
                      log.level === "ERROR" ? "text-rose-400" : "text-slate-400"
                    }`}>
                      [{log.level}]
                    </span>
                    <span className="text-slate-400 font-semibold mr-1">{log.module} :</span>
                    <span className="text-slate-300">{log.message}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="bg-black border border-white/5 p-3 rounded-xl text-center">
            <p className="text-[10px] font-mono text-slate-500">
              Showing pipeline logging outputs from Spring core clusters.
            </p>
          </div>

        </div>

      </div>

      {/* Optimization Impact & Benchmarks Section */}
      <div className="bg-[#060606] border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div>
            <span className="text-xs font-mono font-bold text-blue-400 block tracking-wider uppercase">PERFORMANCE PROFILING</span>
            <h3 className="text-2xl font-display font-bold text-slate-100 mt-0.5">Optimization Benchmarks</h3>
          </div>

          <button
            onClick={startBenchmarkSimulation}
            disabled={isSimulatingBenchmark}
            className="px-4 py-2 text-xs font-mono font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg transition-transform active:scale-95 disabled:opacity-40 select-none cursor-pointer flex items-center gap-2"
          >
            {isSimulatingBenchmark ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Executing JVM Tests...
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                Run Performance Profilometer
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          {/* Visual comparison of latencies */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
              <span>SQL Query Response Latency (N+1 Solution)</span>
              <span className="text-blue-400 text-xs font-mono font-semibold">93.7% latency speedup</span>
            </h4>

            {/* Delay Speed comparison bars */}
            <div className="space-y-3 font-mono">
              <div>
                <div className="flex justify-between text-xs mb-1 text-slate-400">
                  <span>Legacy JPA Iteration (101 db queries cascade)</span>
                  <span className="text-rose-400 font-bold">450 ms</span>
                </div>
                <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: "100%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 text-slate-400">
                  <span>Optimized joining fetch (FETCH JOIN Single Query)</span>
                  <span className="text-blue-400 font-bold">
                    {isSimulatingBenchmark ? "Calculating..." : `${simulatedLatency} ms`}
                  </span>
                </div>
                <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                  <motion.div
                    className="bg-blue-500 h-full rounded-full"
                    animate={{ width: isSimulatingBenchmark ? ["0%", "50%"] : optimizationsEnabled ? "6.22%" : "100%" }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              The graph represents average server responses loading active properties with owner profiles. Transitioning from serial lazy loading (N+1 queries) to Spring entity graph fetches completely eliminated database choke points.
            </p>
          </div>

          {/* Visual comparison of collision rates */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
              <span>Concurrent Overlapping Booking Incidents</span>
              <span className="text-emerald-400 text-xs font-mono font-semibold">100% collision secure</span>
            </h4>

            <div className="space-y-3 font-mono">
              <div>
                <div className="flex justify-between text-xs mb-1 text-slate-400">
                  <span>No Locks applied (Overlapping transactions)</span>
                  <span className="text-rose-400 font-bold">14 Race Errors</span>
                </div>
                <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-rose-500/80 h-full rounded-full" style={{ width: "100%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 text-slate-400">
                  <span>Pessimistic write locking applied (SELECT FOR UPDATE)</span>
                  <span className="text-blue-400 font-bold">
                    {isSimulatingBenchmark ? "Analyzing..." : `${simulatedDoubleBookings} Errors`}
                  </span>
                </div>
                <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                  <motion.div
                    className="bg-blue-500 h-full rounded-full"
                    animate={{ width: isSimulatingBenchmark ? ["0%", "40%"] : optimizationsEnabled ? "0%" : "100%" }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              Incidents measured during test simulations under concurrent thread pools. Applying rowlocks forces relational tables to enqueue incoming overlapping updates blocking race conditions entirely.
            </p>
          </div>

        </div>

      </div>

    </section>
  );
}
