import React, { useState } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import DebugXLogo from '../components/DebugXLogo';

export const RulesPage = ({ onRegisterClick, onHome }) => {
  // Active accordion index (0 is open by default matching Slide 5)
  const [openIndex, setOpenIndex] = useState(0);

  const rules = [
    {
      num: 1,
      title: '1. Eligibility',
      content:
        'Participation is open to 2nd and 3rd year students of AKGEC.',
    },
    {
      num: 2,
      title: '2. Challenge Format',
      content:
        'Compete individually as a Solo Hunter or in pairs as a Duo Squad. Real-time debugging of deliberately injected system bugs across diverse codebases and technologies.',
    },
    {
      num: 3,
      title: '3. Time Limit',
      content:
        '3 hours of high-stakes live bug-hunting from 4:00 PM to 7:00 PM on 30th October at CSIT 3rd Floor. Teams must complete tasks within the allocated timeframe.',
    },
    {
      num: 4,
      title: '4. Fair Play',
      content:
        'Zero tolerance for unauthorized collaboration, internet proxy bypass, or plagiarism. All terminal instances and git commits are continuously monitored.',
    },
    {
      num: 5,
      title: '5. Evaluation',
      content:
        'Scoring is calculated automatically based on bug fix accuracy, test suite passes, and submission speed. In case of a tie, the team with fewer test run attempts ranks higher.',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Main Designer Card (Exact match to Slide 5) */}
      <div className="neo-box p-6 sm:p-10 bg-[#FCFAF6] space-y-8">
        {/* Header Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-display uppercase tracking-tight text-black">
            RULES OF THE HUNT
          </h1>
          <p className="text-sm sm:text-base font-bold font-sans text-gray-800">
            Know the rules. Find the bug. Complete the mission.
          </p>
        </div>

        {/* 5 Accordion Rule Items */}
        <div className="space-y-3">
          {rules.map((rule, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={rule.num}
                className="rounded-xl border border-[#B8C8D4] bg-[#EFECE3]/70 overflow-hidden transition-all shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left transition-colors hover:bg-[#E8E4DA]"
                >
                  <span className="font-sans font-bold text-base sm:text-lg text-black">
                    {rule.title}
                  </span>
                  <span className="text-xl sm:text-2xl font-bold font-mono text-[#0284C7] ml-4 leading-none">
                    {isOpen ? '—' : '+'}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm font-sans text-gray-700 leading-relaxed border-t border-[#B8C8D4]/40">
                    {rule.content}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Retro Halftone DeBugX Logo */}
        <div className="flex justify-center pt-4">
          <DebugXLogo size="lg" />
        </div>

        {/* Action Button */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t-2 border-black/10">
          <button
            onClick={onHome}
            className="neo-button bg-white text-black px-5 py-2.5 text-xs font-mono font-bold tracking-wider uppercase hover:bg-gray-100 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>RETURN TO HOME</span>
          </button>

          <button
            onClick={onRegisterClick}
            className="neo-button bg-[#FF2E51] text-white px-7 py-3 text-xs sm:text-sm font-mono font-bold tracking-wider uppercase hover:bg-[#e02445] flex items-center gap-2"
          >
            <span>JOIN THE HUNT NOW</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RulesPage;
