import React from 'react';
import { ArrowRight, ChevronDown, Target, GraduationCap, Users, ShieldAlert, Cpu } from 'lucide-react';
import Crewmate from '../components/Crewmate';

export const AboutPage = ({ onRegisterClick, onRulesClick }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      {/* CCC Banner */}
      <div className="border-2 border-black bg-white px-4 py-1.5 shadow-neo-sm inline-flex items-center gap-2">
        <span className="w-2.5 h-2.5 bg-[#FF2E51]" />
        <span className="text-xs font-mono font-bold tracking-widest uppercase text-black">
          CCC SOCIETY PRESENTS
        </span>
      </div>

      {/* Protocol Overview & Terminal Window Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Protocol Overview Card */}
        <div className="lg:col-span-7 neo-box p-6 bg-[#FCFAF6] space-y-4">
          <div className="inline-block bg-black text-white px-3 py-1 text-xs font-mono font-bold tracking-wider uppercase shadow-neo-sm">
            PROTOCOL OVERVIEW
          </div>
          <p className="text-sm font-sans font-medium text-gray-800 leading-relaxed">
            <strong className="text-black font-bold">DeBugX</strong> is a high-octane bug-hunting challenge engineered specifically for second-year students at <strong className="text-black font-bold">CCC, AKGEC</strong>.
          </p>
          <p className="text-sm font-sans font-medium text-gray-700 leading-relaxed">
            Step inside the virtual mainframe to investigate intentionally fractured codebases, identify catastrophic logical anomalies, and put your analytical runtime instincts to the ultimate trial.
          </p>

          <div className="pt-4 border-t-2 border-black/10 space-y-2 font-mono text-xs">
            <div className="flex items-center gap-2 text-gray-800">
              <span className="font-bold text-[#FF2E51]">•</span>
              <span className="font-bold">SYSTEM TARGET:</span>
              <span className="px-2 py-0.5 bg-gray-100 border border-black/20 font-bold">MEMORY &amp; LOGIC</span>
            </div>
            <div className="flex items-center gap-2 text-gray-800">
              <span className="font-bold text-[#FF2E51]">•</span>
              <span className="font-bold">LANGUAGE SUITE:</span>
              <span className="px-2 py-0.5 bg-gray-100 border border-black/20 font-bold">C++ / PYTHON / JAVA</span>
            </div>
          </div>
        </div>

        {/* code terminal.exe Card with Retro Monitor Illustration */}
        <div className="lg:col-span-5 neo-box bg-[#FCFAF6] overflow-hidden">
          {/* Window Title Bar */}
          <div className="bg-[#0D1117] text-white px-3 py-2 flex items-center justify-between border-b-2 border-black font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF2E51]" />
              <span className="text-gray-200 font-semibold tracking-wider">code terminal.exe</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-400">
              <span className="w-3 h-3 border border-gray-600 flex items-center justify-center text-[9px]">-</span>
              <span className="w-3 h-3 bg-[#FF2E51] border border-black text-black font-bold flex items-center justify-center text-[8px]">×</span>
            </div>
          </div>

          {/* Terminal Screen Content */}
          <div className="p-4 bg-[#F5F2EB]">
            <div className="flex justify-between items-center text-xs font-mono text-gray-600 mb-2">
              <span className="text-[#FF2E51] font-bold">&lt;DEBUG_LOG&gt;</span>
              <span className="text-black font-bold">&#123; &#125;</span>
            </div>

            {/* Illustration */}
            <div className="py-2 flex justify-center">
              <Crewmate variant="terminal" size="lg" />
            </div>

            <div className="pt-3 border-t border-black/10 flex items-center justify-between text-[11px] font-mono">
              <span className="text-gray-600">FIG 01 • CRITICAL ERROR DISCOVERY</span>
              <span className="text-[#FF2E51] font-bold">[VERIFIED RUNTIME]</span>
            </div>
          </div>
        </div>
      </div>

      {/* Architecture of the Contest */}
      <div className="space-y-4">
        <h3 className="text-xs font-mono font-bold tracking-widest text-black uppercase">
          ARCHITECTURE OF THE CONTEST
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Spec 01 */}
          <div className="neo-box bg-white flex flex-col justify-between">
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-black/10">
                <span className="text-xs font-mono font-bold text-[#FF2E51] tracking-wider">
                  SPEC 01 • TARGET
                </span>
                <span className="p-1 bg-black text-white">
                  <Target className="w-4 h-4" />
                </span>
              </div>
              <h4 className="text-xs font-mono font-bold uppercase text-black">THE CHALLENGE</h4>
              <p className="text-xs font-sans text-gray-700 leading-relaxed">
                Identify bugs, trace logic errors, and debug faulty code. Operators must dissect synthetic software repositories containing injected bottlenecks, race conditions, and boundary flaws under strict test constraints.
              </p>
            </div>
            <div className="p-3 bg-[#F4EFE6] border-t-2 border-black text-[10px] font-mono font-bold text-gray-800 flex items-center justify-between">
              <span>DIFFICULTY: PROGRESSIVE</span>
              <span className="text-[#FF2E51]">100% AUDIT</span>
            </div>
          </div>

          {/* Spec 02 */}
          <div className="neo-box bg-white flex flex-col justify-between">
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-black/10">
                <span className="text-xs font-mono font-bold text-[#FF2E51] tracking-wider">
                  SPEC 02 • ELIGIBILITY
                </span>
                <span className="p-1 bg-black text-white">
                  <GraduationCap className="w-4 h-4" />
                </span>
              </div>
              <h4 className="text-xs font-mono font-bold uppercase text-black">WHO CAN JOIN</h4>
              <p className="text-xs font-sans text-gray-700 leading-relaxed">
                Second-year students at CCC, AKGEC. Tailored expressly for sophomore programmers ready to transition from pure syntax memorization to professional-grade code inspection, diagnostics, and patch deployment.
              </p>
            </div>
            <div className="p-3 bg-[#F4EFE6] border-t-2 border-black text-[10px] font-mono font-bold text-gray-800 flex items-center justify-between">
              <span>TARGET BATCH: 2ND YEAR</span>
              <span className="text-black">CCC AKGEC ONLY</span>
            </div>
          </div>

          {/* Spec 03 */}
          <div className="neo-box bg-white flex flex-col justify-between">
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-black/10">
                <span className="text-xs font-mono font-bold text-[#FF2E51] tracking-wider">
                  SPEC 03 • FORMATION
                </span>
                <span className="p-1 bg-black text-white">
                  <Users className="w-4 h-4" />
                </span>
              </div>
              <h4 className="text-xs font-mono font-bold uppercase text-black">PARTICIPATION</h4>
              <p className="text-xs font-sans text-gray-700 leading-relaxed">
                Solo or team participation, according to the official event rules. Enter as an individual lone-wolf code hunter or team up with an operative peer to divide trace routines, cross-examine test outputs, and conquer tasks faster.
              </p>
            </div>
            <div className="p-3 bg-[#F4EFE6] border-t-2 border-black text-[10px] font-mono font-bold text-gray-800 flex items-center justify-between">
              <span>ROSTER: 1 OR 2 MEMBERS</span>
              <span className="text-[#FF2E51]">STRICT RULES APPLIED</span>
            </div>
          </div>
        </div>
      </div>

      {/* What's the Mission? */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xs font-mono font-bold tracking-widest text-black uppercase mb-1">
            WHAT'S THE MISSION?
          </h3>
          <p className="text-xs text-gray-600 font-sans max-w-3xl leading-relaxed">
            DeBugX does not simply measure how fast you can write syntax. It simulates deep production fire-fighting, testing your capacity to think in reverse and untangle complex logic systems.
          </p>
        </div>

        <div className="space-y-4">
          {/* Stage A */}
          <div className="neo-box p-5 bg-[#FCFAF6] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-3xl">
              <div className="inline-block bg-black text-white px-2.5 py-0.5 text-[10px] font-mono font-bold tracking-wider uppercase">
                STAGE A DEEP STATIC ANALYSIS
              </div>
              <div className="text-xs font-mono font-bold uppercase text-black">
                DEBUGGING CHALLENGE
              </div>
              <p className="text-xs font-sans text-gray-700 leading-relaxed">
                <strong className="text-black font-mono">01</strong> Hands-on code auditing across real repositories. Spot sneaky off-by-one errors, catastrophic null pointer exceptions, unhandled runtime states, memory leaks, and broken loops deliberately planted by challenge architects.
              </p>
            </div>
            <div className="shrink-0">
              <span className="border-2 border-black bg-white px-3 py-1 text-xs font-mono font-bold text-[#FF2E51] shadow-neo-sm block text-center">
                12+ FLAWED MODULES
              </span>
            </div>
          </div>

          {/* Stage B */}
          <div className="neo-box p-5 bg-[#FCFAF6] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-3xl">
              <div className="inline-block bg-black text-white px-2.5 py-0.5 text-[10px] font-mono font-bold tracking-wider uppercase">
                STAGE B HEURISTIC EVALUATION
              </div>
              <div className="text-xs font-mono font-bold uppercase text-black">
                LOGICAL THINKING
              </div>
              <p className="text-xs font-sans text-gray-700 leading-relaxed">
                <strong className="text-black font-mono">02</strong> Deconstruct cryptic algorithmic puzzles and reverse-engineer obfuscated routines. Syntax matters little if your underlying computational hypothesis is skewed; map data flows and restore proper deterministic output.
              </p>
            </div>
            <div className="shrink-0">
              <span className="border-2 border-black bg-white px-3 py-1 text-xs font-mono font-bold text-black shadow-neo-sm block text-center">
                08 CIPHERED LOGIC BLOCKS
              </span>
            </div>
          </div>

          {/* Stage C */}
          <div className="neo-box p-5 bg-[#FCFAF6] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-3xl">
              <div className="inline-block bg-[#FF2E51] text-white px-2.5 py-0.5 text-[10px] font-mono font-bold tracking-wider uppercase">
                STAGE C PRESSURE CONDENSER
              </div>
              <div className="text-xs font-mono font-bold uppercase text-black">
                TIMED ROUNDS
              </div>
              <p className="text-xs font-sans text-gray-700 leading-relaxed">
                <strong className="text-black font-mono">03</strong> High-velocity elimination sprints where speed, patch accuracy, and comprehensive test-case passing determine who ascends the CCC AKGEC leaderboard. Every penalty commit costs precious ranking points.
              </p>
            </div>
            <div className="shrink-0">
              <span className="border-2 border-black bg-white px-3 py-1 text-xs font-mono font-bold text-[#FF2E51] shadow-neo-sm block text-center">
                STRICT COUNTDOWN MATRIX
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Ready to Hunt Bottom Card */}
      <div className="neo-box-xl p-8 bg-[#FCFAF6] space-y-4">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black font-display uppercase leading-tight">
          READY TO HUNT SOME BUGS?
        </h2>
        <p className="text-sm font-sans font-medium text-gray-600">
          Put your debugging skills to the test.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
          <button
            onClick={onRegisterClick}
            className="neo-button bg-[#FF2E51] text-white px-6 py-2.5 text-xs font-mono font-bold tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-[#e02445] w-full sm:w-auto"
          >
            <span>JOIN THE HUNT</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onRulesClick}
            className="neo-button bg-white text-black px-6 py-2.5 text-xs font-mono font-bold tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-gray-100 w-full sm:w-auto"
          >
            <span>VIEW THE RULES</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
