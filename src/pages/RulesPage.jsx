import React from 'react';
import { Shield, CheckCircle2, AlertTriangle, ArrowRight, ArrowLeft } from 'lucide-react';

export const RulesPage = ({ onRegisterClick, onHome }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="neo-box p-6 md:p-8 bg-[#FCFAF6] space-y-3">
        <div className="inline-block bg-[#FF2E51] text-white px-3 py-0.5 text-xs font-mono font-bold tracking-wider uppercase">
          EVENT PROTOCOL // 2026
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display uppercase tracking-tight text-black">
          RULES &amp; COMPETITION PROTOCOL
        </h1>
        <p className="text-xs font-mono text-gray-600">
          Official DeBugX 2026 guidelines established by Cloud Computing Cell (CCC), AKGEC.
        </p>
      </div>

      {/* Rules Grid */}
      <div className="space-y-4">
        {/* Rule 1 */}
        <div className="neo-box p-5 bg-white space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 bg-black text-white font-mono font-bold text-xs flex items-center justify-center">
              01
            </span>
            <h3 className="font-display font-extrabold text-sm uppercase text-black">
              STRICT ELIGIBILITY &amp; ZERO PARTICIPATION FEE
            </h3>
          </div>
          <p className="text-xs font-sans text-gray-700 leading-relaxed pl-8">
            DeBugX is an entirely <strong>free</strong> technical challenge strictly for 2nd-year AKGEC students. No registration fee is required. All candidates must have a valid student roll number beginning with <strong>24 or 25</strong>.
          </p>
        </div>

        {/* Rule 2 */}
        <div className="neo-box p-5 bg-white space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 bg-[#FF2E51] text-white font-mono font-bold text-xs flex items-center justify-center">
              02
            </span>
            <h3 className="font-display font-extrabold text-sm uppercase text-black">
              ROSTER FORMAT: SOLO OR DUO SQUAD
            </h3>
          </div>
          <p className="text-xs font-sans text-gray-700 leading-relaxed pl-8">
            Participants may register as a <strong>Solo Hunter</strong> (1 member, self-leader) or a <strong>Duo Squad</strong> (strictly 2 members: 1 Team Leader + 1 Teammate). Individual members cannot register under multiple teams.
          </p>
        </div>

        {/* Rule 3 */}
        <div className="neo-box p-5 bg-white space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 bg-black text-white font-mono font-bold text-xs flex items-center justify-center">
              03
            </span>
            <h3 className="font-display font-extrabold text-sm uppercase text-black">
              INDEPENDENT OTP VERIFICATION
            </h3>
          </div>
          <p className="text-xs font-sans text-gray-700 leading-relaxed pl-8">
            Every candidate must independently verify their official institutional AKGEC email (<code className="bg-gray-100 px-1 border border-black/20">firstName + studentNumber + @akgec.ac.in</code>) via a 6-digit cryptographic OTP.
          </p>
        </div>

        {/* Rule 4 */}
        <div className="neo-box p-5 bg-white space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 bg-black text-white font-mono font-bold text-xs flex items-center justify-center">
              04
            </span>
            <h3 className="font-display font-extrabold text-sm uppercase text-black">
              LEADER RECEIPT &amp; CORRESPONDENCE
            </h3>
          </div>
          <p className="text-xs font-sans text-gray-700 leading-relaxed pl-8">
            All transactional emails, room assignments, and leaderboard notifications will be sent <strong>exclusively to the Team Leader</strong>. Teammates must stay coordinated with their Leader.
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t-2 border-black/10">
        <button
          onClick={onHome}
          className="neo-button bg-white text-black px-5 py-2.5 text-xs font-mono font-bold tracking-wider uppercase hover:bg-gray-100 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>RETURN TO HOME</span>
        </button>

        <button
          onClick={onRegisterClick}
          className="neo-button bg-[#FF2E51] text-white px-6 py-2.5 text-xs font-mono font-bold tracking-wider uppercase hover:bg-[#e02445] flex items-center gap-2"
        >
          <span>JOIN THE HUNT NOW</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default RulesPage;
