import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles, Layers, TerminalSquare, Database, Lock, ShieldCheck, 
  Cpu, ArrowRight, Play, Server, RefreshCw, Layers3, FolderTree, CloudLightning,
  CheckCircle, FileCode, Check, Trash2, BookOpen, Clock, Settings, HelpCircle
} from "lucide-react";

// Mock templates representing the streams of code generated for tenants
const GENERATIVE_TEMPLATES = [
  {
    fileName: "src/components/Dashboard.tsx",
    codeLines: [
      "import React from 'react';",
      "import { LineChart, ResponsiveContainer } from 'recharts';",
      "export default function SmartDashboard() {",
      "  const metrics = [ { label: 'active_sessions', val: 3201 } ];",
      "  return (",
      "    <div className='p-6 bg-slate-900 border border-white/5'>",
      "       <h3 className='text-sm text-slate-400'>Virtual Node metrics</h3>",
      "       <div className='font-mono text-3xl font-bold'>3.2K</div>",
      "    </div>",
      "  );",
      "}"
    ]
  },
  {
    fileName: "server.ts",
    codeLines: [
      "import express from 'express';",
      "const app = express();",
      "app.get('/api/telemetry', (req, res) => {",
      "  res.json({ cpu: '3.2%', activeThreads: 14 });",
      "});",
      "app.listen(3000, () => {",
      "  console.log('Stream gateway listening along http://0.0.0.0:3000');",
      "});"
    ]
  }
];

interface SSEEventMessage {
  event: string;
  data: string;
}

export default function BuildableAICaseStudy() {
  // Simulator State
  const [streamActive, setStreamActive] = useState<boolean>(false);
  const [streamProgress, setStreamProgress] = useState<number>(0);
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<number>(0);
  const [streamedText, setStreamedText] = useState<string>("");
  const [sseEvents, setSseEvents] = useState<SSEEventMessage[]>([]);
  const [activeTab, setActiveTab] = useState<"sse" | "minio" | "stripe">("sse");
  
  // Throttle metrics state
  const [tokensPerSec, setTokensPerSec] = useState<number>(0);
  const [totalTokens, setTotalTokens] = useState<number>(0);

  // MinIO Multi-tenant state
  const [activeTenant, setActiveTenant] = useState<string>("tenant_84719");
  const [bucketObjects, setBucketObjects] = useState([
    { path: "tenant_84719/src/App.tsx", size: "12.4 KB", type: "TypeScript" },
    { path: "tenant_84719/package.json", size: "1.8 KB", type: "JSON" },
    { path: "tenant_84719/dist/index.html", size: "4.5 KB", type: "HTML" },
    { path: "tenant_52104/src/main.tsx", size: "2.1 KB", type: "TypeScript" },
    { path: "tenant_52104/vite.config.ts", size: "940 B", type: "TypeScript" }
  ]);
  const [isUploadingObj, setIsUploadingObj] = useState<boolean>(false);
  const [isDbOptimized, setIsDbOptimized] = useState<boolean>(true);

  // Stripe webhook state
  const [stripeStatus, setStripeStatus] = useState<"idle" | "awaiting_checkout" | "webhook_dispatched" | "ledger_secured">("idle");
  const [webhookLog, setWebhookLog] = useState<string[]>([]);

  // Refs for auto scrolling
  const sseContainerRef = useRef<HTMLDivElement>(null);
  const codeEditorRef = useRef<HTMLPreElement>(null);

  // Auto Scroll SSE Terminal
  useEffect(() => {
    if (sseContainerRef.current) {
      sseContainerRef.current.scrollTop = sseContainerRef.current.scrollHeight;
    }
  }, [sseEvents]);

  // Handle SSE Code Stream Simulation
  const handleStartSSEStream = () => {
    if (streamActive) return;
    setStreamActive(true);
    setStreamProgress(0);
    setStreamedText("");
    setTotalTokens(0);
    setSseEvents([
      { event: "handshake", data: "Connection established. Active Client: MukulWebClient_1" },
      { event: "meta", data: "Processing blueprint workspace code using OpenAI GPT-4 API context" }
    ]);

    const template = GENERATIVE_TEMPLATES[selectedTemplateIndex];
    let lineIdx = 0;
    let charIdx = 0;
    let accumulatedText = "";
    
    const interval = setInterval(() => {
      if (lineIdx < template.codeLines.length) {
        const currentLine = template.codeLines[lineIdx];
        if (charIdx < currentLine.length) {
          const char = currentLine[charIdx];
          accumulatedText += char;
          setStreamedText(accumulatedText);
          setTotalTokens((prev) => prev + 1);
          setTokensPerSec(Math.floor(Math.random() * 40) + 120); // 120-160 token/s
          charIdx++;
        } else {
          // Push event to event visualizer log
          setSseEvents((prev) => [
            ...prev,
            { event: "code-stream", data: `Writing node token: Line ${lineIdx + 1} finalized.` }
          ]);
          accumulatedText += "\n";
          setStreamedText(accumulatedText);
          lineIdx++;
          charIdx = 0;
        }
        setStreamProgress(Math.floor((lineIdx / template.codeLines.length) * 100));
      } else {
        clearInterval(interval);
        setSseEvents((prev) => [
          ...prev,
          { event: "completed", data: "SSE Stream transmission complete. 0 packet lost. File committed to MinIO bucket." }
        ]);
        setStreamActive(false);
        setStreamProgress(100);
        setTokensPerSec(0);

        // Add file automatically into MinIO bucket simulation
        const newObjPath = `${activeTenant}/${template.fileName}`;
        if (!bucketObjects.some(obj => obj.path === newObjPath)) {
          setBucketObjects(prev => [
            ...prev,
            { path: newObjPath, size: "3.2 KB", type: "TypeScript" }
          ]);
        }
      }
    }, 15);
  };

  const deleteMinioObject = (path: string) => {
    setBucketObjects(prev => prev.filter(obj => obj.path !== path));
  };

  const simulateStripePayment = async () => {
    setStripeStatus("awaiting_checkout");
    setWebhookLog(["POST /api/payments/checkout-session initiated.", "Calling Stripe endpoint: /v1/checkout/sessions"]);
    await new Promise(r => setTimeout(r, 1200));

    setStripeStatus("webhook_dispatched");
    setWebhookLog(prev => [
      ...prev,
      "Webhook received on endpoint: /api/webhooks/stripe",
      "Verifying Stripe signature header: Stripe-Signature",
      "SUCCESS: Cryptographic validation hash passes SHA-256 validation criteria."
    ]);
    await new Promise(r => setTimeout(r, 1400));

    setStripeStatus("ledger_secured");
    setWebhookLog(prev => [
      ...prev,
      "Updating user subscription context inside PostgreSQL...",
      "JPA Transaction: SET tenant_subscription_level = PREMIUM, quota_limit = 50000",
      "Transaction committed: TX-COMMIT-LEDGER-VERIFIED.",
      "SMTP Service: Dispatched invoice receipt safely to mukul.agarwal2709@gmail.com"
    ]);
  };

  return (
    <section id="buildable-ai-case-study" className="scroll-mt-20 space-y-8">
      {/* Intro Header */}
      <div className="border-[#1c1c1c] border bg-[#060606] rounded-2xl p-6 md:p-8 hover:border-violet-500/20 transition-all duration-300 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/5 rounded-full filter blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-indigo-600/5 rounded-full filter blur-[80px] pointer-events-none" />

        <div className="flex flex-col lg:flex-row gap-8 items-start justify-between relative z-10">
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-violet-950/40 border border-violet-900/40 text-violet-400">
              <Sparkles className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
              BUILDABLE AI ARCHITECTURAL CASE STUDY
            </div>

            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-slate-100">
              Buildable AI: Multi-Tenant LLM Streaming Engine
            </h2>

            <p className="text-sm md:text-base text-slate-400 leading-relaxed">
              Mukul's centerpiece commercial asset: <strong className="text-slate-200 font-semibold">Buildable AI</strong> is an automated system that stream-writes client-side workspaces on-the-fly. Built on <strong className="text-slate-200 font-semibold">Java 21, Spring Boot</strong>, and <strong className="text-slate-200 font-semibold">OpenAI API SDKs</strong> with real-time SSE conduits.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">First Token Latency</span>
                <span className="text-lg font-display font-bold text-violet-400 block mt-0.5">1.2 seconds</span>
              </div>
              <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">MinIO Object Store</span>
                <span className="text-lg font-display font-bold text-indigo-400 block mt-0.5">S3 Object Level</span>
              </div>
              <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Streaming System</span>
                <span className="text-lg font-display font-bold text-sky-400 block mt-0.5">Spring-SSE / WebSockets</span>
              </div>
              <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Payment Verification</span>
                <span className="text-lg font-display font-bold text-slate-200 block mt-0.5">Stripe Webhooks</span>
              </div>
            </div>
          </div>

          {/* 3D-Look Card illustrating technical solutions */}
          <div className="w-full lg:w-96 flex-shrink-0">
            <div className="bg-black/95 border border-white/10 rounded-2xl p-5 hover:border-violet-500/30 transition-all duration-500 shadow-xl relative overflow-hidden [transform-style:preserve-3d] [transform:rotateX(2deg)_rotateY(2deg)] hover:[transform:rotateX(0deg)_rotateY(0deg)]">
              <div className="absolute top-0 right-0 w-1.5 h-full bg-violet-600" />
              <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-violet-400 animate-pulse" />
                Structural Integrations
              </h3>

              <ul className="space-y-3.5 mt-4 text-xs font-sans">
                <li className="space-y-0.5">
                  <span className="font-semibold text-slate-200 block">Server-Sent Events (SSE) Pipe</span>
                  <p className="text-slate-400 leading-relaxed">
                    Exposes reactive non-blocking Spring Boot controllers piping streaming text fragments from GPT-4 into stateless JSON frames in &lt; 1.2s delay limit.
                  </p>
                </li>
                <li className="space-y-0.5">
                  <span className="font-semibold text-slate-200 block">MinIO S3 Isolation Engine</span>
                  <p className="text-slate-400 leading-relaxed">
                    Encapsulates multi-tenant files isolated inside separate buckets or nested paths, enabling safe client read/write loops while enforcing secure quotas.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Selector Segment */}
      <div className="bg-[#060606] border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div className="space-y-0.5">
            <span className="text-xs font-mono text-violet-400 font-bold uppercase tracking-wider block">INTERACTIVE PROTOTYPE MODULE</span>
            <h3 className="text-xl font-display font-bold text-slate-100">Live Architecture Sandbox</h3>
          </div>

          {/* Tab buttons */}
          <div className="flex bg-stone-900/80 p-1 border border-white/5 rounded-xl font-mono text-xs select-none">
            <button
              onClick={() => setActiveTab("sse")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTab === "sse" ? "bg-violet-950/50 text-violet-400 font-bold" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              1. SSE Code Streamer
            </button>
            <button
              onClick={() => setActiveTab("minio")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTab === "minio" ? "bg-violet-950/50 text-violet-400 font-bold" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              2. MinIO Tenant Finder
            </button>
            <button
              onClick={() => setActiveTab("stripe")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTab === "stripe" ? "bg-violet-950/50 text-violet-400 font-bold" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              3. Stripe Webhook Securing
            </button>
          </div>
        </div>

        {/* Tab 1: SSE Streaming sandbox */}
        {activeTab === "sse" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Stream trigger core (7 columns) */}
            <div className="lg:col-span-7 bg-black/50 border border-white/5 rounded-xl p-5 flex flex-col justify-between space-y-4">
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-mono text-slate-200 font-bold">Select Generation Blueprint</h4>
                  <p className="text-xs text-slate-500 font-sans mt-0.5">Choose which file tree is processed by the AI compiler router.</p>
                </div>
                
                <div className="flex items-center gap-1.5 font-mono text-xs">
                  <span className="text-slate-400">Target File:</span>
                  <select 
                    value={selectedTemplateIndex}
                    onChange={(e) => setSelectedTemplateIndex(parseInt(e.target.value))}
                    disabled={streamActive}
                    className="bg-stone-900 border border-white/10 rounded px-2.5 py-1 text-slate-300 pointer-events-auto"
                  >
                    <option value={0}>Dashboard.tsx</option>
                    <option value={1}>server.ts</option>
                  </select>
                </div>
              </div>

              {/* Virtual Code screen */}
              <div className="bg-[#030303] border border-white/5 rounded-xl overflow-hidden shadow-inner h-64 flex flex-col justify-between">
                <div className="bg-[#0b0b0b] px-4 py-2 border-b border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
                    {GENERATIVE_TEMPLATES[selectedTemplateIndex].fileName}
                  </span>
                  <span className="text-slate-500 font-semibold uppercase">{streamActive ? "Streaming" : "Committed"}</span>
                </div>

                <pre className="p-4 overflow-y-auto text-xs text-slate-300 font-mono flex-grow select-text custom-stream scrollbar">
                  <code ref={codeEditorRef}>{streamedText || `// Select template above & click "Discharge Reactive SSE Stream" to generate code real-time.`}</code>
                </pre>

                {streamActive ? (
                  <div className="bg-violet-950/20 px-4 py-2 text-[10px] font-mono text-violet-400 flex justify-between border-t border-violet-900/40">
                    <span className="animate-pulse">STREAM PIPELINE ENCRYPTED - ACTIVE</span>
                    <span>Speed: {tokensPerSec} tokens/sec</span>
                  </div>
                ) : (
                  <div className="bg-stone-950 px-4 py-2 text-[10px] font-mono text-slate-500 border-t border-white/5 flex justify-between">
                    <span>STATE: STABLE</span>
                    <span>Total compiled length: {totalTokens} tokens</span>
                  </div>
                )}
              </div>

              {/* Progress and control buttons */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Stream Transmission Buffer</span>
                  <span>{streamProgress}%</span>
                </div>
                <div className="w-full bg-stone-900 h-1.5 rounded-full overflow-hidden">
                  <motion.div 
                    className="bg-violet-500 h-full rounded-full"
                    animate={{ width: `${streamProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleStartSSEStream}
                    disabled={streamActive}
                    className="flex-1 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white font-mono text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer pointer-events-auto"
                  >
                    <CloudLightning className="w-4 h-4 text-white animate-bounce" />
                    {streamActive ? "Active SSE Stream Running..." : "Discharge Reactive SSE Stream"}
                  </button>
                </div>
              </div>

            </div>

            {/* SSE Frame network tracer output (5 columns) */}
            <div className="lg:col-span-5 bg-black/70 border border-white/5 rounded-xl p-5 flex flex-col justify-between h-96">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-violet-500 animate-ping" />
                  Stateless HTTP Event Trace
                </span>
                <span className="text-[10px] text-slate-500 font-mono">text/event-stream</span>
              </div>

              {/* SSE Live raw packet feed */}
              <div ref={sseContainerRef} className="flex-grow overflow-y-auto my-3 pr-1 space-y-2 font-mono text-[10px] leading-relaxed custom-sse-view scrollbar select-text text-slate-200">
                {sseEvents.length === 0 ? (
                  <div className="text-slate-600 text-center py-20 font-sans">
                    No active connection. Click left to open the reactive stream.
                  </div>
                ) : (
                  sseEvents.map((ev, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, hover: { scale: 1.01 } }}
                      animate={{ opacity: 1 }}
                      className="border border-white/[0.03] p-2 rounded bg-stone-950 font-mono tracking-wide"
                    >
                      <span className="text-violet-400 font-bold block mb-0.5">event: {ev.event}</span>
                      <span className="text-slate-300 block bg-black/40 p-1 rounded font-normal text-[9px] truncate">data: {ev.data}</span>
                    </motion.div>
                  ))
                )}
              </div>

              <div className="bg-stone-950 p-2 border border-white/5 rounded-lg text-center font-mono text-[9px] text-slate-500">
                Pipes code real-time directly into browser memory.
              </div>

            </div>

          </div>
        )}

        {/* Tab 2: MinIO Tenant Object Store directory view */}
        {activeTab === "minio" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            
            {/* Folder layout visualization (7 columns) */}
            <div className="md:col-span-7 bg-black/40 border border-white/5 rounded-xl p-5 flex flex-col justify-between space-y-4">
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-mono text-slate-200 font-bold flex items-center gap-1.5">
                    <FolderTree className="w-4 h-4 text-violet-400" />
                    MinIO isolated S3 Buckets
                  </h4>
                  <p className="text-xs text-slate-500 font-sans mt-0.5">Visual representation of isolated folders on multi-tenant deployment architectures.</p>
                </div>

                {/* Tenant filter selector */}
                <div className="flex bg-stone-900 border border-white/10 rounded px-2 text-xs font-mono">
                  <button 
                    onClick={() => setActiveTenant("tenant_84719")}
                    className={`px-2 py-1.5 border-r border-white/5 ${activeTenant === "tenant_84719" ? "text-violet-400 font-bold" : "text-slate-400"}`}
                  >
                    Tenant 84719
                  </button>
                  <button 
                    onClick={() => setActiveTenant("tenant_52104")}
                    className={`px-2 py-1.5 ${activeTenant === "tenant_52104" ? "text-violet-400 font-bold" : "text-slate-400"}`}
                  >
                    Tenant 52104
                  </button>
                </div>
              </div>

              {/* Bucket List Items */}
              <div className="space-y-2 font-mono h-56 overflow-y-auto pr-1 scrollbar select-none">
                <AnimatePresence initial={false}>
                  {bucketObjects
                    .filter(obj => obj.path.startsWith(activeTenant))
                    .map((obj) => (
                      <motion.div
                        key={obj.path}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="bg-black/80 border border-white/[0.04] p-3 rounded-xl flex items-center justify-between text-xs hover:border-violet-500/25 transition-all"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-violet-950/40 text-violet-400 border border-violet-900/30 flex items-center justify-center">
                            <FileCode className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-200 block truncate max-w-sm">{obj.path.slice(activeTenant.length + 1)}</span>
                            <span className="text-[10px] text-slate-500 block truncate">Size: {obj.size} | Encrypted</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-[10px] bg-slate-900 border border-white/5 px-2 py-0.5 rounded text-slate-400 uppercase">{obj.type}</span>
                          <button
                            onClick={() => deleteMinioObject(obj.path)}
                            className="bg-slate-900 border border-white/5 hover:bg-rose-950 hover:border-rose-900/60 p-1.5 rounded-lg text-slate-400 hover:text-rose-400 transition-colors cursor-pointer pointer-events-auto"
                            title="Delete object"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                </AnimatePresence>
                {bucketObjects.filter(obj => obj.path.startsWith(activeTenant)).length === 0 && (
                  <div className="text-center py-12 text-slate-600 font-sans text-xs">
                    This isolated bucket directory path is currently empty.
                  </div>
                )}
              </div>

              {/* Multi-tenant database optimizations section */}
              <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                <span className="text-slate-400">JPA Fetch Graphs (Lazy Load N+1 Prevention):</span>
                <button
                  onClick={() => setIsDbOptimized(!isDbOptimized)}
                  className={`px-3 py-1.5 rounded-lg border font-semibold transition-all cursor-pointer ${
                    isDbOptimized
                      ? "bg-violet-950/40 border-violet-500/40 text-violet-400"
                      : "bg-rose-950/30 border-rose-900/40 text-rose-400"
                  }`}
                >
                  {isDbOptimized ? "Optimized Graphs (32ms query)" : "Legacy Fetches (320ms cascade)"}
                </button>
              </div>

            </div>

            {/* MinIO S3 SDK Java Code representation (5 columns) */}
            <div className="md:col-span-5 bg-black/60 border border-white/5 rounded-xl p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-1">
                <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#64748b]">MinIO S3 Java client SDK</h4>
                <p className="text-xs text-slate-400">Sovereign code used to write client directory blueprints directly as isolated S3 buckets:</p>
              </div>

              <div className="bg-[#030303] border border-white/5 rounded-xl p-4 font-mono text-xs overflow-x-auto text-slate-300">
                <code className="block leading-relaxed">
                  <span className="text-indigo-400">minioClient</span>.putObject(<br />
                  &nbsp;&nbsp;PutObjectArgs.<span className="text-blue-400">builder</span>()<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;.bucket(<span className="text-orange-400">"user-spaces"</span>)<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;.object(activeTenant + <span className="text-orange-400">"/src/App.tsx"</span>)<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;.stream(byteArrayStream, size) <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;.contentType(<span className="text-orange-400">"text/plain"</span>)<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;.build()<br />
                  );
                </code>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                By standardizing on a Java-driven MinIO abstract filesystem, we can replicate robust enterprise-grade secure AWS S3 integrations easily.
              </p>
            </div>

          </div>
        )}

        {/* Tab 3: Stripe Backchannel Verification logic */}
        {activeTab === "stripe" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Step-by-step dispatcher visualization (7 columns) */}
            <div className="lg:col-span-7 bg-black/40 border border-white/5 rounded-xl p-5 flex flex-col justify-between space-y-4">
              <div>
                <h4 className="text-sm font-mono text-slate-200 font-bold flex items-center gap-1.5">
                  Secure Billing Webhook Simulator
                </h4>
                <p className="text-xs text-slate-500 font-sans mt-0.5">Discharges Stripe plans synchronously, then processes async cryptographically encrypted IPN notifications.</p>
              </div>

              {/* Status workflow graphic */}
              <div className="grid grid-cols-3 gap-3 text-center my-4 relative z-10 font-mono text-xs text-slate-400">
                
                {/* Step 1 */}
                <div className={`p-3 rounded-xl border transition-all ${
                  stripeStatus === "awaiting_checkout"
                    ? "bg-violet-950/20 border-violet-400 text-violet-400 font-bold"
                    : "bg-stone-900/50 border-white/5"
                }`}>
                  <span className="text-[10px] text-slate-500 block uppercase mb-1">1. Billing</span>
                  <span>Wait Session</span>
                </div>

                {/* Step 2 */}
                <div className={`p-3 rounded-xl border transition-all ${
                  stripeStatus === "webhook_dispatched"
                    ? "bg-violet-950/30 border-violet-400 text-violet-400 font-bold"
                    : "bg-stone-900/50 border-white/5"
                }`}>
                  <span className="text-[10px] text-slate-500 block uppercase mb-1">2. Back-Channel</span>
                  <span>Hook verification</span>
                </div>

                {/* Step 3 */}
                <div className={`p-3 rounded-xl border transition-all ${
                  stripeStatus === "ledger_secured"
                    ? "bg-blue-950/40 border-blue-500/40 text-blue-400 font-bold"
                    : "bg-stone-900/50 border-white/5"
                }`}>
                  <span className="text-[10px] text-slate-500 block uppercase mb-1">3. Ledger Sync</span>
                  <span>Commit Premium</span>
                </div>

              </div>

              <button
                onClick={simulateStripePayment}
                disabled={stripeStatus !== "idle" && stripeStatus !== "ledger_secured"}
                className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white font-mono text-xs font-bold py-3 rounded-xl shadow-lg active:scale-95 transition-all cursor-pointer pointer-events-auto"
              >
                {stripeStatus === "awaiting_checkout" && "Awaiting Token Payment Confirm..."}
                {stripeStatus === "webhook_dispatched" && "Executing Crypto webhook verification..."}
                {stripeStatus === "ledger_secured" && "Ledger Synchronized. Run Another Test Plan"}
                {stripeStatus === "idle" && "Trigger Mock Stripe Payment Flow ($29 Plan)"}
              </button>

            </div>

            {/* Backchannel Logs parser output (5 columns) */}
            <div className="lg:col-span-5 bg-black/70 border border-white/5 rounded-xl p-5 flex flex-col justify-between h-80">
              <div className="flex items-center justify-between border-b border-white/5 pb-2 font-mono text-[11px] text-slate-300">
                <span className="font-bold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-blue-400" />
                  Stripe Endpoint Security Log
                </span>
                <span className="text-slate-500">SHA256 signature</span>
              </div>

              {/* Feed logs */}
              <div className="flex-grow overflow-y-auto my-3 space-y-2 font-mono text-[10px] text-slate-300 scrollbar select-text text-slate-200">
                {webhookLog.length === 0 ? (
                  <div className="text-slate-600 text-center py-16 font-sans">
                    Idle. Awaiting webhook payment triggers.
                  </div>
                ) : (
                  webhookLog.map((logMsg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="border-l-2 border-violet-500 pl-2 py-0.5 leading-relaxed"
                    >
                      {logMsg}
                    </motion.div>
                  ))
                )}
              </div>

              <div className="bg-stone-900/50 border border-white/5 rounded p-2 text-center text-[9px] text-slate-500 font-mono">
                Security safeguard checks Stripe HTTP headers against local server security tokens.
              </div>

            </div>

          </div>
        )}

      </div>

    </section>
  );
}
