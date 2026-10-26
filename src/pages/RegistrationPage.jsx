import React, { useState, useEffect } from 'react';
import {
  User,
  Hash,
  Mail,
  Phone,
  GraduationCap,
  Users,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import FormField from '../components/FormField';
import Crewmate from '../components/Crewmate';
import ReviewStep from './ReviewStep';
import OtpVerificationStep from './OtpVerificationStep';
import SuccessStep from './SuccessStep';
import { BRANCHES, GENDERS, RESIDENCE_TYPES } from '../utils/constants';
import { validateRegistrationForm } from '../utils/validation';
import { apiService } from '../services/apiService';

export const RegistrationPage = ({ onHome }) => {
  // Steps:
  // 1: Personal Details (Candidate / Leader + Participation Format)
  // 2: Additional Details (Teammate Details if Duo Squad)
  // 3: Review Details (Slide 2)
  // 4: Email Verification & Submit (Slide 3)
  // 5: Confirmed Pass (Slide 4 - "You're In, Crewmate")
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    registrationType: 'solo', // 'solo' | 'team'
    teamName: '',
    leader: {
      fullName: '',
      studentNumber: '',
      collegeEmail: '',
      phone: '',
      branch: '',
      gender: '',
      residence: 'Hosteller',
      isVerified: false,
    },
    teammate: {
      fullName: '',
      studentNumber: '',
      collegeEmail: '',
      phone: '',
      branch: '',
      gender: '',
      residence: 'Day Scholar',
      isVerified: false,
    },
  });

  const [formErrors, setFormErrors] = useState({});
  const [confirmedRegistration, setConfirmedRegistration] = useState(null);

  // Client-side preview for college email
  const deriveEmailPreview = (fullName, studentNumber) => {
    const cleanNum = (studentNumber || '').trim();
    const firstName = (fullName || '').trim().split(/\s+/)[0]?.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (firstName && cleanNum) {
      return `${firstName}${cleanNum}@akgec.ac.in`;
    }
    return '';
  };

  // Sync / fetch email for Leader
  useEffect(() => {
    const name = formData.leader.fullName.trim();
    const num = formData.leader.studentNumber.trim();

    if (name.length >= 2 && /^(?:24|25)\d{5,6}$/.test(num)) {
      apiService
        .generateCollegeEmail(name, num)
        .then((res) => {
          if (res?.email) {
            setFormData((prev) => ({
              ...prev,
              leader: { ...prev.leader, collegeEmail: res.email },
            }));
          }
        })
        .catch(() => {
          setFormData((prev) => ({
            ...prev,
            leader: { ...prev.leader, collegeEmail: deriveEmailPreview(name, num) },
          }));
        });
    } else {
      setFormData((prev) => ({
        ...prev,
        leader: { ...prev.leader, collegeEmail: deriveEmailPreview(name, num) },
      }));
    }
  }, [formData.leader.fullName, formData.leader.studentNumber]);

  // Sync / fetch email for Teammate
  useEffect(() => {
    if (formData.registrationType !== 'team') return;
    const name = formData.teammate.fullName.trim();
    const num = formData.teammate.studentNumber.trim();

    if (name.length >= 2 && /^(?:24|25)\d{5,6}$/.test(num)) {
      apiService
        .generateCollegeEmail(name, num)
        .then((res) => {
          if (res?.email) {
            setFormData((prev) => ({
              ...prev,
              teammate: { ...prev.teammate, collegeEmail: res.email },
            }));
          }
        })
        .catch(() => {
          setFormData((prev) => ({
            ...prev,
            teammate: { ...prev.teammate, collegeEmail: deriveEmailPreview(name, num) },
          }));
        });
    } else {
      setFormData((prev) => ({
        ...prev,
        teammate: { ...prev.teammate, collegeEmail: deriveEmailPreview(name, num) },
      }));
    }
  }, [formData.teammate.fullName, formData.teammate.studentNumber, formData.registrationType]);

  const handleLeaderChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      leader: {
        ...prev.leader,
        [field]: value,
        ...(field === 'fullName' || field === 'studentNumber' ? { isVerified: false } : {}),
      },
    }));

    if (formErrors[`leader_${field}`]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[`leader_${field}`];
        return next;
      });
    }
  };

  const handleTeammateChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      teammate: {
        ...prev.teammate,
        [field]: value,
        ...(field === 'fullName' || field === 'studentNumber' ? { isVerified: false } : {}),
      },
    }));

    if (formErrors[`teammate_${field}`]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[`teammate_${field}`];
        return next;
      });
    }
  };

  // Step 1 Validation & Proceed
  const handleProceedFromStep1 = (e) => {
    e.preventDefault();

    // Validate Leader fields
    const errors = {};
    if (!formData.leader.fullName.trim()) errors.leader_fullName = 'Full Name is required';
    if (!/^(?:24|25)\d{5,6}$/.test(formData.leader.studentNumber.trim())) {
      errors.leader_studentNumber = 'Must start with 24 or 25 (7 or 8 digits)';
    }
    if (!/^[6-9]\d{9}$/.test(formData.leader.phone.trim())) {
      errors.leader_phone = '10-digit mobile starting with 6, 7, 8, or 9';
    }
    if (!formData.leader.branch) errors.leader_branch = 'Please select Branch & Section';
    if (!formData.leader.gender) errors.leader_gender = 'Please select Gender';

    // Default team name if empty
    if (!formData.teamName.trim()) {
      formData.teamName = formData.registrationType === 'team' ? 'BugBusters Squad' : `${formData.leader.fullName.trim() || 'Solo'} Hunter`;
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    setFormErrors({});

    // If Duo Squad, move to Step 2 (Additional Details for Teammate).
    // If Solo Hunter, skip to Step 3 (Review).
    if (formData.registrationType === 'team') {
      setCurrentStep(2);
    } else {
      setCurrentStep(3);
    }
    window.scrollTo({ top: 80, behavior: 'smooth' });
  };

  // Step 2 Validation (Teammate Details) & Proceed to Review
  const handleProceedFromStep2 = (e) => {
    e.preventDefault();
    const errors = {};

    if (!formData.teammate.fullName.trim()) errors.teammate_fullName = 'Teammate Full Name is required';
    if (!/^(?:24|25)\d{5,6}$/.test(formData.teammate.studentNumber.trim())) {
      errors.teammate_studentNumber = 'Must start with 24 or 25 (7 or 8 digits)';
    }
    if (formData.teammate.studentNumber.trim() === formData.leader.studentNumber.trim()) {
      errors.teammate_studentNumber = 'Teammate roll number cannot be the same as Leader';
    }
    if (!/^[6-9]\d{9}$/.test(formData.teammate.phone.trim())) {
      errors.teammate_phone = '10-digit mobile starting with 6, 7, 8, or 9';
    }
    if (!formData.teammate.branch) errors.teammate_branch = 'Please select Branch & Section';
    if (!formData.teammate.gender) errors.teammate_gender = 'Please select Gender';
    if (!formData.teamName.trim()) errors.teamName = 'Team Name is required for Duo Squad';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    setFormErrors({});
    setCurrentStep(3); // Go to Review
    window.scrollTo({ top: 80, behavior: 'smooth' });
  };

  // Step 3 (Review) Proceed to Step 4 (Verify OTP)
  const handleProceedToVerification = () => {
    setCurrentStep(4);
    window.scrollTo({ top: 80, behavior: 'smooth' });
  };

  // Step 4 Completion (Confirmed final registration saved)
  const handleConfirmedSubmit = (registrationRecord) => {
    setConfirmedRegistration(registrationRecord);
    setCurrentStep(5); // Go to "You're In, Crewmate"
    window.scrollTo({ top: 50, behavior: 'smooth' });
  };

  // Reset form for another registration
  const handleReset = () => {
    setFormData({
      registrationType: 'solo',
      teamName: '',
      leader: {
        fullName: '',
        studentNumber: '',
        collegeEmail: '',
        phone: '',
        branch: '',
        gender: '',
        residence: 'Hosteller',
        isVerified: false,
      },
      teammate: {
        fullName: '',
        studentNumber: '',
        collegeEmail: '',
        phone: '',
        branch: '',
        gender: '',
        residence: 'Day Scholar',
        isVerified: false,
      },
    });
    setFormErrors({});
    setConfirmedRegistration(null);
    setCurrentStep(1);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Top Header Bar (Matching Slide 1) */}
      <div className="flex items-center justify-between pb-1 font-mono text-xs text-gray-700">
        <button
          onClick={onHome}
          className="flex items-center gap-1.5 hover:text-black font-bold uppercase transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>&larr; BACK TO HOME</span>
        </button>
        <span className="font-bold tracking-widest text-black uppercase">
          DeBugX 2026 • Registration Desk
        </span>
      </div>

      {/* Main Debut Banner Card (Matching Slide 1) */}
      <div className="neo-box p-6 md:p-8 bg-[#FCFAF6] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#FF2E51] tracking-wider uppercase">
            <span className="w-2.5 h-2.5 bg-[#FF2E51]" />
            <span>DEBUT CHALLENGE ACCESS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-black leading-none uppercase">
            JOIN THE HUNT
          </h1>

          <p className="text-sm font-sans font-bold text-gray-800">
            Register for DeBugX 2026 — Bug Hunting Challenge.
          </p>
          <p className="text-xs font-sans text-gray-600 leading-relaxed">
            Enter your details, choose your participation format, and get ready to test your debugging skills.
          </p>
        </div>

        <div className="flex items-center justify-center shrink-0">
          <Crewmate variant="default" size="lg" />
        </div>
      </div>

      {/* STEP 1: PERSONAL DETAILS (Matching Slide 1) */}
      {currentStep === 1 && (
        <form onSubmit={handleProceedFromStep1} className="neo-box p-6 md:p-8 bg-[#FCFAF6] space-y-8">
          {/* Stepper Header (Matching Slide 1) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 border-2 border-black p-1.5 bg-[#F6F3EB] shadow-neo-sm">
            {/* 1 PERSONAL DETAILS (Active) */}
            <div className="p-2.5 border-2 border-black bg-[#FCFAF6] flex items-center gap-2.5 shadow-neo-sm">
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

            {/* 2 ADDITIONAL DETAILS */}
            <div className="p-2.5 border-2 border-black bg-black text-white flex items-center gap-2.5">
              <div className="w-6 h-6 shrink-0 flex items-center justify-center font-mono font-bold text-xs bg-white text-black">
                2
              </div>
              <div className="leading-tight overflow-hidden">
                <div className="text-[11px] font-mono font-bold tracking-tight uppercase truncate text-white">
                  ADDITIONAL DETAILS
                </div>
                <div className="text-[9px] font-mono text-gray-300 truncate">
                  Next Step
                </div>
              </div>
            </div>

            {/* 3 REVIEW */}
            <div className="p-2.5 border-2 border-black/30 bg-[#FCFAF6] flex items-center gap-2.5">
              <div className="w-6 h-6 shrink-0 flex items-center justify-center font-mono font-bold text-xs bg-gray-200 text-black">
                3
              </div>
              <div className="leading-tight overflow-hidden">
                <div className="text-[11px] font-mono font-bold tracking-tight uppercase truncate text-black">
                  REVIEW
                </div>
                <div className="text-[9px] font-mono text-gray-500 truncate">
                  Pending
                </div>
              </div>
            </div>

            {/* 4 SUBMIT */}
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

          {/* Section 1: Member Details */}
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b-2 border-black">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#FF2E51]" />
                <h2 className="text-sm sm:text-base font-extrabold font-mono tracking-wider text-black uppercase">
                  1. MEMBER DETAILS
                </h2>
              </div>
              <span className="text-[10px] font-mono font-bold text-[#FF2E51] tracking-wider uppercase">
                * REQUIRED FIELDS
              </span>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name */}
              <FormField
                label="FULL NAME"
                name="fullName"
                icon={User}
                value={formData.leader.fullName}
                onChange={(e) => handleLeaderChange('fullName', e.target.value)}
                placeholder="e.g. Alex Vance"
                error={formErrors.leader_fullName}
                helperText="Candidate official name"
              />

              {/* Student Roll Number */}
              <FormField
                label="STUDENT ROLL NUMBER / UNIVERSITY ROLL NO."
                name="studentNumber"
                icon={Hash}
                value={formData.leader.studentNumber}
                onChange={(e) => handleLeaderChange('studentNumber', e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 2300270100045"
                error={formErrors.leader_studentNumber}
                helperText="Must start with 24 or 25 (7 or 8 digits)"
              />

              {/* Institutional College Email */}
              <FormField
                label="INSTITUTIONAL COLLEGE EMAIL"
                name="collegeEmail"
                icon={Mail}
                value={formData.leader.collegeEmail}
                readOnly
                placeholder="alex230027@akgec.ac.in"
                helperText="Official AKGEC address (firstName + studentNo + @akgec.ac.in)"
                rightBadge={
                  <span className="text-[10px] font-mono font-bold text-[#FF2E51]">
                    @akgec.ac.in
                  </span>
                }
              />

              {/* Phone / WhatsApp */}
              <FormField
                label="PHONE / WHATSAPP NUMBER"
                name="phone"
                type="tel"
                icon={Phone}
                value={formData.leader.phone}
                onChange={(e) => handleLeaderChange('phone', e.target.value.replace(/\D/g, ''))}
                placeholder="+91 98765 43210"
                error={formErrors.leader_phone}
                helperText="10-digit mobile number"
              />

              {/* Branch & Section */}
              <div className="space-y-1.5 w-full">
                <label className="block text-xs font-mono font-bold tracking-wider text-black uppercase">
                  BRANCH &amp; SECTION <span className="text-[#FF2E51]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <select
                    value={formData.leader.branch}
                    onChange={(e) => handleLeaderChange('branch', e.target.value)}
                    className={`w-full bg-white border-2 text-black text-xs sm:text-sm font-mono py-2.5 pl-9 pr-8 focus:outline-none focus:ring-0 ${
                      formErrors.leader_branch
                        ? 'border-[#FF2E51] bg-red-50/20'
                        : 'border-black focus:border-[#FF2E51]'
                    }`}
                  >
                    <option value="">Select your Branch &amp; Section</option>
                    {BRANCHES.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
                {formErrors.leader_branch && (
                  <p className="text-[11px] font-mono text-[#FF2E51] font-semibold">
                    {formErrors.leader_branch}
                  </p>
                )}
              </div>

              {/* Gender */}
              <div className="space-y-1.5 w-full">
                <label className="block text-xs font-mono font-bold tracking-wider text-black uppercase">
                  GENDER <span className="text-[#FF2E51]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <User className="w-4 h-4" />
                  </div>
                  <select
                    value={formData.leader.gender}
                    onChange={(e) => handleLeaderChange('gender', e.target.value)}
                    className={`w-full bg-white border-2 text-black text-xs sm:text-sm font-mono py-2.5 pl-9 pr-8 focus:outline-none focus:ring-0 ${
                      formErrors.leader_gender
                        ? 'border-[#FF2E51] bg-red-50/20'
                        : 'border-black focus:border-[#FF2E51]'
                    }`}
                  >
                    <option value="">Select Gender</option>
                    {GENDERS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
                {formErrors.leader_gender && (
                  <p className="text-[11px] font-mono text-[#FF2E51] font-semibold">
                    {formErrors.leader_gender}
                  </p>
                )}
              </div>
            </div>

            {/* Residence Type Radio Options (Matching Slide 1) */}
            <div className="space-y-2">
              <label className="block text-xs font-mono font-bold tracking-wider text-black uppercase">
                RESIDENCE TYPE <span className="text-[#FF2E51]">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {RESIDENCE_TYPES.map((res) => {
                  const isChecked = formData.leader.residence === res.value;
                  return (
                    <label
                      key={res.value}
                      className={`flex items-start gap-3 p-3.5 border-2 cursor-pointer transition-all ${
                        isChecked
                          ? 'border-black bg-white shadow-neo-sm ring-1 ring-black'
                          : 'border-black/30 bg-white/70 hover:border-black'
                      }`}
                    >
                      <input
                        type="radio"
                        name="leader_residence"
                        value={res.value}
                        checked={isChecked}
                        onChange={(e) => handleLeaderChange('residence', e.target.value)}
                        className="mt-0.5 text-[#FF2E51] focus:ring-[#FF2E51]"
                      />
                      <div>
                        <div className="font-mono font-bold text-xs uppercase text-black">
                          {res.label}
                        </div>
                        <div className="text-[11px] font-sans text-gray-500">
                          {res.description}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Divider Line (Tapered divider from Slide 1) */}
          <div className="relative py-2">
            <div className="h-[2px] bg-gradient-to-r from-transparent via-black to-transparent w-full" />
          </div>

          {/* Section 2: Participation Format (Matching Slide 1) */}
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 pb-1">
                <span className="w-2.5 h-2.5 bg-black" />
                <h2 className="text-sm sm:text-base font-extrabold font-mono tracking-wider text-black uppercase">
                  2. PARTICIPATION FORMAT
                </h2>
              </div>
              <p className="text-xs font-sans text-gray-600">
                Select whether you want to compete individually or team up as a collaborative 2-member squad.
              </p>
            </div>

            {/* Format Selection Cards (Exact match to Slide 1) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option 1: Solo Hunter (Left) */}
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, registrationType: 'solo' }))}
                className={`p-4 border-2 text-left transition-all relative ${
                  formData.registrationType === 'solo'
                    ? 'border-[#FF2E51] bg-white ring-1 ring-[#FF2E51] shadow-[4px_4px_0px_0px_#FF2E51]'
                    : 'border-black/30 bg-white hover:border-black'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-1.5 bg-[#FF2E51] text-white rounded-sm">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#FBBF24] text-black border border-black/40">
                    1 MEMBER
                  </span>
                </div>
                <div className="font-display font-extrabold text-sm uppercase text-black">
                  SOLO HUNTER
                </div>
                <div className="text-[11px] font-sans mt-0.5 text-gray-600">
                  Single participant code debugging challenge.
                </div>
              </button>

              {/* Option 2: Duo Squad (Right) */}
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, registrationType: 'team' }))}
                className={`p-4 border-2 text-left transition-all relative ${
                  formData.registrationType === 'team'
                    ? 'bg-black text-white border-black shadow-neo'
                    : 'border-black/30 bg-white hover:border-black text-black'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-1.5 bg-[#FF2E51] text-white rounded-sm">
                    <Users className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 border ${
                      formData.registrationType === 'team'
                        ? 'bg-[#FBBF24] text-black border-black'
                        : 'bg-gray-100 text-gray-700 border-black/30'
                    }`}
                  >
                    2 MEMBERS
                  </span>
                </div>
                <div className="font-display font-extrabold text-sm uppercase">
                  DUO SQUAD
                </div>
                <div
                  className={`text-[11px] font-sans mt-0.5 ${
                    formData.registrationType === 'team' ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  2-member collaborative strike team.
                </div>
              </button>
            </div>

            {/* Team Name Input */}
            <div className="pt-2">
              <FormField
                label={formData.registrationType === 'team' ? 'Team Name' : 'Codename / Team Name'}
                name="teamName"
                value={formData.teamName}
                onChange={(e) => setFormData((prev) => ({ ...prev, teamName: e.target.value }))}
                placeholder={
                  formData.registrationType === 'team' ? 'e.g. BugBusters' : 'e.g. SoloHunter'
                }
                error={formErrors.teamName}
                helperText="Team designation for the official event leaderboard"
              />
            </div>
          </div>

          {/* Security Banner (Matching Slide 1) */}
          <div className="p-3.5 bg-white border-2 border-black/30 shadow-neo-sm flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#FF2E51] shrink-0" />
            <div className="text-xs font-mono text-gray-700">
              <strong className="text-black uppercase">
                PROTECTED WITH CLOUDFLARE TURNSTILE &amp; AKGEC CCC GATEWAY.
              </strong>{' '}
              A one-time verification code (OTP) will be sent to your institutional email.
            </div>
          </div>

          {/* Bottom Action Buttons (Matching Slide 1) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 pt-4 border-t-2 border-black/10">
            <button
              type="button"
              onClick={onHome}
              className="neo-button bg-white text-black px-5 py-2.5 text-xs font-mono font-bold tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-gray-100 w-full sm:w-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>&larr; BACK TO HOME</span>
            </button>

            <button
              type="submit"
              className="neo-button bg-[#FF2E51] text-white px-7 py-3 text-xs sm:text-sm font-mono font-bold tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-[#e02445] w-full sm:w-auto"
            >
              <span>{formData.registrationType === 'team' ? 'CONTINUE TO ADDITIONAL DETAILS' : 'CONTINUE TO REVIEW'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* STEP 2: ADDITIONAL DETAILS (TEAMMATE DETAILS) */}
      {currentStep === 2 && (
        <form onSubmit={handleProceedFromStep2} className="neo-box p-6 md:p-8 bg-[#FCFAF6] space-y-8">
          {/* Stepper Header (Step 2 Active) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 border-2 border-black p-1.5 bg-[#F6F3EB] shadow-neo-sm">
            <div className="p-2.5 border-2 border-black/30 bg-[#FCFAF6] flex items-center gap-2.5">
              <div className="w-6 h-6 shrink-0 flex items-center justify-center font-mono font-bold text-xs bg-emerald-600 text-white">
                &check;
              </div>
              <div className="leading-tight overflow-hidden">
                <div className="text-[11px] font-mono font-bold tracking-tight uppercase truncate text-black">
                  PERSONAL DETAILS
                </div>
                <div className="text-[9px] font-mono text-gray-500 truncate">
                  Completed
                </div>
              </div>
            </div>

            <div className="p-2.5 border-2 border-black bg-black text-white flex items-center gap-2.5 shadow-neo-sm">
              <div className="w-6 h-6 shrink-0 flex items-center justify-center font-mono font-bold text-xs bg-[#FF2E51] text-white">
                2
              </div>
              <div className="leading-tight overflow-hidden">
                <div className="text-[11px] font-mono font-bold tracking-tight uppercase truncate text-white">
                  ADDITIONAL DETAILS
                </div>
                <div className="text-[9px] font-mono text-gray-300 truncate">
                  Active Step
                </div>
              </div>
            </div>

            <div className="p-2.5 border-2 border-black/30 bg-[#FCFAF6] flex items-center gap-2.5">
              <div className="w-6 h-6 shrink-0 flex items-center justify-center font-mono font-bold text-xs bg-gray-200 text-black">
                3
              </div>
              <div className="leading-tight overflow-hidden">
                <div className="text-[11px] font-mono font-bold tracking-tight uppercase truncate text-black">
                  REVIEW
                </div>
                <div className="text-[9px] font-mono text-gray-500 truncate">
                  Pending
                </div>
              </div>
            </div>

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

          {/* Section: Teammate Details */}
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b-2 border-black">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-black" />
                <h2 className="text-sm sm:text-base font-extrabold font-mono tracking-wider text-black uppercase">
                  TEAMMATE DETAILS (MEMBER 2)
                </h2>
              </div>
              <span className="text-[10px] font-mono font-bold text-[#FF2E51] tracking-wider uppercase">
                * REQUIRED FOR DUO SQUAD
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField
                label="TEAMMATE FULL NAME"
                name="teammate_fullName"
                icon={User}
                value={formData.teammate.fullName}
                onChange={(e) => handleTeammateChange('fullName', e.target.value)}
                placeholder="e.g. Aman Verma"
                error={formErrors.teammate_fullName}
                helperText="2-100 characters, letters only"
              />

              <FormField
                label="TEAMMATE STUDENT ROLL NUMBER"
                name="teammate_studentNumber"
                icon={Hash}
                value={formData.teammate.studentNumber}
                onChange={(e) =>
                  handleTeammateChange('studentNumber', e.target.value.replace(/\D/g, ''))
                }
                placeholder="e.g. 2412214"
                error={formErrors.teammate_studentNumber}
                helperText="Must start with 24 or 25 (7 or 8 digits)"
              />

              <FormField
                label="TEAMMATE COLLEGE EMAIL"
                name="teammate_collegeEmail"
                icon={Mail}
                value={formData.teammate.collegeEmail}
                readOnly
                placeholder="Automatically generated"
                rightBadge={
                  <span className="text-[10px] font-mono font-bold text-[#FF2E51]">
                    @akgec.ac.in
                  </span>
                }
              />

              <FormField
                label="TEAMMATE PHONE / WHATSAPP"
                name="teammate_phone"
                type="tel"
                icon={Phone}
                value={formData.teammate.phone}
                onChange={(e) => handleTeammateChange('phone', e.target.value.replace(/\D/g, ''))}
                placeholder="9876543211"
                error={formErrors.teammate_phone}
                helperText="10 digits starting with 6, 7, 8, or 9"
              />

              {/* Branch */}
              <div className="space-y-1.5 w-full">
                <label className="block text-xs font-mono font-bold tracking-wider text-black uppercase">
                  BRANCH &amp; SECTION <span className="text-[#FF2E51]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <select
                    value={formData.teammate.branch}
                    onChange={(e) => handleTeammateChange('branch', e.target.value)}
                    className={`w-full bg-white border-2 text-black text-xs sm:text-sm font-mono py-2.5 pl-9 pr-8 focus:outline-none focus:ring-0 ${
                      formErrors.teammate_branch
                        ? 'border-[#FF2E51] bg-red-50/20'
                        : 'border-black focus:border-[#FF2E51]'
                    }`}
                  >
                    <option value="">Select Teammate's Branch</option>
                    {BRANCHES.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
                {formErrors.teammate_branch && (
                  <p className="text-[11px] font-mono text-[#FF2E51] font-semibold">
                    {formErrors.teammate_branch}
                  </p>
                )}
              </div>

              {/* Gender */}
              <div className="space-y-1.5 w-full">
                <label className="block text-xs font-mono font-bold tracking-wider text-black uppercase">
                  GENDER <span className="text-[#FF2E51]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <User className="w-4 h-4" />
                  </div>
                  <select
                    value={formData.teammate.gender}
                    onChange={(e) => handleTeammateChange('gender', e.target.value)}
                    className={`w-full bg-white border-2 text-black text-xs sm:text-sm font-mono py-2.5 pl-9 pr-8 focus:outline-none focus:ring-0 ${
                      formErrors.teammate_gender
                        ? 'border-[#FF2E51] bg-red-50/20'
                        : 'border-black focus:border-[#FF2E51]'
                    }`}
                  >
                    <option value="">Select Gender</option>
                    {GENDERS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
                {formErrors.teammate_gender && (
                  <p className="text-[11px] font-mono text-[#FF2E51] font-semibold">
                    {formErrors.teammate_gender}
                  </p>
                )}
              </div>
            </div>

            {/* Teammate Residence */}
            <div className="space-y-2">
              <label className="block text-xs font-mono font-bold tracking-wider text-black uppercase">
                RESIDENCE TYPE <span className="text-[#FF2E51]">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {RESIDENCE_TYPES.map((res) => {
                  const isChecked = formData.teammate.residence === res.value;
                  return (
                    <label
                      key={res.value}
                      className={`flex items-start gap-3 p-3.5 border-2 cursor-pointer transition-all ${
                        isChecked
                          ? 'border-black bg-white shadow-neo-sm ring-1 ring-black'
                          : 'border-black/30 bg-white/70 hover:border-black'
                      }`}
                    >
                      <input
                        type="radio"
                        name="teammate_residence"
                        value={res.value}
                        checked={isChecked}
                        onChange={(e) => handleTeammateChange('residence', e.target.value)}
                        className="mt-0.5 text-[#FF2E51] focus:ring-[#FF2E51]"
                      />
                      <div>
                        <div className="font-mono font-bold text-xs uppercase text-black">
                          {res.label}
                        </div>
                        <div className="text-[11px] font-sans text-gray-500">
                          {res.description}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 pt-4 border-t-2 border-black/10">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="neo-button bg-white text-black px-5 py-2.5 text-xs font-mono font-bold tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-gray-100 w-full sm:w-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>&larr; BACK TO MEMBER DETAILS</span>
            </button>

            <button
              type="submit"
              className="neo-button bg-[#FF2E51] text-white px-7 py-3 text-xs sm:text-sm font-mono font-bold tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-[#e02445] w-full sm:w-auto"
            >
              <span>CONTINUE TO REVIEW</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* STEP 3: REVIEW DETAILS (Slide 2) */}
      {currentStep === 3 && (
        <ReviewStep
          formData={formData}
          onProceedToVerification={handleProceedToVerification}
          onBack={() => {
            setCurrentStep(formData.registrationType === 'team' ? 2 : 1);
            window.scrollTo({ top: 80, behavior: 'smooth' });
          }}
        />
      )}

      {/* STEP 4: EMAIL VERIFICATION (Slide 3) */}
      {currentStep === 4 && (
        <OtpVerificationStep
          formData={formData}
          onConfirmedSubmit={handleConfirmedSubmit}
          onBack={() => {
            setCurrentStep(3);
            window.scrollTo({ top: 80, behavior: 'smooth' });
          }}
        />
      )}

      {/* STEP 5: SUCCESS PASS (Slide 4 - "You're In, Crewmate") */}
      {currentStep === 5 && (
        <SuccessStep
          registration={confirmedRegistration}
          onReset={handleReset}
          onHome={onHome}
        />
      )}
    </div>
  );
};

export default RegistrationPage;
