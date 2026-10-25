import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, ArrowRight, ArrowLeft } from 'lucide-react';

export const FaqPage = ({ onRegisterClick, onHome }) => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'Is there any registration fee for DeBugX 2026?',
      a: 'No! DeBugX 2026 is completely free for all 2nd-year AKGEC students. There is zero participation fee.',
    },
    {
      q: 'Who is eligible to participate?',
      a: 'Only 2nd-year AKGEC students whose student roll number begins with 24 or 25 are eligible to participate. Other batch numbers are automatically rejected.',
    },
    {
      q: 'How does team formation work?',
      a: 'You can compete as a Solo Hunter (1 member) or a Duo Squad (2 members). For Duo squads, Member 1 is the Team Leader and Member 2 is the Teammate. Both members must independently verify their institutional AKGEC emails.',
    },
    {
      q: 'Why does the OTP expire?',
      a: 'For security reasons, cryptographic 6-digit OTP codes expire strictly after 5 minutes and are single-use. If your code expires, solve a fresh Turnstile CAPTCHA and click Resend OTP.',
    },
    {
      q: 'Where will the event take place?',
      a: 'The physical challenge will be held at the CCC Lab, 3rd Floor, AKGEC Campus. Timings will be dispatched to the Team Leader via email.',
    },
    {
      q: 'What languages will the buggy codebases be in?',
      a: 'The challenge tracks cover C++, Python, and JavaScript/Node.js multi-language code inspection, logical puzzles, and runtime diagnostics.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="neo-box p-6 md:p-8 bg-[#FCFAF6] space-y-3">
        <div className="inline-block bg-black text-white px-3 py-0.5 text-xs font-mono font-bold tracking-wider uppercase">
          FAQ // INTEL
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display uppercase tracking-tight text-black">
          FREQUENTLY ASKED QUESTIONS
        </h1>
        <p className="text-xs font-mono text-gray-600">
          Got questions about DeBugX 2026? Find quick answers below.
        </p>
      </div>

      {/* Accordions */}
      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className="neo-box bg-white overflow-hidden transition-all">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                className="w-full p-4 text-left flex items-center justify-between gap-4 font-mono font-bold text-xs sm:text-sm text-black hover:bg-gray-50"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-[#FF2E51] font-bold">Q{idx + 1}.</span>
                  <span>{faq.q}</span>
                </div>
                {isOpen ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 border-t border-black/10 text-xs font-sans text-gray-700 leading-relaxed bg-[#FCFAF6]">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer CTA */}
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
          <span>REGISTER NOW</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default FaqPage;
