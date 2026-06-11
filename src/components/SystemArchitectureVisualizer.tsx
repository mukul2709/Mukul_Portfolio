import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Server, Database, Network, Key, Play, ShieldAlert, Zap, Cpu, RefreshCw, Layers 
} from "lucide-react";

interface LogTrace {
  timestamp: string;
  level: "INFO" | "WARN" | "DEBUG" | "SUCCESS";
  thread: string;
  logger: string;
  message: string;
}

interface NodePosition {
  id: string;
  label: string;
  x: number;
  y: number;
  icon: any;
  color: string;
  description: string;
}

export default function SystemArchitectureVisualizer() {
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<number>(-1);
  const [isLocked, setIsLocked] = useState(false);
  const [logTraces, setLogTraces] = useState<LogTrace[]>([]);
  
  // Custom Node Blueprint positioning inside a clean responsive grid coordinates
  const nodes: NodePosition[] = [
    { id: "client", label: "Browser Client", x: 10, y: 50, icon: Layers, color: "from-sky-400 to-blue-500", description: "Express SPA sending requests with JWT header" },
    { id: "gateway", label: "API Gateway", x: 30, y: 50, icon: Key, color: "from-purple-500 to-indigo-600", description: "Spring Security Filter Chain / Decodes Authentication JWT" },
    { id: "property_svc", label: "Property Service", x: 55, y: 25, icon: Cpu, color: "from-emerald-500 to-teal-600", description: "V2 Spring Boot. Manages active listings cluster" },
    { id: "booking_svc", label: "Booking Service", x: 55, y: 75, icon: Cpu, color: "from-teal-500 to-cyan-600", description: "V2 Spring Boot. Secures database states & balances" },
    { id: "redis_cache", label: "Redis Cache L2", x: 85, y: 20, icon: Zap, color: "from-amber-400 to-orange-500", description: "In-memory database caching 94% of page listings queries" },
    { id: "postgres_db", label: "PostgreSQL Database", x: 85, y: 80, icon: Database, color: "from-emerald-500 to-emerald-700", description: "ACID safe transactional records pool with HikariCP" }
  ];

  const actions = [
    {
      id: "airbnb_booking",
      name: "Standard Airbnb Booking",
      desc: "Triggers pessimistic write lock transaction to eliminate double-booking hazard.",
      path: ["client", "gateway", "booking_svc", "postgres_db"],
      logs: [
        { level: "INFO", logger: "o.s.security.web.FilterChainProxy", message: "Secured REST request received. Parsing Bearer token..." },
        { level: "DEBUG", logger: "c.m.a.security.JwtAuthenticationFilter", message: "JWT token decoded successfully. Subject: mukul.agarwal2709. Role: USER" },
        { level: "INFO", logger: "c.m.a.service.BookingServiceImpl", message: "Acquiring Pessimistic Write Lock (FOR UPDATE) for Property ID: 1045" },
        { level: "SUCCESS", logger: "org.hibernate.SQL", message: "SELECT val FROM property WHERE id = 1045 FOR UPDATE" },
        { level: "INFO", logger: "c.m.a.service.BookingServiceImpl", message: "Availability validated. No double-booking race condition. Persisting reservation." },
        { level: "SUCCESS", logger: "c.m.a.controller.BookingController", message: "Booking confirmed safely. Code: RSV-7781. Returning 201 CREATED." }
      ]
    },
    {
      id: "property_listings",
      name: "Load Listings (Redis Cache Hit)",
      desc: "Bypasses primary database and serves high-traffic listing summaries instantly from cache.",
      path: ["client", "gateway", "property_svc", "redis_cache"],
      logs: [
        { level: "INFO", logger: "o.a.c.c.CoyoteAdapter", message: "GET /api/v1/properties requested." },
        { level: "DEBUG", logger: "c.m.a.cache.RedisCacheManager", message: "Inquiring cache key: 'properties::all'" },
        { level: "SUCCESS", logger: "c.m.a.cache.RedisCacheManager", message: "Cache HIT for 'properties::all'. Served 150 Listings items. Bypassed PostgreSQL." },
        { level: "INFO", logger: "c.m.a.controller.PropertyController", message: "Query loaded in 4ms, payload size: 14.5 KB. Status: 200 OK." }
      ]
    },
    {
      id: "ledger_batch_insert",
      name: "Fintech Batch Actions (10k records)",
      desc: "Leverages custom Spring JDBC array batch templates instead of slow sequential Hibernate saves.",
      path: ["client", "gateway", "booking_svc", "postgres_db"],
      logs: [
        { level: "INFO", logger: "c.m.a.controller.FintechController", message: "POST /api/v1/batch-records containing 10,000 ledger nodes." },
        { level: "INFO", logger: "c.m.a.service.BatchProcessingService", message: "Constructing JDBC Batch Insert templates, partition size: 500 records" },
        { level: "DEBUG", logger: "org.springframework.jdbc.core.JdbcTemplate", message: "Executing batch chunk 1 of 20 (500 rows)..." },
        { level: "DEBUG", logger: "org.springframework.jdbc.core.JdbcTemplate", message: "Executing batch chunk 10 of 20 (500 rows)..." },
        { level: "SUCCESS", logger: "c.m.a.service.BatchProcessingService", message: "All 10,000 corporate transaction records saved in exactly 1.1s (91% bottleneck decrease)." }
      ]
    }
  ];

  const triggerAction = async (actionId: string) => {
    setActiveAction(actionId);
    setActiveStep(0);
    setIsLocked(false);
    setLogTraces([]);

    const selectedAction = actions.find(a => a.id === actionId);
    if (!selectedAction) return;

    // Simulate step-by-step routing with corresponding logs
    for (let i = 0; i < selectedAction.path.length; i++) {
      setActiveStep(i);
      
      // Determine lock status for Postgres DB specifically
      if (actionId === "airbnb_booking" && selectedAction.path[i] === "postgres_db") {
        setIsLocked(true);
      }

      // Append logs corresponding to that action phase
      const partialLogs = selectedAction.logs.slice(0, Math.ceil((i + 1) * (selectedAction.logs.length / selectedAction.path.length)));
      
      const formattedLogsObj = partialLogs.map((log) => ({
        timestamp: new Date().toISOString().substring(11, 19) + ".452",
        level: log.level as any,
        thread: "http-nio-3000-exec-" + (Math.floor(Math.random() * 5) + 1),
        logger: log.logger,
        message: log.message
      }));
      setLogTraces(formattedLogsObj);

      await new Promise(resolve => setTimeout(resolve, 1100));
    }
    
    // Complete
    setActiveStep(-1);
    setIsLocked(false);
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 bg-[#060606] border border-white/10 rounded-2xl p-6 glow-box-blue shadow-[0_0_30px_rgba(59,130,246,0.06)]">
      
      {/* Control Block (Left Panel) */}
      <div className="lg:col-span-1 space-y-4">
        <div>
          <span className="text-xs font-mono font-semibold tracking-wider text-blue-400 bg-blue-950/40 px-2 py-1 rounded inline-block mb-2">
            SYSTEM DESIGN SANDBOX
          </span>
          <h3 className="text-xl font-display font-bold text-slate-100">
            Pipeline Playground
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Trigger active transactions and watch the microsecond requests animate through the backend architecture topology.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          {actions.map((act) => (
            <button
              key={act.id}
              onClick={() => triggerAction(act.id)}
              disabled={activeStep >= 0}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                activeAction === act.id
                  ? "bg-blue-950/40 border-blue-905-0 shadow-sm"
                  : "bg-white/[0.02] border-white/5 hover:border-white/10"
              } ${activeStep >= 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-display font-semibold text-sm text-slate-200 group-hover:text-blue-400">
                  {act.name}
                </span>
                <Play className={`w-3.5 h-3.5 ${activeAction === act.id ? "text-blue-400" : "text-slate-500"}`} />
              </div>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                {act.desc}
              </p>
            </button>
          ))}
        </div>

        {/* Real-time system parameters stats */}
        <div className="bg-black border border-white/5 p-4 rounded-xl space-y-3 font-mono text-xs">
          <div className="text-slate-400 font-semibold border-b border-white/5 pb-1 flex items-center justify-between">
            <span>METRIC PARAMETERS</span>
            <RefreshCw className={`w-3.5 h-3.5 text-blue-500 ${activeStep >= 0 ? "animate-spin" : ""}`} />
          </div>
          <div className="grid grid-cols-2 gap-2 text-slate-300">
            <div>
              <span className="text-slate-500">Active Threads</span>
              <p className="font-bold text-sm text-indigo-400">
                {activeStep >= 0 ? "14 Threads" : "1 Pool Threads"}
              </p>
            </div>
            <div>
              <span className="text-slate-500">POSTGRESQL LOCKS</span>
              <p className={`font-bold text-sm ${isLocked ? "text-amber-500" : "text-blue-400"}`}>
                {isLocked ? "PESSIMISTIC WRITE LOCK" : "NONE"}
              </p>
            </div>
            <div>
              <span className="text-slate-500">Average Ping</span>
              <p className="font-bold text-sm text-blue-400">
                {activeAction === "property_listings" ? "4 ms (L2 Cache)" : "25 ms (Hikari Pools)"}
              </p>
            </div>
            <div>
              <span className="text-slate-500">Service Status</span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 mt-0.5 rounded-full text-[10px] font-semibold bg-blue-950/40 border border-blue-900/40 text-blue-400">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                NOMINAL
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Canvas Panel (Right Panel - Multi-tier chart) */}
      <div className="lg:col-span-2 flex flex-col justify-between border border-white/5 bg-black rounded-2xl p-5 overflow-hidden min-h-[380px] relative">
        
        {/* Dynamic Topology Canvas */}
        <div className="relative w-full h-56 mt-4">
          
          {/* Static Grid lines showing wire pathways */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Layer connections lines */}
            <path d="M 80 110 L 220 110" stroke="#1c1c1c" strokeWidth="2" strokeDasharray="4 4" />
            <path d="M 220 110 Q 300 70 410 60" stroke="#1c1c1c" strokeWidth="2" strokeDasharray="3 3" />
            <path d="M 220 110 Q 300 150 410 160" stroke="#1c1c1c" strokeWidth="2" strokeDasharray="3 3" />
            
            <path d="M 410 60 L 610 50" stroke="#1c1c1c" strokeWidth="2" strokeDasharray="2 2" />
            <path d="M 410 160 L 610 170" stroke="#1c1c1c" strokeWidth="2" strokeDasharray="2 2" />

            {/* Active glowing path packet if action gets triggered */}
            {activeAction && activeStep !== -1 && (
              <AnimatePresence>
                {/* Visual animating transaction packet */}
                {activeStep < actions.find(a => a.id === activeAction)!.path.length - 1 && (
                  <motion.circle 
                    key={`${activeAction}-${activeStep}`}
                    cx={
                      activeStep === 0 ? "15%" :
                      activeStep === 1 ? "40%" :
                      activeStep === 2 ? "65%" : "85%"
                    }
                    cy={
                      activeStep === 0 ? 110 :
                      activeStep === 1 ? 110 :
                      actions.find(a => a.id === activeAction)!.path[activeStep + 1].includes("cache") || 
                      actions.find(a => a.id === activeAction)!.path[activeStep + 1].includes("prop") ? 55 : 165
                    }
                    r="6"
                    className="fill-blue-400 drop-shadow-[0_0_10px_#3b82f6]"
                    initial={{ scale: 0.1, opacity: 0 }}
                    animate={{ 
                      scale: 1, 
                      opacity: [0, 1, 1, 0],
                      x: [0, 170] 
                    }}
                    transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
                  />
                )}
              </AnimatePresence>
            )}
          </svg>

          {/* Node items */}
          {nodes.map((node) => {
            const isNodeActive = activeAction && 
              actions.find(a => a.id === activeAction)?.path.includes(node.id) &&
              actions.find(a => a.id === activeAction)?.path.indexOf(node.id) === activeStep;

            const hasBeenTouched = activeAction && 
              actions.find(a => a.id === activeAction)?.path.includes(node.id) &&
              actions.find(a => a.id === activeAction)!.path.indexOf(node.id) <= (activeStep === -1 ? 99 : activeStep);

            return (
              <div
                key={node.id}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group pointer-events-auto z-10"
              >
                <div 
                  className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-300 relative ${
                    isNodeActive 
                      ? "bg-blue-950 border-blue-400 scale-110 shadow-lg shadow-blue-500/20" 
                      : hasBeenTouched
                      ? "bg-stone-900 border-indigo-500/40 shadow-md shadow-indigo-500/5"
                      : "bg-[#0b0b0b] border-white/5"
                  }`}
                >
                  <node.icon className={`w-5 h-5 ${isNodeActive ? "text-blue-400 animate-pulse" : hasBeenTouched ? "text-slate-300" : "text-slate-600"}`} />
                  
                  {/* Database Pessimistic Lock UI Ring */}
                  {node.id === "postgres_db" && isLocked && (
                    <motion.span 
                      className="absolute inset-0 border-2 border-amber-500/60 rounded-xl animate-ping"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </div>
                
                <span className={`text-[11px] font-mono font-medium mt-1.5 px-1.5 py-0.5 rounded transition-all ${
                  isNodeActive ? "text-blue-400 bg-blue-950/40 font-bold" : "text-slate-400"
                }`}>
                  {node.label}
                </span>

                {/* Micro tooltip descriptions */}
                <div className="absolute top-14 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 bg-[#0f0f0f] border border-white/10 text-[10px] text-slate-300 rounded font-sans p-2 w-36 text-center shadow-xl transition-all duration-200 z-50">
                  {node.description}
                </div>
              </div>
            );
          })}
        </div>

        {/* Live synchronized console feed showing Spring boot details (Logs feed) */}
        <div className="bg-black/80 border border-white/5 rounded-xl p-3 h-32 overflow-y-auto selection:bg-blue-900/45">
          <div className="flex items-center justify-between border-b border-white/5 pb-1 mb-1.5">
            <span className="text-[10px] font-mono font-bold text-slate-500 flex items-center gap-1.5">
              <Network className="w-3 h-3 text-indigo-400" />
              LIVE SPRING BOOT CONSOLE TRACE PIPELINE
            </span>
            <span className="bg-stone-950 text-[9px] text-slate-400 px-1.5 py-0.5 rounded font-mono border border-white/5">
              {logTraces.length} records piped
            </span>
          </div>

          <div className="space-y-1 text-[11px] font-mono">
            {logTraces.length === 0 ? (
              <p className="text-slate-600 italic">No events triggered. Click an action on the left to fire network requests...</p>
            ) : (
              logTraces.map((log, idx) => (
                <div key={idx} className="flex items-start gap-1 leading-relaxed">
                  <span className="text-slate-500 flex-shrink-0">{log.timestamp}</span>
                  <span className={`flex-shrink-0 font-bold ${
                    log.level === "SUCCESS" ? "text-blue-400" :
                    log.level === "WARN" ? "text-amber-400" :
                    log.level === "DEBUG" ? "text-indigo-400" : "text-slate-400"
                  }`}>
                    [{log.level}]
                  </span>
                  <span className="text-slate-400 font-medium overflow-hidden max-w-[130px] text-ellipsis whitespace-nowrap">
                    [{log.thread}] {log.logger} :
                  </span>
                  <span className="text-slate-300 ml-1">{log.message}</span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
