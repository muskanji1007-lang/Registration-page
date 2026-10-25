import React from 'react';
import { Terminal, Code2 } from 'lucide-react';

export const TerminalBox = () => {
  return (
    <div className="bg-white border-2 border-black p-4 shadow-neo max-w-sm w-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b-2 border-black/10">
        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-gray-700 tracking-wider">
          <Terminal className="w-3.5 h-3.5 text-[#FF2E51]" />
          <span>// MISSION DIRECTIVE</span>
        </div>
        <Code2 className="w-4 h-4 text-gray-400" />
      </div>

      {/* Main Directive Text */}
      <div className="mb-3">
        <h4 className="text-base font-extrabold uppercase tracking-tight font-display text-black leading-none mb-1">
          FIND THE BUG.
        </h4>
        <h4 className="text-base font-extrabold uppercase tracking-tight font-display text-[#FF2E51] leading-none mb-2">
          SAVE THE CODE.
        </h4>
        <p className="text-xs text-gray-600 leading-relaxed font-sans font-medium">
          A high-velocity code auditing and glitch elimination challenge for 2nd-year developers at CCC, AKGEC.
        </p>
      </div>

      {/* Live Terminal Screen */}
      <div className="bg-[#0D1117] text-white p-3 border border-black font-mono text-[11px] space-y-1 rounded-sm shadow-inner">
        <div className="flex items-center justify-between text-gray-400 pb-1 border-b border-gray-800 text-[10px]">
          <span>// Live Terminal Check</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
        </div>
        <p className="text-gray-300">
          <span className="text-emerald-400">&gt;</span> git checkout -b fix/logic-leak
        </p>
        <p className="text-gray-300">
          <span className="text-sky-400">&gt;</span> hunting_rounds: 3 | status: <span className="text-emerald-400 font-bold">READY</span>
        </p>
      </div>
    </div>
  );
};

export default TerminalBox;
