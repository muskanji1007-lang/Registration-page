import React, { useState, useEffect, useRef } from 'react';
import { Mail, CheckCircle2, AlertCircle, RefreshCw, ArrowRight, ArrowLeft, ShieldCheck, User, Users } from 'lucide-react';
import TurnstileWidget from '../components/TurnstileWidget';
import RegistrationStepper from '../components/RegistrationStepper';
import { apiService } from '../services/apiService';

export const OtpVerificationStep = ({
  formData,
  onConfirmedSubmit,
  onBack,
}) => {
  const isTeam = formData.registrationType === 'team';
  const [activeTab, setActiveTab] = useState('leader'); // 'leader' | 'teammate'

  // Leader states
  const [leaderToken, setLeaderToken] = useState('');
  const [leaderOtpSent, setLeaderOtpSent] = useState(false);
  const [leaderOtp, setLeaderOtp] = useState('');
  const [leaderVerified, setLeaderVerified] = useState(Boolean(formData.leader?.isVerified));
  const [leaderLoading, setLeaderLoading] = useState(false);
  const [leaderError, setLeaderError] = useState('');
  const [leaderSuccess, setLeaderSuccess] = useState('');
  const [leaderCooldown, setLeaderCooldown] = useState(0);

  // Teammate states (if Duo Squad)
  const [teammateToken, setTeammateToken] = useState('');
  const [teammateOtpSent, setTeammateOtpSent] = useState(false);
  const [teammateOtp, setTeammateOtp] = useState('');
  const [teammateVerified, setTeammateVerified] = useState(Boolean(formData.teammate?.isVerified));
  const [teammateLoading, setTeammateLoading] = useState(false);
  const [teammateError, setTeammateError] = useState('');
  const [teammateSuccess, setTeammateSuccess] = useState('');
  const [teammateCooldown, setTeammateCooldown] = useState(0);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const leaderTurnstileRef = useRef(null);
  const teammateTurnstileRef = useRef(null);
  const leaderInputRef = useRef(null);
  const teammateInputRef = useRef(null);

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

  // Send OTP for Leader
  const handleSendLeaderOtp = async (isResend = false) => {
    if (!leaderToken) {
      setLeaderError('Security verification (CAPTCHA) is required.');
      return;
    }

    setLeaderLoading(true);
    setLeaderError('');
    setLeaderSuccess('');

    try {
      const sendFn = isResend ? apiService.resendOtp : apiService.sendOtp;
      const res = await sendFn({
        fullName: formData.leader.fullName,
        studentNumber: formData.leader.studentNumber,
        turnstileToken: leaderToken,
      });

      setLeaderOtpSent(true);
      setLeaderCooldown(60);
      setLeaderSuccess(res.message || 'OTP dispatched to your official college email.');
      setLeaderToken('');
      if (leaderTurnstileRef.current) leaderTurnstileRef.current.reset();
      setTimeout(() => leaderInputRef.current?.focus(), 200);
    } catch (err) {
      setLeaderError(err.message || 'Failed to dispatch OTP. Please try again.');
      setLeaderToken('');
      if (leaderTurnstileRef.current) leaderTurnstileRef.current.reset();
    } finally {
      setLeaderLoading(false);
    }
  };

  // Verify Leader OTP
  const handleVerifyLeaderOtp = async () => {
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
      setLeaderSuccess(res.message || 'Email verified successfully!');
      if (isTeam && !teammateVerified) {
        setTimeout(() => setActiveTab('teammate'), 900);
      }
    } catch (err) {
      setLeaderError(err.message || 'Invalid or expired OTP code.');
    } finally {
      setLeaderLoading(false);
    }
  };

  // Send OTP for Teammate
  const handleSendTeammateOtp = async (isResend = false) => {
    if (!teammateToken) {
      setTeammateError('Security verification (CAPTCHA) is required.');
      return;
    }

    setTeammateLoading(true);
    setTeammateError('');
    setTeammateSuccess('');

    try {
      const sendFn = isResend ? apiService.resendOtp : apiService.sendOtp;
      const res = await sendFn({
        fullName: formData.teammate.fullName,
        studentNumber: formData.teammate.studentNumber,
        turnstileToken: teammateToken,
      });

      setTeammateOtpSent(true);
      setTeammateCooldown(60);
      setTeammateSuccess(res.message || 'OTP dispatched to Teammate college email.');
      setTeammateToken('');
      if (teammateTurnstileRef.current) teammateTurnstileRef.current.reset();
      setTimeout(() => teammateInputRef.current?.focus(), 200);
    } catch (err) {
      setTeammateError(err.message || 'Failed to send OTP to Teammate.');
      setTeammateToken('');
      if (teammateTurnstileRef.current) teammateTurnstileRef.current.reset();
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
      setTeammateSuccess(res.message || 'Teammate email verified successfully!');
    } catch (err) {
      setTeammateError(err.message || 'Invalid or expired OTP code.');
    } finally {
      setTeammateLoading(false);
    }
  };

  // Build submission payload
  const buildPayload = () => {
    if (isTeam) {
      return {
        registrationType: 'team',
        teamName: formData.teamName.trim(),
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
    }

    return {
      registrationType: 'solo',
      teamName: formData.teamName.trim(),
      fullName: formData.leader.fullName.trim(),
      studentNumber: formData.leader.studentNumber.trim(),
      collegeEmail: formData.leader.collegeEmail.trim(),
      phone: formData.leader.phone.trim(),
      branch: formData.leader.branch,
      gender: formData.leader.gender,
      residence: formData.leader.residence,
    };
  };

  // Final Submit
  const handleFinalSubmit = async () => {
    if (!leaderVerified) {
      setSubmitError('Please verify your college email with OTP before submitting.');
      return;
    }
    if (isTeam && !teammateVerified) {
      setSubmitError('Please verify both Team Leader and Teammate emails.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      const payload = buildPayload();
      // 1. Preflight review
      await apiService.reviewRegistration(payload);
      // 2. Final atomic save
      const res = await apiService.submitRegistration(payload);
      onConfirmedSubmit(res.registration || res);
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit registration. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const isAllVerified = isTeam ? leaderVerified && teammateVerified : leaderVerified;

  // Render 6 Dot Indicators (Matching Slide 3)
  const renderDots = (value, inputRef) => {
    const digits = value.split('');
    return (
      <div
        onClick={() => inputRef.current?.focus()}
        className="flex items-center justify-center gap-4 py-4 cursor-pointer select-none"
      >
        {[0, 1, 2, 3, 4, 5].map((index) => {
          const isFilled = Boolean(digits[index]);
          return (
            <div
              key={index}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all ${
                isFilled
                  ? 'bg-black text-white shadow-sm'
                  : 'border-2 border-black/30 bg-transparent'
              }`}
            >
              {isFilled ? (
                <span className="w-3.5 h-3.5 rounded-full bg-white block" />
              ) : null}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="neo-box p-6 md:p-10 bg-[#FCFAF6] space-y-8">
      {/* Title (Matching Slide 3) */}
      <div className="text-center">
        <h1 className="text-3xl sm:text-5xl font-black font-display uppercase tracking-tight text-black">
          VERIFY YOUR EMAIL
        </h1>
      </div>

      {/* Stepper Header */}
      <div className="max-w-2xl mx-auto w-full">
        <RegistrationStepper currentStep={isTeam ? 3 : 2} isTeam={isTeam} />
      </div>

      {/* For Duo Squad: Tab Switcher */}
      {isTeam && (
        <div className="max-w-xl mx-auto flex border-2 border-black bg-white shadow-neo-sm">
          <button
            type="button"
            onClick={() => setActiveTab('leader')}
            className={`flex-1 py-2.5 px-3 text-xs font-mono font-bold flex items-center justify-center gap-2 border-r-2 border-black transition-colors ${
              activeTab === 'leader' ? 'bg-black text-white' : 'text-gray-800 hover:bg-gray-100'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Leader ({formData.leader.fullName.split(' ')[0]})</span>
            {leaderVerified && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('teammate')}
            className={`flex-1 py-2.5 px-3 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'teammate' ? 'bg-black text-white' : 'text-gray-800 hover:bg-gray-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Teammate ({formData.teammate?.fullName?.split(' ')[0] || 'Member 2'})</span>
            {teammateVerified && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      )}

      {/* Main Rounded OTP Card (Exact match to Slide 3) */}
      <div className="max-w-xl mx-auto rounded-2xl border-2 border-[#93C5FD] p-8 sm:p-12 bg-white space-y-6 shadow-sm">
        {(!isTeam || activeTab === 'leader') && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold font-sans text-black">
                Enter the OTP
              </h2>
              <p className="text-sm font-sans text-gray-500">
                Sent to <span className="font-semibold text-black">{formData.leader.collegeEmail}</span>
              </p>
            </div>

            {leaderVerified ? (
              <div className="p-4 bg-emerald-50 border-2 border-emerald-500 rounded-xl text-emerald-900 font-mono text-xs flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold text-sm block">Email Verified Successfully!</span>
                  <span>{formData.leader.collegeEmail} is authorized.</span>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {!leaderOtpSent ? (
                  <div className="space-y-4">
                    <p className="text-xs text-gray-600 font-sans">
                      Solve the security check below to receive your 6-digit verification code.
                    </p>

                    <TurnstileWidget
                      ref={leaderTurnstileRef}
                      label="Turnstile Security Check (Leader)"
                      onVerify={(token) => {
                        setLeaderToken(token);
                        setLeaderError('');
                      }}
                      onExpire={() => setLeaderToken('')}
                      onError={() => setLeaderToken('')}
                    />

                    {leaderError && (
                      <p className="text-xs font-mono text-[#FF2E51] font-bold">
                        {leaderError}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={() => handleSendLeaderOtp(false)}
                      disabled={leaderLoading || !leaderToken}
                      className="w-full neo-button bg-[#FF2E51] text-white py-2.5 text-xs font-mono font-bold uppercase tracking-wider disabled:opacity-50"
                    >
                      {leaderLoading ? 'SENDING OTP...' : 'SEND VERIFICATION OTP'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {/* Hidden input to capture numeric digits smoothly */}
                    <input
                      ref={leaderInputRef}
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={leaderOtp}
                      onChange={(e) => setLeaderOtp(e.target.value.replace(/\D/g, ''))}
                      className="opacity-0 absolute -z-10"
                      autoFocus
                    />

                    {/* 6 Large Dots Display (Matching Slide 3) */}
                    {renderDots(leaderOtp, leaderInputRef)}

                    {leaderError && (
                      <p className="text-xs font-mono text-center text-[#FF2E51] font-bold">
                        {leaderError}
                      </p>
                    )}

                    {/* Pill "Verify ->" Button (Matching Slide 3) */}
                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={handleVerifyLeaderOtp}
                        disabled={leaderLoading || leaderOtp.trim().length !== 6}
                        className="rounded-full border-2 border-black/20 px-8 py-2.5 bg-white text-black font-sans font-bold text-sm shadow-sm hover:border-black flex items-center gap-1.5 transition-all disabled:opacity-50"
                      >
                        {leaderLoading ? (
                          <RefreshCw className="w-4 h-4 animate-spin text-black" />
                        ) : null}
                        <span>Verify &rarr;</span>
                      </button>
                    </div>

                    {/* Resend Link */}
                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => handleSendLeaderOtp(true)}
                        disabled={leaderLoading || leaderCooldown > 0}
                        className="text-xs font-mono text-gray-500 hover:text-black underline disabled:opacity-50 disabled:no-underline"
                      >
                        {leaderCooldown > 0
                          ? `Resend OTP in ${leaderCooldown}s`
                          : 'Did not receive? Resend OTP'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Teammate Verification (If Duo Squad) */}
        {isTeam && activeTab === 'teammate' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold font-sans text-black">
                Enter Teammate OTP
              </h2>
              <p className="text-sm font-sans text-gray-500">
                Sent to <span className="font-semibold text-black">{formData.teammate?.collegeEmail}</span>
              </p>
            </div>

            {teammateVerified ? (
              <div className="p-4 bg-emerald-50 border-2 border-emerald-500 rounded-xl text-emerald-900 font-mono text-xs flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold text-sm block">Teammate Verified Successfully!</span>
                  <span>{formData.teammate?.collegeEmail} is authorized.</span>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {!teammateOtpSent ? (
                  <div className="space-y-4">
                    <p className="text-xs text-gray-600 font-sans">
                      Solve the security check below to send the code to your teammate.
                    </p>

                    <TurnstileWidget
                      ref={teammateTurnstileRef}
                      label="Turnstile Security Check (Teammate)"
                      onVerify={(token) => {
                        setTeammateToken(token);
                        setTeammateError('');
                      }}
                      onExpire={() => setTeammateToken('')}
                      onError={() => setTeammateToken('')}
                    />

                    {teammateError && (
                      <p className="text-xs font-mono text-[#FF2E51] font-bold">
                        {teammateError}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={() => handleSendTeammateOtp(false)}
                      disabled={teammateLoading || !teammateToken}
                      className="w-full neo-button bg-[#FF2E51] text-white py-2.5 text-xs font-mono font-bold uppercase tracking-wider disabled:opacity-50"
                    >
                      {teammateLoading ? 'SENDING OTP...' : 'SEND TEAMMATE OTP'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <input
                      ref={teammateInputRef}
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={teammateOtp}
                      onChange={(e) => setTeammateOtp(e.target.value.replace(/\D/g, ''))}
                      className="opacity-0 absolute -z-10"
                      autoFocus
                    />

                    {renderDots(teammateOtp, teammateInputRef)}

                    {teammateError && (
                      <p className="text-xs font-mono text-center text-[#FF2E51] font-bold">
                        {teammateError}
                      </p>
                    )}

                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={handleVerifyTeammateOtp}
                        disabled={teammateLoading || teammateOtp.trim().length !== 6}
                        className="rounded-full border-2 border-black/20 px-8 py-2.5 bg-white text-black font-sans font-bold text-sm shadow-sm hover:border-black flex items-center gap-1.5 transition-all disabled:opacity-50"
                      >
                        {teammateLoading ? (
                          <RefreshCw className="w-4 h-4 animate-spin text-black" />
                        ) : null}
                        <span>Verify &rarr;</span>
                      </button>
                    </div>

                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => handleSendTeammateOtp(true)}
                        disabled={teammateLoading || teammateCooldown > 0}
                        className="text-xs font-mono text-gray-500 hover:text-black underline disabled:opacity-50 disabled:no-underline"
                      >
                        {teammateCooldown > 0
                          ? `Resend OTP in ${teammateCooldown}s`
                          : 'Did not receive? Resend OTP'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Global Error Banner */}
      {submitError && (
        <div className="max-w-xl mx-auto p-3.5 bg-red-50 border-2 border-[#FF2E51] text-[#FF2E51] font-mono text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      {/* Red Bottom Button (Matching Slide 3 "CONTINUE TO PAYMENT ->" / "CONFIRM & SUBMIT ->") */}
      <div className="max-w-xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="neo-button bg-white text-black px-5 py-2.5 text-xs font-mono font-bold tracking-wider uppercase hover:bg-gray-100 flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK</span>
        </button>

        <button
          type="button"
          onClick={handleFinalSubmit}
          disabled={submitting || !isAllVerified}
          className="neo-button bg-[#FF2E51] text-white px-8 py-3 text-xs sm:text-sm font-mono font-extrabold tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-[#e02445] disabled:opacity-50 w-full sm:w-auto"
        >
          {submitting ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>SAVING REGISTRATION...</span>
            </>
          ) : (
            <>
              <span>CONTINUE TO SUBMIT</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default OtpVerificationStep;
