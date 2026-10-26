import React, { useState } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export const FaqPage = ({ onRegisterClick, onHome }) => {
  // Active accordion index (0 is open by default matching Slide)
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'Who can participate?',
      a: 'Eligibility will follow the official event announcement. Confirm the 2nd year eligibility criteria with the organisers. Valid student roll numbers starting with 24 or 25 are required.',
    },
    {
      q: 'Is participation individual or team-based?',
      a: 'You can compete individually as a Solo Hunter (1 member) or team up as a collaborative Duo Squad (2 members). For Duo squads, both members must independently verify their institutional AKGEC email.',
    },
    {
      q: 'What should I bring?',
      a: 'Please bring your valid AKGEC Student ID Card, your registration pass / ID, and your laptop with chargers. Make sure you have standard development runtimes (Node.js, Python, or C/C++) ready.',
    },
    {
      q: 'When and where will the event take place?',
      a: 'The physical competition will take place on 30th October from 4:00 PM to 7:00 PM at the CSIT Seminar Hall, AKGEC Campus.',
    },
    {
      q: 'Still have questions?',
      a: 'Reach out directly to the Cloud Computing Cell (CCC) student coordinators or visit the CCC Lab on the 3rd Floor for any queries.',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Main Designer Card (Exact match to Slide) */}
      <div className="neo-box p-6 sm:p-10 bg-[#FCFAF6] space-y-8">
        {/* Header Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-display uppercase tracking-tight text-black">
            FREQUENTLY ASKED QUESTIONS
          </h1>
          <p className="text-sm sm:text-base font-bold font-sans text-gray-800">
            Everything you should know before joining hunt
          </p>
        </div>

        {/* 5 Accordion Items (Exact match to Slide) */}
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

        {/* Retro Halftone DeBugX Logo (Exact match to Slide) */}
        <div className="flex justify-center pt-4">
          <svg
            viewBox="0 0 360 80"
            className="w-full max-w-[340px] drop-shadow-sm select-none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Halftone Dot Pattern */}
              <pattern
                id="faq-dot-grid"
                x="0"
                y="0"
                width="6"
                height="6"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="3" cy="3" r="1.6" fill="#1E293B" />
              </pattern>
              {/* Pink Halftone Dot Pattern for X */}
              <pattern
                id="faq-pink-dot-grid"
                x="0"
                y="0"
                width="6"
                height="6"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="3" cy="3" r="1.6" fill="#FF2E51" />
              </pattern>
            </defs>

            {/* Stylized Slanted Retro Text "DeBug" */}
            <text
              x="20"
              y="60"
              fontFamily="monospace, sans-serif"
              fontSize="52"
              fontWeight="900"
              fontStyle="italic"
              fill="url(#faq-dot-grid)"
              stroke="#000"
              strokeWidth="2.5"
              letterSpacing="2"
            >
              DeBug
            </text>

            {/* Stylized Pink X */}
            <text
              x="250"
              y="60"
              fontFamily="monospace, sans-serif"
              fontSize="56"
              fontWeight="900"
              fontStyle="italic"
              fill="url(#faq-pink-dot-grid)"
              stroke="#000"
              strokeWidth="2.5"
            >
              X
            </text>
          </svg>
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
            <span>JOIN THE HUNT NOW</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FaqPage;
