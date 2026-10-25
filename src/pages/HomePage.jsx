import React from 'react';
import { ArrowRight, ChevronDown, GraduationCap, Users, Code, MapPin, Bug } from 'lucide-react';
import TerminalBox from '../components/TerminalBox';
import Crewmate from '../components/Crewmate';

export const HomePage = ({ onRegisterClick, onRulesClick }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* CCC Society Banner */}
      <div className="border-2 border-black bg-white px-4 py-1.5 shadow-neo-sm inline-flex items-center gap-2">
        <span className="w-2.5 h-2.5 bg-[#FF2E51]" />
        <span className="text-xs font-mono font-bold tracking-widest uppercase text-black">
          CCC SOCIETY PRESENTS
        </span>
      </div>

      {/* Main Hero Card */}
      <div className="neo-box-xl p-6 md:p-10 relative overflow-hidden bg-[#FCFAF6]">
        {/* Top Graphic Header: DeBugX Title + Crewmate */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b-2 border-black/10">
          {/* Stylized DeBugX Logo Typography with Halftone Pattern */}
          <div className="relative select-none">
            <div className="flex items-baseline font-display font-extrabold text-5xl sm:text-7xl md:text-8xl tracking-tighter italic">
              {/* DeBug */}
              <div className="relative text-black">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-b from-gray-900 to-black stroke-black">
                  DeBu
                </span>
                {/* Letter 'g' with integrated red bug */}
                <span className="relative inline-block z-10 text-black">
                  g
                  <span className="absolute top-[28%] left-[22%] w-3 h-3 md:w-4 md:h-4 bg-[#FF2E51] rounded-full border border-black flex items-center justify-center">
                    <span className="w-1 h-1 bg-black rounded-full" />
                  </span>
                </span>
                {/* Dot matrix overlay simulation */}
                <div className="absolute inset-0 halftone-dots opacity-20 pointer-events-none" />
              </div>

              {/* X in Hot Magenta/Pink */}
              <div className="relative text-[#EC4899] ml-1">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-tr from-[#FF2E51] via-[#EC4899] to-[#F43F5E] drop-shadow-[2px_2px_0px_#000]">
                  X
                </span>
                <div className="absolute inset-0 halftone-dots-pink opacity-30 pointer-events-none" />
              </div>
            </div>
            {/* Sub-tag underneath */}
            <div className="text-[11px] font-mono tracking-widest text-gray-500 font-semibold uppercase mt-1">
              // CLOUD COMPUTING CELL // EDITION 2026
            </div>
          </div>

          {/* Red Crewmate Illustration with Magnifying Glass */}
          <div className="flex flex-col items-center md:items-end shrink-0">
            <Crewmate variant="magnifier" size="lg" />
          </div>
        </div>

        {/* Center Section: Headlines + Directive Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-8">
          {/* Left Block: Bold Retro Typography */}
          <div className="lg:col-span-7 space-y-3">
            {/* BUG Badge */}
            <div className="inline-block">
              <div className="border-3 border-black bg-[#FF2E51] text-white px-4 py-1 font-display font-extrabold text-3xl sm:text-4xl tracking-tight shadow-neo-sm transform -rotate-1">
                BUG
              </div>
            </div>

            {/* Main Title Words */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-black font-display leading-[0.9]">
              HUNTING
            </h1>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-black font-display leading-[0.9]">
              CHALLENGE
            </h2>

            {/* Year Block */}
            <div className="pt-2">
              <div className="inline-block bg-[#0D1117] border-2 border-black px-4 py-1.5 shadow-[4px_4px_0px_#FF2E51]">
                <span className="text-3xl sm:text-4xl font-extrabold font-mono text-[#FBBF24] tracking-wider">
                  2026
                </span>
              </div>
            </div>

            {/* Free Registration Callout */}
            <div className="pt-2">
              <span className="text-xs font-mono font-bold px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-black shadow-neo-sm inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                100% FREE ENTRY // EXCLUSIVELY FOR 2ND-YEAR AKGEC STUDENTS
              </span>
            </div>
          </div>

          {/* Right Block: Directive Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <TerminalBox />
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-wrap items-center gap-4 pt-6 border-t-2 border-black/10">
          <button
            onClick={onRegisterClick}
            className="neo-button bg-[#FF2E51] text-white px-6 py-3 text-sm sm:text-base font-mono font-bold tracking-wider uppercase flex items-center gap-2 hover:bg-[#e02445]"
          >
            <span>JOIN THE HUNT</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={onRulesClick}
            className="neo-button bg-white text-black px-6 py-3 text-sm sm:text-base font-mono font-bold tracking-wider uppercase flex items-center gap-2 hover:bg-gray-100"
          >
            <span>RULES & PROTOCOL</span>
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 4 Bottom Metric / Specification Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Eligibility */}
        <div className="neo-box p-4 bg-white hover:-translate-y-1 transition-transform">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-gray-600 mb-1">
            <span>[ ELIGIBILITY ]</span>
            <GraduationCap className="w-4 h-4 text-[#FF2E51]" />
          </div>
          <div className="font-extrabold text-sm sm:text-base text-black font-display">
            2nd-Year Students
          </div>
          <div className="text-xs text-gray-500 font-mono">AKGEC Campus Only</div>
        </div>

        {/* Card 2: Team Format */}
        <div className="neo-box p-4 bg-white hover:-translate-y-1 transition-transform">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-gray-600 mb-1">
            <span>[ TEAM FORMAT ]</span>
            <Users className="w-4 h-4 text-[#FF2E51]" />
          </div>
          <div className="font-extrabold text-sm sm:text-base text-black font-display">
            Solo or Duos
          </div>
          <div className="text-xs text-gray-500 font-mono">Squad Battles</div>
        </div>

        {/* Card 3: Track */}
        <div className="neo-box p-4 bg-white hover:-translate-y-1 transition-transform">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-gray-600 mb-1">
            <span>[ TRACK ]</span>
            <Code className="w-4 h-4 text-[#FF2E51]" />
          </div>
          <div className="font-extrabold text-sm sm:text-base text-black font-display">
            C++ / Python / JS
          </div>
          <div className="text-xs text-gray-500 font-mono">Multi-Language Bugs</div>
        </div>

        {/* Card 4: Venue */}
        <div className="neo-box p-4 bg-white hover:-translate-y-1 transition-transform">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-gray-600 mb-1">
            <span>[ VENUE ]</span>
            <MapPin className="w-4 h-4 text-[#FF2E51]" />
          </div>
          <div className="font-extrabold text-sm sm:text-base text-black font-display">
            CCC Lab
          </div>
          <div className="text-xs text-gray-500 font-mono">3rd Floor</div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
