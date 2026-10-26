import React, { useState } from 'react';
import { User, ClipboardList, Edit3, ArrowRight, ArrowLeft, RefreshCw, AlertCircle, ShieldCheck } from 'lucide-react';

export const ReviewStep = ({
  formData,
  onProceedToVerification,
  onBack,
}) => {
  const isTeam = formData.registrationType === 'team';
  const leader = formData.leader || {};
  const teammate = formData.teammate || {};

  return (
    <div className="neo-box p-6 md:p-10 bg-[#FCFAF6] space-y-8">
      {/* Page Title */}
      <div className="text-center">
        <h1 className="text-3xl sm:text-5xl font-black font-display uppercase tracking-tight text-black">
          REVIEW YOUR DETAILS
        </h1>
      </div>

      {/* 4-Step Stepper Header (Matching Slide 2 with Step 3 Active) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 border-2 border-black p-1.5 bg-[#F6F3EB] shadow-neo-sm">
        {/* Step 1 */}
        <div className="p-2.5 border-2 border-black/30 bg-[#FCFAF6] flex items-center gap-2.5">
          <div className="w-6 h-6 shrink-0 flex items-center justify-center font-mono font-bold text-xs bg-[#FF2E51] text-white">
            1
          </div>
          <div className="leading-tight overflow-hidden">
            <div className="text-[11px] font-mono font-bold tracking-tight uppercase truncate text-black">
              PERSONAL DETAILS
            </div>
            <div className="text-[9px] font-mono text-gray-500 truncate">
              Active Step
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="p-2.5 border-2 border-black/30 bg-[#FCFAF6] flex items-center gap-2.5">
          <div className="w-6 h-6 shrink-0 flex items-center justify-center font-mono font-bold text-xs bg-gray-200 text-black">
            2
          </div>
          <div className="leading-tight overflow-hidden">
            <div className="text-[11px] font-mono font-bold tracking-tight uppercase truncate text-black">
              ADDITIONAL DETAILS
            </div>
            <div className="text-[9px] font-mono text-gray-500 truncate">
              Next Step
            </div>
          </div>
        </div>

        {/* Step 3 (Active Step - Black filled background) */}
        <div className="p-2.5 border-2 border-black bg-black text-white flex items-center gap-2.5 shadow-neo-sm">
          <div className="w-6 h-6 shrink-0 flex items-center justify-center font-mono font-bold text-xs bg-white text-black">
            3
          </div>
          <div className="leading-tight overflow-hidden">
            <div className="text-[11px] font-mono font-bold tracking-tight uppercase truncate text-white">
              REVIEW
            </div>
            <div className="text-[9px] font-mono text-gray-300 truncate">
              Pending
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className="p-2.5 border-2 border-black/30 bg-[#FCFAF6] flex items-center gap-2.5">
          <div className="w-6 h-6 shrink-0 flex items-center justify-center font-mono font-bold text-xs bg-gray-200 text-black">
            4
          </div>
          <div className="leading-tight overflow-hidden">
            <div className="text-[11px] font-mono font-bold tracking-tight uppercase truncate text-black">
              SUBMIT
            </div>
            <div className="text-[9px] font-mono text-gray-500 truncate">
              Final
            </div>
          </div>
        </div>
      </div>

      {/* Two Side-by-Side Rounded Detail Cards (Exact match to Slide 2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Card: Team Leader Details */}
        <div className="rounded-2xl border-2 border-[#93C5FD] p-6 bg-white space-y-4 shadow-sm">
          {/* Card Header with Edit Button */}
          <div className="flex items-center justify-between pb-3 border-b border-[#93C5FD]/40">
            <div className="flex items-center gap-2 text-base font-bold text-black font-sans">
              <User className="w-5 h-5 text-[#0284C7]" />
              <span>Team Leader Details</span>
            </div>
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#0284C7] text-[#0284C7] hover:bg-sky-50 text-xs font-mono font-bold transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

          {/* Key-Value Details */}
          <div className="space-y-3 font-sans text-sm">
            <div className="flex justify-between items-baseline gap-2">
              <span className="text-gray-600 font-medium">Full Name</span>
              <span className="font-bold text-black text-right">{leader.fullName || '—'}</span>
            </div>

            <div className="flex justify-between items-baseline gap-2">
              <span className="text-gray-600 font-medium">Email Address</span>
              <span className="font-bold text-black text-right break-all font-mono text-xs">
                {leader.collegeEmail || '—'}
              </span>
            </div>

            <div className="flex justify-between items-baseline gap-2">
              <span className="text-gray-600 font-medium">Roll No</span>
              <span className="font-bold text-black text-right font-mono">{leader.studentNumber || '—'}</span>
            </div>

            <div className="flex justify-between items-baseline gap-2">
              <span className="text-gray-600 font-medium">Branch</span>
              <span className="font-bold text-black text-right">{leader.branch || '—'}</span>
            </div>

            <div className="flex justify-between items-baseline gap-2">
              <span className="text-gray-600 font-medium">Phone Number</span>
              <span className="font-bold text-black text-right font-mono">{leader.phone || '—'}</span>
            </div>

            <div className="flex justify-between items-baseline gap-2">
              <span className="text-gray-600 font-medium">Team Name</span>
              <span className="font-bold text-black text-right">{formData.teamName || 'Solo Hunter'}</span>
            </div>

            <div className="flex justify-between items-baseline gap-2">
              <span className="text-gray-600 font-medium">Gender</span>
              <span className="font-bold text-black text-right">{leader.gender || '—'}</span>
            </div>

            <div className="flex justify-between items-baseline gap-2">
              <span className="text-gray-600 font-medium">Team Type</span>
              <span className="font-bold text-black text-right">
                {isTeam ? 'Duo Squad (2 Members)' : 'Solo Hunter (1 Member)'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Card: Additional Details */}
        <div className="rounded-2xl border-2 border-[#93C5FD] p-6 bg-white space-y-4 shadow-sm">
          {/* Card Header */}
          <div className="flex items-center gap-2 pb-3 border-b border-[#93C5FD]/40 text-base font-bold text-black font-sans">
            <ClipboardList className="w-5 h-5 text-[#0284C7]" />
            <span>Additional details</span>
          </div>

          {/* Key-Value Details */}
          <div className="space-y-3 font-sans text-sm">
            <div className="flex justify-between items-baseline gap-2">
              <span className="text-gray-600 font-medium">Team Size</span>
              <span className="font-bold text-black text-right font-mono">{isTeam ? '2' : '1'}</span>
            </div>

            <div className="flex justify-between items-baseline gap-2">
              <span className="text-gray-600 font-medium">Member 1 Name</span>
              <span className="font-bold text-black text-right">{leader.fullName || '—'}</span>
            </div>

            <div className="flex justify-between items-baseline gap-2">
              <span className="text-gray-600 font-medium">Member 1 Branch</span>
              <span className="font-bold text-black text-right">{leader.branch || '—'}</span>
            </div>

            {isTeam && (
              <>
                <div className="flex justify-between items-baseline gap-2 pt-2 border-t border-gray-100">
                  <span className="text-gray-600 font-medium">Member 2 Name</span>
                  <span className="font-bold text-black text-right">{teammate.fullName || '—'}</span>
                </div>

                <div className="flex justify-between items-baseline gap-2">
                  <span className="text-gray-600 font-medium">Member 2 Roll No</span>
                  <span className="font-bold text-black text-right font-mono">{teammate.studentNumber || '—'}</span>
                </div>

                <div className="flex justify-between items-baseline gap-2">
                  <span className="text-gray-600 font-medium">Member 2 Branch</span>
                  <span className="font-bold text-black text-right">{teammate.branch || '—'}</span>
                </div>
              </>
            )}

            <div className="flex justify-between items-baseline gap-2 pt-2 border-t border-gray-100">
              <span className="text-gray-600 font-medium">Residence</span>
              <span className="font-bold text-black text-right">{leader.residence}</span>
            </div>

            <div className="flex justify-between items-baseline gap-2">
              <span className="text-gray-600 font-medium">Participation Fee</span>
              <span className="font-bold text-emerald-600 text-right">₹0 (100% Free)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Red Action Button (Exact match to Slide 2) */}
      <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onBack}
          className="neo-button bg-white text-black px-6 py-2.5 text-xs font-mono font-bold tracking-wider uppercase hover:bg-gray-100 flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO DETAILS</span>
        </button>

        <button
          type="button"
          onClick={onProceedToVerification}
          className="neo-button bg-[#FF2E51] text-white px-8 py-3 text-xs sm:text-sm font-mono font-bold tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-[#e02445] w-full sm:w-auto"
        >
          <span>CONTINUE TO EMAIL VERIFICATION</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ReviewStep;
