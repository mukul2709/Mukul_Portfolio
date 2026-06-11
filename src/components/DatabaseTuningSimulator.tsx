import { useState } from "react";
import { OPTIMIZATION_SCENARIOS, OptimizationScenario } from "../data";
import { motion, AnimatePresence } from "motion/react";
import { 
  CheckCircle2, AlertTriangle, ChevronRight, Zap, Database, TrendingDown, Clock, Cpu 
} from "lucide-react";

export default function DatabaseTuningSimulator() {
  const [selectedId, setSelectedId] = useState<string>("n-plus-one");
  
  const currentScenario = OPTIMIZATION_SCENARIOS.find(s => s.id === selectedId) || OPTIMIZATION_SCENARIOS[0];

  return (
    <div className="w-full bg-[#060606] border border-white/10 rounded-2xl p-6 glow-box-blue shadow-[0_0_30px_rgba(59,130,246,0.06)]">
      
      {/* Upper header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4 mb-6">
        <div>
          <span className="text-xs font-mono font-semibold tracking-wider text-blue-400 bg-blue-950/40 px-2.5 py-1 rounded inline-block mb-2">
            PERFORMANCE & DATABASE TUNING
          </span>
          <h3 className="text-2xl font-display font-bold text-slate-100 flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-400" />
            Query Optimization Arena
          </h3>
          <p className="text-sm text-slate-400 mt-0.5">
            Compare unoptimized Hibernate abstractions directly with Mukul's low-level JVM database tunes.
          </p>
        </div>

        {/* Tab togglers */}
        <div className="flex flex-wrap gap-2">
          {OPTIMIZATION_SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => setSelectedId(scenario.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all cursor-pointer ${
                selectedId === scenario.id
                  ? "bg-blue-950/40 border-blue-500/40 text-blue-400 font-bold"
                  : "bg-stone-900 border-white/5 text-slate-400 hover:text-slate-300 hover:border-white/10"
              }`}
            >
              {scenario.title.split(" (")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Breakdown Text & Animated Comparison Chart (5 columns) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-mono text-slate-500 block uppercase tracking-wider">The Bottleneck</span>
              <p className="text-sm text-slate-300 mt-1.5 leading-relaxed bg-red-950/10 border border-red-900/20 px-3 py-2 rounded-lg text-red-100 flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                <span>{currentScenario.problem}</span>
              </p>
            </div>

            <div>
              <span className="text-xs font-mono text-slate-500 block uppercase tracking-wider">Mukul's Custom Resolution</span>
              <p className="text-sm text-slate-300 mt-1.5 leading-relaxed bg-blue-950/10 border border-blue-900/20 px-3 py-2 rounded-lg text-blue-100 flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>{currentScenario.solution}</span>
              </p>
            </div>
          </div>

          {/* Interactive Comparison bar chart */}
          <div className="bg-black border border-white/5 rounded-xl p-4 space-y-4">
            <h4 className="text-xs font-mono font-bold text-slate-400 flex items-center justify-between">
              <span>LATENCY / TRIP RATE MEASUREMENTS</span>
              <TrendingDown className="w-4 h-4 text-blue-400" />
            </h4>

            <div className="space-y-3 font-mono">
              {/* Unoptimized Bar */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-rose-400 flex items-center gap-1">
                    🚫 Default JPA/Sequential
                  </span>
                  <span className="text-rose-400 font-bold">
                    {currentScenario.unoptimizedValue} {currentScenario.id === "concurrency" ? "Leaks" : currentScenario.id === "n-plus-one" ? "Queries" : "Seconds"}
                  </span>
                </div>
                <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.8 }}
                    className="bg-gradient-to-r from-red-500 to-rose-600 h-full rounded-full"
                  />
                </div>
              </div>

              {/* Optimized Bar */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-blue-400 flex items-center gap-1">
                    ✓ Optimized Strategy
                  </span>
                  <span className="text-blue-400 font-bold">
                    {currentScenario.optimizedValue} {currentScenario.id === "concurrency" ? "Threats" : currentScenario.id === "n-plus-one" ? "Query" : "Second"}
                  </span>
                </div>
                <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentScenario.optimizedValue / currentScenario.unoptimizedValue) * 100}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full"
                    style={{ minWidth: "4%" }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-blue-950/20 border border-blue-900/30 rounded-lg p-3 text-xs text-center text-blue-300 font-mono">
              🚀 <span className="font-bold">OUTCOME:</span> {currentScenario.benefit}
            </div>
          </div>
        </div>

        {/* Code Comparer UI Card (7 columns) */}
        <div className="lg:col-span-7 flex flex-col justify-between border border-white/5 bg-black rounded-2xl overflow-hidden min-h-[400px]">
          
          <div className="flex items-center justify-between bg-[#0a0a0a] px-5 py-3 border-b border-white/5">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-400" />
              Repository SQL Optimization File
            </span>
            <span className="text-[10px] bg-stone-900 text-slate-400 px-2 py-0.5 rounded font-mono font-medium">
              Spring-JPA / Postgres
            </span>
          </div>

          <div className="flex-1 p-5 space-y-6 font-mono text-[11px] leading-relaxed overflow-x-auto">
            {/* Unoptimized Code segment */}
            <div>
              <div className="text-slate-500 font-bold text-xs uppercase mb-1.5 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                LEGACY UNOPTIMIZED CODE
              </div>
              <pre className="bg-black border border-white/5 rounded-xl p-4 overflow-x-auto whitespace-pre">
                <code>{currentScenario.codeSnippetBefore}</code>
              </pre>
            </div>

            {/* Transition direction indicator */}
            <div className="flex justify-center my-1 text-slate-600">
              <ChevronRight className="w-5 h-5 rotate-90 lg:rotate-0 text-blue-500 animate-pulse" />
            </div>

            {/* Optimized Code segment */}
            <div>
              <div className="text-blue-400 font-bold text-xs uppercase mb-1.5 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400 inline-block animate-ping" />
                MUKUL'S REFACTORED WORK
              </div>
              <pre className="bg-blue-950/5 text-slate-300 border border-blue-900/40 rounded-xl p-4 overflow-x-auto whitespace-pre shadow-sm shadow-blue-950/20">
                <code>{currentScenario.codeSnippetAfter}</code>
              </pre>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
