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
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import FormField from '../components/FormField';
import Crewmate from '../components/Crewmate';
import OtpVerificationStep from './OtpVerificationStep';
import ReviewStep from './ReviewStep';
import SuccessStep from './SuccessStep';
import { BRANCHES, GENDERS, RESIDENCE_TYPES } from '../utils/constants';
import { validateRegistrationForm } from '../utils/validation';
import { apiService } from '../services/apiService';

export const RegistrationPage = ({ onHome }) => {
  // Current registration step: 1 (Details), 2 (OTP Verification), 3 (Review), 4 (Success)
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

  // Client-side helper to preview derived email before server call
  const deriveEmailPreview = (fullName, studentNumber) => {
    const cleanNum = (studentNumber || '').trim();
    const firstName = (fullName || '').trim().split(/\s+/)[0]?.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (firstName && cleanNum) {
      return `${firstName}${cleanNum}@akgec.ac.in`;
    }
    return '';
  };

  // Sync / fetch canonical email for Leader when fullName or studentNumber changes
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
          // Fallback to local formula
          setFormData((prev) => ({
            ...prev,
            leader: { ...prev.leader, collegeEmail: deriveEmailPreview(name, num) },
          }));
        });
    } else {
      const preview = deriveEmailPreview(name, num);
      setFormData((prev) => ({
        ...prev,
        leader: { ...prev.leader, collegeEmail: preview },
      }));
    }
  }, [formData.leader.fullName, formData.leader.studentNumber]);

  // Sync / fetch canonical email for Teammate
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
      const preview = deriveEmailPreview(name, num);
      setFormData((prev) => ({
        ...prev,
        teammate: { ...prev.teammate, collegeEmail: preview },
      }));
    }
  }, [formData.teammate.fullName, formData.teammate.studentNumber, formData.registrationType]);

  // Update Leader fields
  const handleLeaderChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      leader: {
        ...prev.leader,
        [field]: value,
        // If email-affecting fields changed, reset verified state
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

  // Update Teammate fields
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
  const handleContinueToVerification = (e) => {
    e.preventDefault();
    const errors = validateRegistrationForm(formData);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      // Scroll to top of error
      window.scrollTo({ top: 180, behavior: 'smooth' });
      return;
    }

    setFormErrors({});
    setCurrentStep(2);
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  // Step 2 Completion
  const handleVerificationComplete = ({ leaderVerified, teammateVerified }) => {
    setFormData((prev) => ({
      ...prev,
      leader: { ...prev.leader, isVerified: leaderVerified },
      teammate: { ...prev.teammate, isVerified: teammateVerified },
    }));
    setCurrentStep(3);
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  // Step 3 Completion (Confirmed final registration saved)
  const handleConfirmedSubmit = (registrationRecord) => {
    setConfirmedRegistration(registrationRecord);
    setCurrentStep(4);
    window.scrollTo({ top: 50, behavior: 'smooth' });
  };

  // Reset form for new registration
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

  // Stepper definition
  const steps = [
    { num: 1, title: 'PERSONAL DETAILS', sub: currentStep === 1 ? 'Active Step' : 'Candidate Info' },
    { num: 2, title: 'EMAIL VERIFICATION', sub: currentStep === 2 ? 'Active Step' : 'OTP & CAPTCHA' },
    { num: 3, title: 'REVIEW', sub: currentStep === 3 ? 'Active Step' : 'Pre-flight Audit' },
    { num: 4, title: 'SUBMIT', sub: currentStep === 4 ? 'Active Step' : 'Confirmed Pass' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between pb-1 font-mono text-xs text-gray-700">
        <button
          onClick={onHome}
          className="flex items-center gap-1.5 hover:text-black font-bold uppercase transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>&lt;- BACK TO HOME</span>
        </button>
        <span className="font-bold tracking-widest text-black">
          DEBUGX 2026 // REGISTRATION DESK
        </span>
      </div>

      {/* Main Debut Banner Card */}
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

      {/* 4-Step Stepper Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 border-2 border-black p-1.5 bg-[#F6F3EB] shadow-neo-sm">
        {steps.map((step) => {
          const isActive = currentStep === step.num;
          const isDone = currentStep > step.num;

          return (
            <div
              key={step.num}
              className={`p-2.5 border-2 transition-all flex items-center gap-2.5 ${
                isActive
                  ? 'bg-black text-white border-black shadow-neo-sm'
                  : isDone
                  ? 'bg-emerald-50 text-black border-black/40'
                  : 'bg-[#FCFAF6] text-gray-700 border-black/20'
              }`}
            >
              <div
                className={`w-6 h-6 shrink-0 flex items-center justify-center font-mono font-bold text-xs ${
                  isActive
                    ? 'bg-[#FF2E51] text-white'
                    : isDone
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {isDone ? '✓' : step.num}
              </div>
              <div className="leading-tight overflow-hidden">
                <div className="text-[11px] font-mono font-bold tracking-tight truncate uppercase">
                  {step.title}
                </div>
                <div
                  className={`text-[9px] font-mono truncate ${
                    isActive ? 'text-gray-300' : 'text-gray-500'
                  }`}
                >
                  {step.sub}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* STEP 1: PARTICIPANT DETAILS & FORMAT */}
      {currentStep === 1 && (
        <form onSubmit={handleContinueToVerification} className="neo-box p-6 md:p-8 bg-[#FCFAF6] space-y-8">
          {/* Section 1: Candidate Details */}
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b-2 border-black">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#FF2E51]" />
                <h2 className="text-sm sm:text-base font-extrabold font-mono tracking-wider text-black uppercase">
                  1. CANDIDATE DETAILS {formData.registrationType === 'team' && '(TEAM LEADER)'}
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
                label="Full Name"
                name="fullName"
                icon={User}
                value={formData.leader.fullName}
                onChange={(e) => handleLeaderChange('fullName', e.target.value)}
                placeholder="e.g. Siddharth Rajput"
                error={formErrors.leader_fullName}
                helperText="2-100 characters, letters only"
              />

              {/* Student Number */}
              <FormField
                label="Student Roll Number / University Roll No."
                name="studentNumber"
                icon={Hash}
                value={formData.leader.studentNumber}
                onChange={(e) => handleLeaderChange('studentNumber', e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 2512213"
                error={formErrors.leader_studentNumber}
                helperText="Must start with 24 or 25 (7 or 8 digits)"
              />

              {/* Institutional College Email Preview */}
              <FormField
                label="Institutional College Email"
                name="collegeEmail"
                icon={Mail}
                value={formData.leader.collegeEmail}
                readOnly
                placeholder="Automatically generated from Name + Student No."
                helperText="Authoritative AKGEC formula: firstName + studentNumber + @akgec.ac.in"
                rightBadge={
                  <span className="text-[10px] font-mono font-bold text-[#FF2E51]">
                    @akgec.ac.in
                  </span>
                }
              />

              {/* Phone / WhatsApp */}
              <FormField
                label="Phone / WhatsApp Number"
                name="phone"
                type="tel"
                icon={Phone}
                value={formData.leader.phone}
                onChange={(e) => handleLeaderChange('phone', e.target.value.replace(/\D/g, ''))}
                placeholder="9876543210"
                error={formErrors.leader_phone}
                helperText="10 digits starting with 6, 7, 8, or 9"
              />

              {/* Branch */}
              <div className="space-y-1.5 w-full">
                <label className="block text-xs font-mono font-bold tracking-wider text-black uppercase">
                  Branch &amp; Section <span className="text-[#FF2E51]">*</span>
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
                  Gender <span className="text-[#FF2E51]">*</span>
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

            {/* Residence Type Radio Options */}
            <div className="space-y-2">
              <label className="block text-xs font-mono font-bold tracking-wider text-black uppercase">
                Residence Type <span className="text-[#FF2E51]">*</span>
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

          {/* Section 2: Participation Format */}
          <div className="space-y-5 pt-4 border-t-2 border-black/10">
            <div>
              <div className="flex items-center gap-2 pb-1">
                <span className="w-2.5 h-2.5 bg-[#FF2E51]" />
                <h2 className="text-sm sm:text-base font-extrabold font-mono tracking-wider text-black uppercase">
                  2. PARTICIPATION FORMAT
                </h2>
              </div>
              <p className="text-xs font-sans text-gray-600">
                Select whether you want to compete individually or team up as a collaborative 2-member squad.
              </p>
            </div>

            {/* Format Selection Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option A: Solo Hunter */}
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, registrationType: 'solo' }))}
                className={`p-4 border-2 text-left transition-all relative ${
                  formData.registrationType === 'solo'
                    ? 'bg-black text-white border-black shadow-neo'
                    : 'bg-white text-black border-black/40 hover:border-black'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-1.5 bg-[#FF2E51] text-white">
                    <User className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 border ${
                      formData.registrationType === 'solo'
                        ? 'bg-[#FBBF24] text-black border-black'
                        : 'bg-gray-100 text-gray-700 border-black/30'
                    }`}
                  >
                    1 MEMBER
                  </span>
                </div>
                <div className="font-display font-extrabold text-sm uppercase">
                  SOLO HUNTER
                </div>
                <div
                  className={`text-[11px] font-sans mt-0.5 ${
                    formData.registrationType === 'solo' ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  Single participant code debugging challenge.
                </div>
              </button>

              {/* Option B: Duo Squad */}
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, registrationType: 'team' }))}
                className={`p-4 border-2 text-left transition-all relative ${
                  formData.registrationType === 'team'
                    ? 'bg-black text-white border-black shadow-neo'
                    : 'bg-white text-black border-black/40 hover:border-black'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-1.5 bg-[#FF2E51] text-white">
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

            {/* Team Name (Required for both Solo and Team) */}
            <div className="pt-2">
              <FormField
                label={formData.registrationType === 'team' ? 'Team Name' : 'Codename / Team Name'}
                name="teamName"
                value={formData.teamName}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, teamName: e.target.value }));
                  if (formErrors.teamName) {
                    setFormErrors((prev) => {
                      const next = { ...prev };
                      delete next.teamName;
                      return next;
                    });
                  }
                }}
                placeholder={
                  formData.registrationType === 'team' ? 'e.g. BugBusters' : 'e.g. SoloHunters'
                }
                error={formErrors.teamName}
                helperText="Unique name to identify you on the live scoreboard (2-50 characters)"
              />
            </div>
          </div>

          {/* Section 3: Teammate Details (Only if Duo Squad) */}
          {formData.registrationType === 'team' && (
            <div className="space-y-6 pt-4 border-t-2 border-black/10">
              <div className="flex items-center justify-between pb-3 border-b-2 border-black">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-black" />
                  <h2 className="text-sm sm:text-base font-extrabold font-mono tracking-wider text-black uppercase">
                    3. TEAMMATE DETAILS (OPERATIVE 2)
                  </h2>
                </div>
                <span className="text-[10px] font-mono font-bold text-[#FF2E51] tracking-wider uppercase">
                  * STRICT 2-MEMBER ROSTER
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Teammate Full Name */}
                <FormField
                  label="Teammate Full Name"
                  name="teammate_fullName"
                  icon={User}
                  value={formData.teammate.fullName}
                  onChange={(e) => handleTeammateChange('fullName', e.target.value)}
                  placeholder="e.g. Aman Verma"
                  error={formErrors.teammate_fullName}
                  helperText="2-100 characters, letters only"
                />

                {/* Teammate Student Number */}
                <FormField
                  label="Teammate Student Roll No."
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

                {/* Teammate Institutional College Email Preview */}
                <FormField
                  label="Teammate College Email"
                  name="teammate_collegeEmail"
                  icon={Mail}
                  value={formData.teammate.collegeEmail}
                  readOnly
                  placeholder="Automatically generated from Name + Student No."
                  rightBadge={
                    <span className="text-[10px] font-mono font-bold text-[#FF2E51]">
                      @akgec.ac.in
                    </span>
                  }
                />

                {/* Teammate Phone */}
                <FormField
                  label="Teammate Phone / WhatsApp"
                  name="teammate_phone"
                  type="tel"
                  icon={Phone}
                  value={formData.teammate.phone}
                  onChange={(e) => handleTeammateChange('phone', e.target.value.replace(/\D/g, ''))}
                  placeholder="9876543211"
                  error={formErrors.teammate_phone}
                  helperText="10 digits starting with 6, 7, 8, or 9"
                />

                {/* Teammate Branch */}
                <div className="space-y-1.5 w-full">
                  <label className="block text-xs font-mono font-bold tracking-wider text-black uppercase">
                    Teammate Branch &amp; Section <span className="text-[#FF2E51]">*</span>
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

                {/* Teammate Gender */}
                <div className="space-y-1.5 w-full">
                  <label className="block text-xs font-mono font-bold tracking-wider text-black uppercase">
                    Teammate Gender <span className="text-[#FF2E51]">*</span>
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

              {/* Teammate Residence Type */}
              <div className="space-y-2">
                <label className="block text-xs font-mono font-bold tracking-wider text-black uppercase">
                  Teammate Residence Type <span className="text-[#FF2E51]">*</span>
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
          )}

          {/* Security Assurance Banner */}
          <div className="p-3.5 bg-white border-2 border-black/30 shadow-neo-sm flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#FF2E51] shrink-0" />
            <div className="text-xs font-mono text-gray-700">
              <strong className="text-black uppercase">
                PROTECTED WITH CLOUDFLARE TURNSTILE &amp; AKGEC CCC GATEWAY.
              </strong>{' '}
              A one-time verification code (OTP) will be dispatched to your institutional email in Step 2.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t-2 border-black/10">
            <button
              type="button"
              onClick={onHome}
              className="neo-button bg-white text-black px-5 py-2.5 text-xs font-mono font-bold tracking-wider uppercase flex items-center gap-2 hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>BACK TO HOME</span>
            </button>

            <button
              type="submit"
              className="neo-button bg-[#FF2E51] text-white px-7 py-3 text-xs sm:text-sm font-mono font-bold tracking-wider uppercase flex items-center gap-2 hover:bg-[#e02445]"
            >
              <span>CONTINUE TO EMAIL VERIFICATION</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* STEP 2: EMAIL VERIFICATION */}
      {currentStep === 2 && (
        <OtpVerificationStep
          formData={formData}
          onVerificationComplete={handleVerificationComplete}
          onBack={() => {
            setCurrentStep(1);
            window.scrollTo({ top: 100, behavior: 'smooth' });
          }}
        />
      )}

      {/* STEP 3: PRE-FLIGHT REVIEW */}
      {currentStep === 3 && (
        <ReviewStep
          formData={formData}
          onConfirmedSubmit={handleConfirmedSubmit}
          onBack={() => {
            setCurrentStep(1);
            window.scrollTo({ top: 100, behavior: 'smooth' });
          }}
        />
      )}

      {/* STEP 4: SUCCESS PASS */}
      {currentStep === 4 && (
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
