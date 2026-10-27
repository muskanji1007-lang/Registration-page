import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Copy, Check, Printer, ArrowRight, Trophy, ShieldCheck, Mail, MapPin, Calendar, Clock, Users } from 'lucide-react';
import CccLogo from '../components/CccLogo';
import Crewmate from '../components/Crewmate';

export const SuccessStep = ({
  registration,
  onReset,
  onHome,
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Fire celebratory confetti effect
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#FF2E51', '#000000', '#FBBF24', '#38BDF8'],
      });
    } catch (_) {}
  }, []);

  const regId = registration?.registrationId || 'REG-' + Math.floor(100000 + Math.random() * 900000);
  const teamName = registration?.teamName || 'Solo Hunter';
  const regType = registration?.registrationType || 'solo';
  const leader = registration?.teamLeader || (registration?.members && registration.members[0]) || {};

  const handleCopyId = () => {
    navigator.clipboard.writeText(regId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Main Designer Card */}
      <div className="neo-box p-8 md:p-12 bg-[#FCFAF6] text-center space-y-8">
        {/* Thumbs-Up Crewmate with Bug Pet */}
        <div className="flex justify-center pt-2">
          <Crewmate variant="celebrate" size="xl" />
        </div>

        {/* Big Heading */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-black">
            You&apos;re In, Crewmate
          </h1>
          <p className="text-xs sm:text-sm font-mono text-gray-600">
            Registration confirmed for <strong className="text-black font-bold uppercase">{teamName}</strong> • Zero Participation Fee
          </p>
        </div>

        {/* Event Details Card (Exact match to Slide 4) */}
        <div className="max-w-xl mx-auto rounded-xl overflow-hidden border-2 border-black bg-[#6B7C8C]/80 shadow-neo-sm">
          {/* Dark Navy Header */}
          <div className="bg-[#1C2C3D] px-5 py-3 text-left flex items-center justify-between text-white font-mono text-xs font-bold tracking-wider uppercase">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#38BDF8]" />
              <span>Event Details</span>
            </div>
            <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
              CONFIRMED
            </span>
          </div>

          {/* 3 Pills Row */}
          <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Date Pill */}
            <div className="bg-[#102235] text-white p-3.5 rounded-lg flex flex-col items-center justify-center border border-white/10 shadow-inner">
              <Calendar className="w-5 h-5 text-[#38BDF8] mb-1" />
              <span className="text-xs sm:text-sm font-mono font-bold tracking-wide">
                30 Oct
              </span>
            </div>

            {/* Venue Pill */}
            <div className="bg-[#102235] text-white p-3.5 rounded-lg flex flex-col items-center justify-center border border-white/10 shadow-inner text-center">
              <MapPin className="w-5 h-5 text-[#38BDF8] mb-1" />
              <span className="text-xs sm:text-sm font-mono font-bold tracking-wide leading-tight">
                CSIT 3rd Floor
              </span>
            </div>

            {/* Time Pill */}
            <div className="bg-[#102235] text-white p-3.5 rounded-lg flex flex-col items-center justify-center border border-white/10 shadow-inner">
              <Clock className="w-5 h-5 text-[#38BDF8] mb-1" />
              <span className="text-xs sm:text-sm font-mono font-bold tracking-wide">
                4:00 - 7:00 PM
              </span>
            </div>
          </div>
        </div>

        {/* Pass ID Pill */}
        <div className="inline-flex items-center gap-3 bg-white border-2 border-black px-4 py-2 shadow-neo-sm font-mono text-xs">
          <span className="text-gray-500 uppercase">Registration ID:</span>
          <span className="font-extrabold text-[#FF2E51] text-sm tracking-wider">{regId}</span>
          <button
            onClick={handleCopyId}
            title="Copy ID"
            className="p-1 hover:bg-gray-100 rounded text-gray-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Red CTA Button (Exact match to Slide 4) */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={onHome}
            className="neo-button bg-[#FF2E51] text-white px-8 py-3 text-xs sm:text-sm font-mono font-extrabold tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-[#e02445] w-full sm:w-auto"
          >
            <span>CONTINUE TO HOMEPAGE</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onReset}
            className="neo-button bg-white text-black px-6 py-3 text-xs font-mono font-bold tracking-wider uppercase hover:bg-gray-100 w-full sm:w-auto"
          >
            REGISTER ANOTHER TEAM
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessStep;
