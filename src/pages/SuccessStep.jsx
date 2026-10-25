import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Copy, Check, Printer, ArrowRight, Trophy, ShieldCheck, Mail, MapPin, Calendar, Users } from 'lucide-react';
import CccLogo from '../components/CccLogo';

export const SuccessStep = ({
  registration,
  onReset,
  onHome,
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Fire confetti effect
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF2E51', '#000000', '#FBBF24', '#38BDF8'],
      });
    } catch (_) {}
  }, []);

  const regId = registration?.registrationId || 'REG-PENDING';
  const teamName = registration?.teamName || 'Solo Hunter';
  const regType = registration?.registrationType || 'solo';
  const leader = registration?.teamLeader || (registration?.members && registration.members[0]) || {};
  const members = registration?.members || [];

  const handleCopyId = () => {
    navigator.clipboard.writeText(regId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Message */}
      <div className="p-4 bg-emerald-50 border-2 border-emerald-500 shadow-neo text-emerald-900 font-mono text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <span className="font-extrabold text-sm block">REGISTRATION CONFIRMED!</span>
            <span className="text-[11px] text-gray-700">
              Your spot in DeBugX 2026 Bug Hunting Challenge is officially locked.
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="neo-button bg-white text-black px-3 py-1.5 text-xs font-mono font-bold flex items-center gap-1.5 hover:bg-gray-100"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>PRINT PASS</span>
          </button>
        </div>
      </div>

      {/* EVENT PASS / TICKET CARD */}
      <div id="registration-ticket" className="neo-box-xl bg-white overflow-hidden">
        {/* Ticket Top Header Bar */}
        <div className="bg-[#0D1117] text-white p-6 border-b-2 border-black flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CccLogo className="w-10 h-10" />
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-extrabold text-2xl tracking-tight font-display text-white">
                  DEBUGX
                </span>
                <span className="text-sm font-bold text-[#FF2E51] font-mono">// 2026</span>
              </div>
              <p className="text-[11px] font-mono text-gray-400">
                CLOUD COMPUTING CELL • AKGEC GHAZIABAD
              </p>
            </div>
          </div>

          <div className="flex flex-col md:items-end">
            <span className="text-[10px] font-mono font-bold uppercase text-gray-400">
              OFFICIAL REGISTRATION ID
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono font-extrabold text-lg sm:text-xl text-[#FBBF24] tracking-widest bg-black px-3 py-1 border border-gray-700">
                {regId}
              </span>
              <button
                onClick={handleCopyId}
                title="Copy Registration ID"
                className="p-1.5 bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Ticket Body */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Status & Squad Designation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-[#F6F3EB] border-2 border-black">
            <div>
              <span className="text-[10px] font-mono font-bold text-gray-500 uppercase">
                STATUS
              </span>
              <div className="text-sm font-mono font-extrabold text-emerald-700 uppercase flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                CONFIRMED (₹0 FREE)
              </div>
            </div>

            <div>
              <span className="text-[10px] font-mono font-bold text-gray-500 uppercase">
                TEAM / CODENAME
              </span>
              <div className="text-base font-bold font-display text-black truncate mt-0.5">
                {teamName}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-mono font-bold text-gray-500 uppercase">
                FORMAT
              </span>
              <div className="text-sm font-mono font-bold text-black uppercase mt-0.5">
                {regType === 'team' ? 'DUO SQUAD (2 OPERATIVES)' : 'SOLO HUNTER (1 OPERATIVE)'}
              </div>
            </div>
          </div>

          {/* Participants Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold tracking-wider text-black uppercase pb-1 border-b border-black/10">
              REGISTERED ROSTER
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Leader Card */}
              <div className="p-4 border-2 border-black bg-white shadow-neo-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#FF2E51] text-white">
                    TEAM LEADER
                  </span>
                  <span className="text-[10px] font-mono text-emerald-700 font-bold">
                    ✓ VERIFIED
                  </span>
                </div>
                <div className="text-sm font-bold font-display text-black">
                  {leader.fullName || 'Operative Leader'}
                </div>
                <div className="text-xs font-mono text-gray-600 space-y-0.5">
                  <p>Roll No: <span className="font-semibold text-black">{leader.studentNumber}</span></p>
                  <p>Branch: <span className="font-semibold text-black">{leader.branch}</span></p>
                  <p>College Email: <span className="font-semibold text-black break-all">{leader.collegeEmail}</span></p>
                </div>
              </div>

              {/* Teammate Card (if team) */}
              {regType === 'team' && members.length > 1 && (
                <div className="p-4 border-2 border-black bg-white shadow-neo-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-black text-white">
                      TEAMMATE
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700 font-bold">
                      ✓ VERIFIED
                    </span>
                  </div>
                  <div className="text-sm font-bold font-display text-black">
                    {members[1]?.fullName || 'Operative 2'}
                  </div>
                  <div className="text-xs font-mono text-gray-600 space-y-0.5">
                    <p>Roll No: <span className="font-semibold text-black">{members[1]?.studentNumber}</span></p>
                    <p>Branch: <span className="font-semibold text-black">{members[1]?.branch}</span></p>
                    <p>College Email: <span className="font-semibold text-black break-all">{members[1]?.collegeEmail}</span></p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Event Venue & Instructions */}
          <div className="p-4 bg-gray-50 border-2 border-black/20 text-xs font-mono space-y-2">
            <div className="flex flex-wrap items-center gap-4 text-gray-800">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#FF2E51]" />
                <span className="font-bold">CCC Lab, 3rd Floor, AKGEC Campus</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-[#FF2E51]" />
                <span>Confirmation dispatched to {leader.collegeEmail}</span>
              </div>
            </div>
            <p className="text-[11px] text-gray-600 pt-1 border-t border-gray-200">
              * Please bring your valid College ID Card and keep this Registration ID handy for entry on challenge day.
            </p>
          </div>
        </div>

        {/* Barcode-like visual footer */}
        <div className="bg-[#F4EFE6] px-6 py-4 border-t-2 border-black flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-gray-600">
          <div className="flex items-center gap-1 tracking-widest text-black font-extrabold select-none">
            ||||| | |||| ||| |||||| | || ||||| |||| | |||
          </div>
          <span className="text-[10px]">
            ISSUED BY CLOUD COMPUTING CELL (CCC), AKGEC • NO FEES REQUIRED
          </span>
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
        <button
          onClick={onHome}
          className="neo-button bg-white text-black px-6 py-2.5 text-xs font-mono font-bold tracking-wider uppercase hover:bg-gray-100"
        >
          RETURN TO HOME
        </button>

        <button
          onClick={onReset}
          className="neo-button bg-[#FF2E51] text-white px-6 py-2.5 text-xs font-mono font-bold tracking-wider uppercase hover:bg-[#e02445] flex items-center gap-2"
        >
          <span>REGISTER ANOTHER CANDIDATE</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default SuccessStep;
