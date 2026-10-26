import React, { useState } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export const FaqPage = ({ onRegisterClick, onHome }) => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'Is there any registration fee for DeBugX 2026?',
      a: 'No! DeBugX 2026 is completely free for all AKGEC students. There is zero participation fee or deposit required.',
    },
    {
      q: 'Who is eligible to participate in the challenge?',
      a: 'Only 2nd-year AKGEC students with student roll numbers starting with 24 or 25 are eligible. Registration requires entering your official AKGEC roll number.',
    },
    {
      q: 'When and where will the event take place?',
      a: 'The physical competition will take place on 27th October from 4:00 PM to 7:00 PM at the CSIT Seminar Hall, AKGEC Campus.',
    },
    {
      q: 'How does team formation work for Duo Squads?',
      a: 'A team consists of exactly 2 members: 1 Team Leader and 1 Teammate. Both members independently verify their college emails via OTP, while all confirmation tickets and notifications are dispatched directly to the Team Leader.',
    },
    {
      q: 'Why does the OTP expire in 5 minutes?',
      a: 'To guarantee strict cryptographic security and prevent brute-force attacks, 6-digit verification codes have an authoritative 5-minute lifespan and are single-use only.',
    },
    {
      q: 'What languages and tracks are included in the bug hunt?',
      a: 'The challenge tracks cover multi-language debugging in C++, Python, and JavaScript/TypeScript runtime diagnostics, code inspection, and logical error resolution.',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Main Designer Card */}
      <div className="neo-box p-6 sm:p-10 bg-[#FCFAF6] space-y-8">
        {/* Header Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-display uppercase tracking-tight text-black">
            FREQUENTLY ASKED QUESTIONS
          </h1>
          <p className="text-sm sm:text-base font-bold font-sans text-gray-800">
            Got questions? Everything you need to know about DeBugX 2026.
          </p>
        </div>

        {/* 6 Accordion FAQ Items */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className="rounded-xl border border-[#B8C8D4] bg-[#EFECE3]/70 overflow-hidden transition-all shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left transition-colors hover:bg-[#E8E4DA]"
                >
                  <span className="font-sans font-bold text-base sm:text-lg text-black">
                    {faq.q}
                  </span>
                  <span className="text-xl sm:text-2xl font-bold font-mono text-[#0284C7] ml-4 leading-none">
                    {isOpen ? '—' : '+'}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm font-sans text-gray-700 leading-relaxed border-t border-[#B8C8D4]/40">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
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
            <span>REGISTER NOW</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FaqPage;
