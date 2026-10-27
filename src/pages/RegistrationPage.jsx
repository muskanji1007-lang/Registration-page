import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  Hash,
  Mail,
  Phone,
  GraduationCap,
  Users,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Lock,
} from 'lucide-react';
import FormField from '../components/FormField';
import CustomSelect from '../components/CustomSelect';
import Crewmate from '../components/Crewmate';
import TurnstileWidget from '../components/TurnstileWidget';
import RegistrationStepper from '../components/RegistrationStepper';
import SuccessStep from './SuccessStep';
import { BRANCHES, GENDERS, RESIDENCE_TYPES } from '../utils/constants';
import { apiService } from '../services/apiService';

export const RegistrationPage = ({ onHome }) => {
  // Steps:
  // 1: Registration Form + In-Page Verification
  // 2: Confirmed Ticket Pass ("You're In, Crewmate")
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

  // Verification States: Leader
  const [leaderToken, setLeaderToken] = useState('');
  const [leaderOtpSent, setLeaderOtpSent] = useState(false);
  const [leaderOtp, setLeaderOtp] = useState('');
  const [leaderVerified, setLeaderVerified] = useState(false);
  const [leaderLoading, setLeaderLoading] = useState(false);
  const [leaderError, setLeaderError] = useState('');
  const [leaderSuccess, setLeaderSuccess] = useState('');
  const [leaderCooldown, setLeaderCooldown] = useState(0);

  // Verification States: Teammate (If Duo Squad)
  const [teammateToken, setTeammateToken] = useState('');
  const [teammateOtpSent, setTeammateOtpSent] = useState(false);
  const [teammateOtp, setTeammateOtp] = useState('');
  const [teammateVerified, setTeammateVerified] = useState(false);
  const [teammateLoading, setTeammateLoading] = useState(false);
  const [teammateError, setTeammateError] = useState('');
  const [teammateSuccess, setTeammateSuccess] = useState('');
  const [teammateCooldown, setTeammateCooldown] = useState(0);

  // Final submission state
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const leaderTurnstileRef = useRef(null);
  const teammateTurnstileRef = useRef(null);

  // Cooldown timers
  useEffect(() => {
    let t;
    if (leaderCooldown > 0) {
      t = setTimeout(() => setLeaderCooldown((c) => c - 1), 1000);
    }
    return () => clearTimeout(t);
  }, [leaderCooldown]);

  useEffect(() => {
    let t;
    if (teammateCooldown > 0) {
      t = setTimeout(() => setTeammateCooldown((c) => c - 1), 1000);
    }
    return () => clearTimeout(t);
  }, [teammateCooldown]);

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

    if (name.length >= 2 && /^(?:23|24|25)\d{5,6}$/.test(num)) {
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

    if (name.length >= 2 && /^(?:23|24|25)\d{5,6}$/.test(num)) {
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

    if (field === 'fullName' || field === 'studentNumber') {
      setLeaderVerified(false);
      setLeaderOtpSent(false);
      setLeaderOtp('');
      setLeaderError('');
      setLeaderSuccess('');
    }

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

    if (field === 'fullName' || field === 'studentNumber') {
      setTeammateVerified(false);
      setTeammateOtpSent(false);
      setTeammateOtp('');
      setTeammateError('');
      setTeammateSuccess('');
    }

    if (formErrors[`teammate_${field}`]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[`teammate_${field}`];
        return next;
      });
    }
  };

  // Send OTP for Leader
  const handleSendLeaderOtp = async (isResend = false) => {
    if (leaderLoading) return;

    if (!formData.leader.fullName.trim() || !formData.leader.studentNumber.trim()) {
      setLeaderError('Please fill Full Name and Student No. first.');
      return;
    }
    if (!formData.leader.collegeEmail) {
      setLeaderError('Please enter a valid Student No. (e.g. 2410001) to generate your official college email.');
      return;
    }
    if (!leaderToken) {
      setLeaderError('Please complete the security verification (CAPTCHA) challenge box below.');
      return;
    }

    const tokenToSubmit = leaderToken;
    // Single-use token: Immediately clear from state so it cannot be submitted twice
    setLeaderToken('');
    if (leaderTurnstileRef.current) leaderTurnstileRef.current.reset();

    setLeaderLoading(true);
    setLeaderError('');
    setLeaderSuccess('');

    try {
      const sendFn = isResend ? apiService.resendOtp : apiService.sendOtp;
      const res = await sendFn({
        fullName: formData.leader.fullName.trim(),
        studentNumber: formData.leader.studentNumber.trim(),
        turnstileToken: tokenToSubmit,
      });

      setLeaderOtpSent(true);
      setLeaderCooldown(60);
      setLeaderSuccess(res.message || `Verification code sent to ${formData.leader.collegeEmail}. Valid for 10 minutes.`);
    } catch (err) {
      if (err.status === 429) {
        setLeaderError('Rate Limit Reached: Too many OTP requests. Please wait a few minutes before requesting again.');
      } else if (err.status === 400) {
        setLeaderError(err.message || 'Security verification failed or expired. Please solve the CAPTCHA challenge again.');
      } else {
        setLeaderError(err.message || 'Failed to dispatch OTP. Please check your details and try again.');
      }
    } finally {
      setLeaderLoading(false);
    }
  };

  // Verify Leader OTP
  const handleVerifyLeaderOtp = async () => {
    if (leaderLoading) return;
    const cleanOtp = leaderOtp.trim();
    if (cleanOtp.length !== 6) {
      setLeaderError('Please enter the complete 6-digit OTP code.');
      return;
    }

    setLeaderLoading(true);
    setLeaderError('');
    setLeaderSuccess('');

    try {
      const res = await apiService.verifyOtp({
        email: formData.leader.collegeEmail,
        otp: cleanOtp,
      });

      setLeaderVerified(true);
      setLeaderSuccess(res.message || 'Official email verified successfully!');
      setFormData((prev) => ({
        ...prev,
        leader: { ...prev.leader, isVerified: true },
      }));
    } catch (err) {
      setLeaderError(err.message || 'Invalid or expired OTP code. Please enter the latest code or request a new one.');
    } finally {
      setLeaderLoading(false);
    }
  };

  // Send OTP for Teammate
  const handleSendTeammateOtp = async (isResend = false) => {
    if (teammateLoading) return;

    if (!formData.teammate.fullName.trim() || !formData.teammate.studentNumber.trim()) {
      setTeammateError('Please fill Teammate Full Name and Student No. first.');
      return;
    }
    if (!formData.teammate.collegeEmail) {
      setTeammateError('Please enter a valid Student No. (e.g. 2410002) to generate teammate official college email.');
      return;
    }
    if (!teammateToken) {
      setTeammateError('Please complete Teammate security verification (CAPTCHA) box below.');
      return;
    }

    const tokenToSubmit = teammateToken;
    // Single-use token: Immediately clear from state so it cannot be submitted twice
    setTeammateToken('');
    if (teammateTurnstileRef.current) teammateTurnstileRef.current.reset();

    setTeammateLoading(true);
    setTeammateError('');
    setTeammateSuccess('');

    try {
      const sendFn = isResend ? apiService.resendOtp : apiService.sendOtp;
      const res = await sendFn({
        fullName: formData.teammate.fullName.trim(),
        studentNumber: formData.teammate.studentNumber.trim(),
        turnstileToken: tokenToSubmit,
      });

      setTeammateOtpSent(true);
      setTeammateCooldown(60);
      setTeammateSuccess(res.message || `Verification code sent to ${formData.teammate.collegeEmail}. Valid for 10 minutes.`);
    } catch (err) {
      if (err.status === 429) {
        setTeammateError('Rate Limit Reached: Too many OTP requests. Please wait a few minutes before requesting again.');
      } else if (err.status === 400) {
        setTeammateError(err.message || 'Teammate security verification failed or expired. Please solve the CAPTCHA challenge again.');
      } else {
        setTeammateError(err.message || 'Failed to dispatch OTP to Teammate.');
      }
    } finally {
      setTeammateLoading(false);
    }
  };

  // Verify Teammate OTP
  const handleVerifyTeammateOtp = async () => {
    const cleanOtp = teammateOtp.trim();
    if (cleanOtp.length !== 6) {
      setTeammateError('Please enter the complete 6-digit OTP code.');
      return;
    }

    setTeammateLoading(true);
    setTeammateError('');
    setTeammateSuccess('');

    try {
      const res = await apiService.verifyOtp({
        email: formData.teammate.collegeEmail,
        otp: cleanOtp,
      });

      setTeammateVerified(true);
      setTeammateSuccess(res.message || 'Teammate official email verified successfully!');
      setFormData((prev) => ({
        ...prev,
        teammate: { ...prev.teammate, isVerified: true },
      }));
    } catch (err) {
      setTeammateError(err.message || 'Invalid or expired OTP code.');
    } finally {
      setTeammateLoading(false);
    }
  };

  const handleLeaderResetToCaptcha = () => {
    setLeaderOtpSent(false);
    setLeaderOtp('');
    setLeaderToken('');
    setLeaderError('');
    setLeaderSuccess('');
    setLeaderVerified(false);
    setFormData((prev) => ({
      ...prev,
      leader: { ...prev.leader, isVerified: false },
    }));
    if (leaderTurnstileRef.current) {
      try {
        leaderTurnstileRef.current.reset();
      } catch (_) {}
    }
  };

  const handleTeammateResetToCaptcha = () => {
    setTeammateOtpSent(false);
    setTeammateOtp('');
    setTeammateToken('');
    setTeammateError('');
    setTeammateSuccess('');
    setTeammateVerified(false);
    setFormData((prev) => ({
      ...prev,
      teammate: { ...prev.teammate, isVerified: false },
    }));
    if (teammateTurnstileRef.current) {
      try {
        teammateTurnstileRef.current.reset();
      } catch (_) {}
    }
  };

  // Final Form Validation and Submission
  const handleSubmitRegistration = async (e) => {
    e.preventDefault();
    setSubmitError('');

    // 1. Validate Leader fields
    const errors = {};
    if (!formData.leader.fullName.trim()) errors.leader_fullName = 'Full Name is required';
    if (!/^(?:23|24|25)\d{5,6}$/.test(formData.leader.studentNumber.trim())) {
      errors.leader_studentNumber = 'Must start with 23, 24, or 25 (7 or 8 digits)';
    }
    if (!/^[6-9]\d{9}$/.test(formData.leader.phone.trim())) {
      errors.leader_phone = '10-digit mobile starting with 6, 7, 8, or 9';
    }
    if (!formData.leader.branch) errors.leader_branch = 'Please select Branch & Section';
    if (!formData.leader.gender) errors.leader_gender = 'Please select Gender';

    // 2. Validate Teammate fields (if Duo Squad)
    if (formData.registrationType === 'team') {
      if (!formData.teammate.fullName.trim()) errors.teammate_fullName = 'Teammate Full Name is required';
      if (!/^(?:23|24|25)\d{5,6}$/.test(formData.teammate.studentNumber.trim())) {
        errors.teammate_studentNumber = 'Must start with 23, 24, or 25 (7 or 8 digits)';
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
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    // 3. Check OTP Verification Status
    if (!leaderVerified) {
      setSubmitError('Please verify your official college email with the 6-digit OTP code below.');
      return;
    }
    if (formData.registrationType === 'team' && !teammateVerified) {
      setSubmitError('Please verify Teammate official college email with the 6-digit OTP code below.');
      return;
    }

    // Default team name if empty (for Solo)
    const finalTeamName = formData.teamName.trim() || `${formData.leader.fullName.trim()} Hunter`;

    // 4. Construct Payload
    let payload;
    if (formData.registrationType === 'team') {
      payload = {
        registrationType: 'team',
        teamName: finalTeamName,
        members: [
          {
            fullName: formData.leader.fullName.trim(),
            studentNumber: formData.leader.studentNumber.trim(),
            collegeEmail: formData.leader.collegeEmail.trim(),
            phone: formData.leader.phone.trim(),
            branch: formData.leader.branch,
            gender: formData.leader.gender,
            residence: formData.leader.residence,
            isLeader: true,
          },
          {
            fullName: formData.teammate.fullName.trim(),
            studentNumber: formData.teammate.studentNumber.trim(),
            collegeEmail: formData.teammate.collegeEmail.trim(),
            phone: formData.teammate.phone.trim(),
            branch: formData.teammate.branch,
            gender: formData.teammate.gender,
            residence: formData.teammate.residence,
            isLeader: false,
          },
        ],
      };
    } else {
      payload = {
        registrationType: 'solo',
        teamName: finalTeamName,
        fullName: formData.leader.fullName.trim(),
        studentNumber: formData.leader.studentNumber.trim(),
        collegeEmail: formData.leader.collegeEmail.trim(),
        phone: formData.leader.phone.trim(),
        branch: formData.leader.branch,
        gender: formData.leader.gender,
        residence: formData.leader.residence,
      };
    }

    // 5. Submit to Backend
    setSubmitting(true);
    try {
      const res = await apiService.register(payload);
      const record = res.registration || res.data || {
        ...payload,
        registrationId: res.registrationId || `DBX-${Date.now().toString().slice(-6)}`,
        createdAt: new Date().toISOString(),
      };
      setConfirmedRegistration(record);
      setCurrentStep(2); // Go directly to Confirmed Ticket Pass!
      window.scrollTo({ top: 40, behavior: 'smooth' });
    } catch (err) {
      setSubmitError(err.message || 'Registration submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Reset form
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
    setLeaderVerified(false);
    setLeaderOtpSent(false);
    setLeaderOtp('');
    setTeammateVerified(false);
    setTeammateOtpSent(false);
    setTeammateOtp('');
    setFormErrors({});
    setConfirmedRegistration(null);
    setCurrentStep(1);
  };

  const isAllVerified =
    formData.registrationType === 'team'
      ? leaderVerified && teammateVerified
      : leaderVerified;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between pb-1 font-mono text-xs text-gray-700">
        <button
          onClick={onHome}
          className="flex items-center gap-1.5 hover:text-black font-bold uppercase transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO HOME</span>
        </button>
        <span className="font-bold tracking-widest text-black uppercase">
          DeBugX 2026 • Registration Desk
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
            Fill your details, verify your college email with OTP, and claim your crewmate pass.
          </p>
        </div>

        <div className="flex items-center justify-center shrink-0">
          <Crewmate variant="default" size="lg" />
        </div>
      </div>

      {/* STEP 1: REGISTRATION & IN-PAGE VERIFICATION */}
      {currentStep === 1 && (
        <form onSubmit={handleSubmitRegistration} className="neo-box p-6 md:p-8 bg-[#FCFAF6] space-y-8">
          {/* Stepper Header (Only 2 steps: Register & Ticket Pass) */}
          <RegistrationStepper currentStep={1} />

          {/* Section 1: Member / Leader Details */}
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b-2 border-black">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#FF2E51]" />
                <h2 className="text-sm sm:text-base font-extrabold font-mono tracking-wider text-black uppercase">
                  {formData.registrationType === 'team' ? '1. LEADER DETAILS' : '1. CANDIDATE DETAILS'}
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

              {/* Student No. (Updated as requested in Screenshot 2) */}
              <FormField
                label="STUDENT NO."
                name="studentNumber"
                icon={Hash}
                value={formData.leader.studentNumber}
                onChange={(e) => handleLeaderChange('studentNumber', e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 24154046"
                error={formErrors.leader_studentNumber}
                helperText="Must start with 23, 24, or 25 (7 or 8 digits)"
              />

              {/* Institutional College Email Preview */}
              <FormField
                label="INSTITUTIONAL COLLEGE EMAIL"
                name="collegeEmail"
                icon={Mail}
                value={formData.leader.collegeEmail}
                readOnly
                placeholder="alex24154046@akgec.ac.in"
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
              <CustomSelect
                label="BRANCH & SECTION"
                name="branch"
                icon={GraduationCap}
                value={formData.leader.branch}
                onChange={(val) =>
                  handleLeaderChange('branch', typeof val === 'object' && val?.target ? val.target.value : val)
                }
                options={BRANCHES}
                placeholder="Select your Branch & Section"
                error={formErrors.leader_branch}
              />

              {/* Gender */}
              <CustomSelect
                label="GENDER"
                name="gender"
                icon={User}
                value={formData.leader.gender}
                onChange={(val) =>
                  handleLeaderChange('gender', typeof val === 'object' && val?.target ? val.target.value : val)
                }
                options={GENDERS}
                placeholder="Select Gender"
                error={formErrors.leader_gender}
              />
            </div>

            {/* Residence Type */}
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

          {/* Section 2: Participation Format Selection */}
          <div className="space-y-4 pt-4 border-t-2 border-black">
            <div className="flex items-center justify-between pb-2 border-b-2 border-black">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#FF2E51]" />
                <h2 className="text-sm sm:text-base font-extrabold font-mono tracking-wider text-black uppercase">
                  2. PARTICIPATION FORMAT
                </h2>
              </div>
              <span className="text-xs font-mono text-gray-500 uppercase">
                {formData.registrationType === 'team' ? 'DUO SQUAD (2 MEMBERS)' : 'SOLO (1 MEMBER)'}
              </span>
            </div>

            {/* Format Selection Cards (With tactile press animation) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option 1: Solo Hunter (Left) */}
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, registrationType: 'solo' }))}
                className={`p-4 border-2 text-left transition-all duration-150 cursor-pointer hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[3px] active:translate-y-[3px] relative ${
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
                className={`p-4 border-2 text-left transition-all duration-150 cursor-pointer hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[3px] active:translate-y-[3px] relative ${
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

          {/* Section 2b: Teammate Details (Only rendered if Duo Squad) */}
          {formData.registrationType === 'team' && (
            <div className="space-y-6 pt-4 border-t-2 border-black">
              <div className="flex items-center justify-between pb-3 border-b-2 border-black">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-[#FF2E51]" />
                  <h2 className="text-sm sm:text-base font-extrabold font-mono tracking-wider text-black uppercase">
                    3. TEAMMATE DETAILS
                  </h2>
                </div>
                <span className="text-[10px] font-mono font-bold text-[#FF2E51] tracking-wider uppercase">
                  MEMBER 2
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

                {/* Teammate Student No. */}
                <FormField
                  label="TEAMMATE STUDENT NO."
                  name="teammate_studentNumber"
                  icon={Hash}
                  value={formData.teammate.studentNumber}
                  onChange={(e) =>
                    handleTeammateChange('studentNumber', e.target.value.replace(/\D/g, ''))
                  }
                  placeholder="e.g. 2412214"
                  error={formErrors.teammate_studentNumber}
                  helperText="Must start with 23, 24, or 25 (7 or 8 digits)"
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
                  label="TEAMMATE PHONE NUMBER"
                  name="teammate_phone"
                  type="tel"
                  icon={Phone}
                  value={formData.teammate.phone}
                  onChange={(e) =>
                    handleTeammateChange('phone', e.target.value.replace(/\D/g, ''))
                  }
                  placeholder="+91 98765 43210"
                  error={formErrors.teammate_phone}
                  helperText="10-digit mobile number"
                />

                {/* Branch */}
                <CustomSelect
                  label="TEAMMATE BRANCH & SECTION"
                  name="teammate_branch"
                  icon={GraduationCap}
                  value={formData.teammate.branch}
                  onChange={(val) =>
                    handleTeammateChange('branch', typeof val === 'object' && val?.target ? val.target.value : val)
                  }
                  options={BRANCHES}
                  placeholder="Select Branch & Section"
                  error={formErrors.teammate_branch}
                />

                {/* Gender */}
                <CustomSelect
                  label="TEAMMATE GENDER"
                  name="teammate_gender"
                  icon={User}
                  value={formData.teammate.gender}
                  onChange={(val) =>
                    handleTeammateChange('gender', typeof val === 'object' && val?.target ? val.target.value : val)
                  }
                  options={GENDERS}
                  placeholder="Select Gender"
                  error={formErrors.teammate_gender}
                />
              </div>

              {/* Residence */}
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
          )}

          {/* Section: Email Verification (Directly in-page, no separate OTP page!) */}
          <div className="space-y-5 pt-4 border-t-2 border-black">
            <div className="flex items-center justify-between pb-2 border-b-2 border-black">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#FF2E51]" />
                <h2 className="text-sm sm:text-base font-extrabold font-mono tracking-wider text-black uppercase">
                  {formData.registrationType === 'team' ? '4. EMAIL VERIFICATION' : '3. EMAIL VERIFICATION'}
                </h2>
              </div>
              {isAllVerified && (
                <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 border border-emerald-500 uppercase">
                  ✓ All Verified
                </span>
              )}
            </div>

            {/* Leader Verification Box */}
            <div className="p-5 bg-white border-2 border-black shadow-neo-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-black/10">
                <span className="text-xs font-mono font-bold uppercase text-black">
                  {formData.registrationType === 'team'
                    ? '1. LEADER EMAIL VERIFICATION'
                    : 'CANDIDATE EMAIL VERIFICATION'}
                </span>
                {leaderVerified ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 border border-emerald-500">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>VERIFIED ✓</span>
                  </span>
                ) : leaderOtpSent ? (
                  <span className="text-[10px] font-mono font-bold text-sky-600 bg-sky-50 px-2 py-0.5 border border-sky-400 uppercase">
                    STEP 2: ENTER OTP
                  </span>
                ) : (
                  <span className="text-[10px] font-mono font-bold text-[#FF2E51] bg-red-50 px-2 py-0.5 border border-[#FF2E51] uppercase">
                    STEP 1: CAPTCHA
                  </span>
                )}
              </div>

              <div className="text-xs font-mono text-gray-600">
                Official Email:{' '}
                <strong className="text-black">
                  {formData.leader.collegeEmail || '(Enter Student No. in Section 1 to preview)'}
                </strong>
              </div>

              {leaderVerified ? (
                /* State 3: Successfully Verified */
                <div className="p-4 bg-emerald-50 border-2 border-emerald-500 rounded text-emerald-900 font-mono text-xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-bold text-sm block">Email Verified Successfully!</span>
                      <span className="text-gray-700">{formData.leader.collegeEmail} is authorized.</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleLeaderResetToCaptcha}
                    className="text-[11px] font-mono font-bold text-gray-600 hover:text-black underline uppercase"
                  >
                    Re-verify
                  </button>
                </div>
              ) : !leaderOtpSent ? (
                /* State 1: Security Verification (CAPTCHA ONLY - Step 1 of 2) */
                <div className="space-y-4">
                  <div className="p-3 bg-amber-50 border border-amber-300 text-amber-900 font-mono text-xs">
                    <span className="font-bold block mb-0.5">STEP 1 OF 2 // SECURITY VERIFICATION</span>
                    <span>Complete the security check below to enable OTP dispatch to your email.</span>
                  </div>

                  <div className="flex justify-center py-1">
                    <TurnstileWidget
                      ref={leaderTurnstileRef}
                      onVerify={(token) => {
                        setLeaderToken(token);
                        setLeaderError('');
                      }}
                      onSuccess={(token) => {
                        setLeaderToken(token);
                        setLeaderError('');
                      }}
                      onError={(err) =>
                        setLeaderError(err || 'Security check failed. Please refresh or retry.')
                      }
                      onExpire={() => setLeaderToken('')}
                      label="Security Verification"
                    />
                  </div>

                  {leaderToken && (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-500 text-emerald-800 font-mono text-xs font-bold flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Security Verification Passed! Ready to send OTP.</span>
                    </div>
                  )}

                  {leaderError && (
                    <div className="p-3 bg-red-50 border-2 border-[#FF2E51] text-[#FF2E51] font-mono text-xs font-bold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{leaderError}</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => handleSendLeaderOtp(false)}
                    disabled={leaderLoading}
                    className="w-full neo-button bg-[#FF2E51] text-white py-3 text-xs sm:text-sm font-mono font-bold uppercase tracking-wider disabled:opacity-50 flex items-center justify-center gap-2 hover:bg-[#e02445]"
                  >
                    {leaderLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>DISPATCHING OTP...</span>
                      </>
                    ) : (
                      <span>SEND VERIFICATION OTP →</span>
                    )}
                  </button>
                </div>
              ) : (
                /* State 2: Enter 6-Digit Email OTP (CAPTCHA is hidden - Step 2 of 2) */
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="p-3 bg-sky-50 border border-sky-400 text-sky-900 font-mono text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-sky-950">
                      <Mail className="w-4 h-4 text-sky-600" />
                      <span>STEP 2 OF 2 // ENTER 6-DIGIT OTP</span>
                    </div>
                    <p className="text-[11px] text-sky-800 font-sans">
                      Verification code dispatched to{' '}
                      <strong className="font-mono text-black">{formData.leader.collegeEmail}</strong>. Valid for
                      10 minutes (please check Spam/Junk folder).
                    </p>
                  </div>

                  {leaderSuccess && (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-500 text-emerald-800 font-mono text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                      <span>{leaderSuccess}</span>
                    </div>
                  )}

                  {leaderError && (
                    <div className="p-3 bg-red-50 border-2 border-[#FF2E51] text-[#FF2E51] font-mono text-xs font-bold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{leaderError}</span>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      autoFocus
                      value={leaderOtp}
                      onChange={(e) => setLeaderOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="••••••"
                      className="bg-white border-2 border-black text-black font-mono text-2xl tracking-[0.3em] px-4 py-2.5 text-center w-full sm:w-48 focus:outline-none focus:border-[#FF2E51] shadow-inner"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyLeaderOtp}
                      disabled={leaderLoading || leaderOtp.trim().length !== 6}
                      className="neo-button bg-black text-white px-7 py-3 text-xs sm:text-sm font-mono font-bold uppercase tracking-wider hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {leaderLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>VERIFYING CODE...</span>
                        </>
                      ) : (
                        <span>VERIFY CODE ✓</span>
                      )}
                    </button>
                  </div>

                  {/* Resend and Navigation */}
                  <div className="pt-2 border-t border-black/10 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                    {leaderCooldown > 0 ? (
                      <span className="text-gray-500">
                        Resend available in <strong className="text-black">{leaderCooldown}s</strong>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleLeaderResetToCaptcha}
                        className="text-[#FF2E51] font-bold hover:underline flex items-center gap-1"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Resend OTP (Re-verify CAPTCHA)</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleLeaderResetToCaptcha}
                      className="text-gray-600 hover:text-black hover:underline"
                    >
                      ← Back to Step 1
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Teammate Verification Box (If Duo Squad) */}
            {formData.registrationType === 'team' && (
              <div className="p-5 bg-white border-2 border-black shadow-neo-sm space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-black/10">
                  <span className="text-xs font-mono font-bold uppercase text-black">
                    2. TEAMMATE EMAIL VERIFICATION
                  </span>
                  {teammateVerified ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 border border-emerald-500">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>VERIFIED ✓</span>
                    </span>
                  ) : !leaderVerified ? (
                    <span className="text-[10px] font-mono font-bold text-gray-500 bg-gray-100 px-2 py-0.5 border border-gray-300 uppercase">
                      LOCKED
                    </span>
                  ) : teammateOtpSent ? (
                    <span className="text-[10px] font-mono font-bold text-sky-600 bg-sky-50 px-2 py-0.5 border border-sky-400 uppercase">
                      STEP 2: ENTER OTP
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono font-bold text-[#FF2E51] bg-red-50 px-2 py-0.5 border border-[#FF2E51] uppercase">
                      STEP 1: CAPTCHA
                    </span>
                  )}
                </div>

                <div className="text-xs font-mono text-gray-600">
                  Official Email:{' '}
                  <strong className="text-black">
                    {formData.teammate.collegeEmail || '(Enter Teammate Student No. in Section 3 to preview)'}
                  </strong>
                </div>

                {!leaderVerified ? (
                  /* Locked state until Leader is verified */
                  <div className="p-4 bg-gray-50 border-2 border-dashed border-gray-300 text-gray-600 font-mono text-xs flex items-center gap-3">
                    <Lock className="w-5 h-5 text-gray-400 shrink-0" />
                    <div>
                      <span className="font-bold text-black block">Waiting for Leader Verification</span>
                      <span>
                        Please verify Team Leader&apos;s email above first. Teammate verification will unlock automatically once Leader is verified.
                      </span>
                    </div>
                  </div>
                ) : teammateVerified ? (
                  /* State 3: Teammate Successfully Verified */
                  <div className="p-4 bg-emerald-50 border-2 border-emerald-500 rounded text-emerald-900 font-mono text-xs flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <div>
                        <span className="font-bold text-sm block">Teammate Email Verified Successfully!</span>
                        <span className="text-gray-700">{formData.teammate.collegeEmail} is authorized.</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleTeammateResetToCaptcha}
                      className="text-[11px] font-mono font-bold text-gray-600 hover:text-black underline uppercase"
                    >
                      Re-verify
                    </button>
                  </div>
                ) : !teammateOtpSent ? (
                  /* State 1: Teammate Security Verification (CAPTCHA ONLY) */
                  <div className="space-y-4">
                    <div className="p-3 bg-amber-50 border border-amber-300 text-amber-900 font-mono text-xs">
                      <span className="font-bold block mb-0.5">STEP 1 OF 2 // TEAMMATE SECURITY CHECK</span>
                      <span>Complete teammate security check below to enable OTP dispatch.</span>
                    </div>

                    <div className="flex justify-center py-1">
                      <TurnstileWidget
                        ref={teammateTurnstileRef}
                        onVerify={(token) => {
                          setTeammateToken(token);
                          setTeammateError('');
                        }}
                        onSuccess={(token) => {
                          setTeammateToken(token);
                          setTeammateError('');
                        }}
                        onError={(err) =>
                          setTeammateError(err || 'Security check failed. Please refresh or retry.')
                        }
                        onExpire={() => setTeammateToken('')}
                        label="Teammate Security Verification"
                      />
                    </div>

                    {teammateToken && (
                      <div className="p-2.5 bg-emerald-50 border border-emerald-500 text-emerald-800 font-mono text-xs font-bold flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Teammate Security Verification Passed! Ready to send OTP.</span>
                      </div>
                    )}

                    {teammateError && (
                      <div className="p-3 bg-red-50 border-2 border-[#FF2E51] text-[#FF2E51] font-mono text-xs font-bold flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{teammateError}</span>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => handleSendTeammateOtp(false)}
                      disabled={teammateLoading}
                      className="w-full neo-button bg-[#FF2E51] text-white py-3 text-xs sm:text-sm font-mono font-bold uppercase tracking-wider disabled:opacity-50 flex items-center justify-center gap-2 hover:bg-[#e02445]"
                    >
                      {teammateLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>DISPATCHING TEAMMATE OTP...</span>
                        </>
                      ) : (
                        <span>SEND TEAMMATE VERIFICATION OTP →</span>
                      )}
                    </button>
                  </div>
                ) : (
                  /* State 2: Teammate Enter 6-Digit Email OTP (CAPTCHA is hidden) */
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="p-3 bg-sky-50 border border-sky-400 text-sky-900 font-mono text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-sky-950">
                        <Mail className="w-4 h-4 text-sky-600" />
                        <span>STEP 2 OF 2 // ENTER TEAMMATE 6-DIGIT OTP</span>
                      </div>
                      <p className="text-[11px] text-sky-800 font-sans">
                        Verification code dispatched to{' '}
                        <strong className="font-mono text-black">{formData.teammate.collegeEmail}</strong>. Valid
                        for 10 minutes (please check Spam/Junk folder).
                      </p>
                    </div>

                    {teammateSuccess && (
                      <div className="p-2.5 bg-emerald-50 border border-emerald-500 text-emerald-800 font-mono text-xs font-bold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                        <span>{teammateSuccess}</span>
                      </div>
                    )}

                    {teammateError && (
                      <div className="p-3 bg-red-50 border-2 border-[#FF2E51] text-[#FF2E51] font-mono text-xs font-bold flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{teammateError}</span>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        autoFocus
                        value={teammateOtp}
                        onChange={(e) => setTeammateOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder="••••••"
                        className="bg-white border-2 border-black text-black font-mono text-2xl tracking-[0.3em] px-4 py-2.5 text-center w-full sm:w-48 focus:outline-none focus:border-[#FF2E51] shadow-inner"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyTeammateOtp}
                        disabled={teammateLoading || teammateOtp.trim().length !== 6}
                        className="neo-button bg-black text-white px-7 py-3 text-xs sm:text-sm font-mono font-bold uppercase tracking-wider hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {teammateLoading ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>VERIFYING CODE...</span>
                          </>
                        ) : (
                          <span>VERIFY TEAMMATE CODE ✓</span>
                        )}
                      </button>
                    </div>

                    {/* Resend and Navigation */}
                    <div className="pt-2 border-t border-black/10 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                      {teammateCooldown > 0 ? (
                        <span className="text-gray-500">
                          Resend available in <strong className="text-black">{teammateCooldown}s</strong>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleTeammateResetToCaptcha}
                          className="text-[#FF2E51] font-bold hover:underline flex items-center gap-1"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Resend OTP (Re-verify CAPTCHA)</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={handleTeammateResetToCaptcha}
                        className="text-gray-600 hover:text-black hover:underline"
                      >
                        ← Back to Step 1
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Global Submit Error Banner */}
          {submitError && (
            <div className="p-3.5 bg-red-50 border-2 border-[#FF2E51] text-[#FF2E51] font-mono text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Bottom Action Buttons (Single Back Arrow & Instant Submit) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 pt-4 border-t-2 border-black/10">
            <button
              type="button"
              onClick={onHome}
              className="neo-button bg-white text-black px-5 py-2.5 text-xs font-mono font-bold tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-gray-100 w-full sm:w-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>BACK TO HOME</span>
            </button>

            <button
              type="submit"
              disabled={submitting || !isAllVerified}
              className="neo-button bg-[#FF2E51] text-white px-8 py-3.5 text-xs sm:text-sm font-mono font-bold tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-[#e02445] disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto shadow-neo"
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>SUBMITTING REGISTRATION...</span>
                </>
              ) : (
                <>
                  <span>CONFIRM &amp; CLAIM PASS</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* STEP 2: SUCCESS PASS (Slide 4 - "You're In, Crewmate") */}
      {currentStep === 2 && (
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
