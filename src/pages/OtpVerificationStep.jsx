import React, { useState, useEffect, useRef } from 'react';
import { Mail, CheckCircle2, AlertCircle, RefreshCw, KeyRound, ArrowRight, ArrowLeft, ShieldCheck, Users, User } from 'lucide-react';
import TurnstileWidget from '../components/TurnstileWidget';
import { apiService } from '../services/apiService';

export const OtpVerificationStep = ({
  formData,
  onVerificationComplete,
  onBack,
}) => {
  const isTeam = formData.registrationType === 'team';

  // Active sub-tab for team verification: 'leader' | 'teammate'
  const [activeTab, setActiveTab] = useState('leader');

  // Verification state for Leader
  const [leaderToken, setLeaderToken] = useState('');
  const [leaderOtpSent, setLeaderOtpSent] = useState(false);
  const [leaderOtp, setLeaderOtp] = useState('');
  const [leaderVerified, setLeaderVerified] = useState(Boolean(formData.leader.isVerified));
  const [leaderLoading, setLeaderLoading] = useState(false);
  const [leaderError, setLeaderError] = useState('');
  const [leaderSuccess, setLeaderSuccess] = useState('');
  const [leaderCooldown, setLeaderCooldown] = useState(0);

  // Verification state for Teammate (if team)
  const [teammateToken, setTeammateToken] = useState('');
  const [teammateOtpSent, setTeammateOtpSent] = useState(false);
  const [teammateOtp, setTeammateOtp] = useState('');
  const [teammateVerified, setTeammateVerified] = useState(Boolean(formData.teammate?.isVerified));
  const [teammateLoading, setTeammateLoading] = useState(false);
  const [teammateError, setTeammateError] = useState('');
  const [teammateSuccess, setTeammateSuccess] = useState('');
  const [teammateCooldown, setTeammateCooldown] = useState(0);

  const leaderTurnstileRef = useRef(null);
  const teammateTurnstileRef = useRef(null);

  // Countdown timer for Leader
  useEffect(() => {
    let timer;
    if (leaderCooldown > 0) {
      timer = setTimeout(() => setLeaderCooldown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [leaderCooldown]);

  // Countdown timer for Teammate
  useEffect(() => {
    let timer;
    if (teammateCooldown > 0) {
      timer = setTimeout(() => setTeammateCooldown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [teammateCooldown]);

  // 1. Send / Resend OTP for Leader
  const handleSendLeaderOtp = async (isResend = false) => {
    if (!leaderToken) {
      setLeaderError('Security verification (CAPTCHA) is required. Please solve the challenge.');
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
      setLeaderSuccess(res.message || 'Verification code sent to your AKGEC email.');
      setLeaderToken('');
      if (leaderTurnstileRef.current) leaderTurnstileRef.current.reset();
    } catch (err) {
      setLeaderError(err.message || 'Failed to send OTP. Please check your network or try again.');
      setLeaderToken('');
      if (leaderTurnstileRef.current) leaderTurnstileRef.current.reset();
    } finally {
      setLeaderLoading(false);
    }
  };

  // 2. Verify OTP for Leader
  const handleVerifyLeaderOtp = async () => {
    const cleanOtp = leaderOtp.trim();
    if (cleanOtp.length !== 6 || !/^\d{6}$/.test(cleanOtp)) {
      setLeaderError('Please enter a valid 6-digit numeric verification code.');
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
      setLeaderSuccess(res.message || 'College email verified successfully!');

      // If team and teammate not yet verified, auto-switch to teammate tab
      if (isTeam && !teammateVerified) {
        setTimeout(() => setActiveTab('teammate'), 1000);
      }
    } catch (err) {
      setLeaderError(err.message || 'Invalid or expired OTP code.');
    } finally {
      setLeaderLoading(false);
    }
  };

  // 3. Send / Resend OTP for Teammate
  const handleSendTeammateOtp = async (isResend = false) => {
    if (!teammateToken) {
      setTeammateError('Security verification (CAPTCHA) is required for Teammate.');
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
      setTeammateSuccess(res.message || 'Verification code sent to Teammate AKGEC email.');
      setTeammateToken('');
      if (teammateTurnstileRef.current) teammateTurnstileRef.current.reset();
    } catch (err) {
      setTeammateError(err.message || 'Failed to send OTP to Teammate.');
      setTeammateToken('');
      if (teammateTurnstileRef.current) teammateTurnstileRef.current.reset();
    } finally {
      setTeammateLoading(false);
    }
  };

  // 4. Verify OTP for Teammate
  const handleVerifyTeammateOtp = async () => {
    const cleanOtp = teammateOtp.trim();
    if (cleanOtp.length !== 6 || !/^\d{6}$/.test(cleanOtp)) {
      setTeammateError('Please enter a valid 6-digit numeric verification code.');
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

  // Check if all required verifications are done
  const allVerified = isTeam ? leaderVerified && teammateVerified : leaderVerified;

  const handleProceedToReview = () => {
    if (!allVerified) return;
    onVerificationComplete({
      leaderVerified,
      teammateVerified: isTeam ? teammateVerified : false,
    });
  };

  return (
    <div className="neo-box p-6 md:p-8 bg-[#FCFAF6] space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b-2 border-black gap-2">
        <div>
          <div className="inline-block bg-black text-white px-2.5 py-0.5 text-[10px] font-mono font-bold tracking-wider uppercase mb-1">
            STEP 02 // SECURITY GATEWAY
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold font-display uppercase tracking-tight text-black">
            INSTITUTIONAL EMAIL VERIFICATION
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-3 py-1 bg-[#F4EFE6] border border-black">
            {isTeam ? 'DUO SQUAD (2 CODES REQUIRED)' : 'SOLO HUNTER (1 CODE)'}
          </span>
        </div>
      </div>

      {/* For Team: Tab Switcher */}
      {isTeam && (
        <div className="flex border-2 border-black bg-white shadow-neo-sm">
          <button
            type="button"
            onClick={() => setActiveTab('leader')}
            className={`flex-1 py-2.5 px-4 text-xs font-mono font-bold flex items-center justify-center gap-2 border-r-2 border-black transition-colors ${
              activeTab === 'leader' ? 'bg-black text-white' : 'hover:bg-gray-100 text-gray-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>1. TEAM LEADER: {formData.leader.fullName.split(' ')[0]}</span>
            {leaderVerified && (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('teammate')}
            className={`flex-1 py-2.5 px-4 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'teammate' ? 'bg-black text-white' : 'hover:bg-gray-100 text-gray-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>2. TEAMMATE: {formData.teammate?.fullName?.split(' ')[0] || 'Member 2'}</span>
            {teammateVerified && (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            )}
          </button>
        </div>
      )}

      {/* LEADER VERIFICATION CARD */}
      {(!isTeam || activeTab === 'leader') && (
        <div className="p-5 border-2 border-black bg-white shadow-neo-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-black/10">
            <div className="space-y-0.5">
              <span className="text-xs font-mono font-bold text-[#FF2E51] tracking-wider uppercase">
                {isTeam ? 'TEAM LEADER' : 'PARTICIPANT'}
              </span>
              <h3 className="text-base font-bold text-black font-display">
                {formData.leader.fullName} ({formData.leader.studentNumber})
              </h3>
            </div>
            {leaderVerified ? (
              <span className="px-3 py-1 bg-emerald-100 border border-emerald-600 text-emerald-800 font-mono text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                VERIFIED
              </span>
            ) : (
              <span className="px-3 py-1 bg-amber-50 border border-amber-500 text-amber-800 font-mono text-xs font-bold">
                PENDING VERIFICATION
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs font-mono bg-gray-50 p-2.5 border border-black/20">
            <Mail className="w-4 h-4 text-gray-500 shrink-0" />
            <span className="text-gray-500">Official College Email:</span>
            <span className="font-bold text-black select-all">{formData.leader.collegeEmail}</span>
          </div>

          {leaderVerified ? (
            <div className="p-4 bg-emerald-50 border-2 border-emerald-500 text-emerald-900 text-xs font-mono space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-sm text-emerald-800">
                <CheckCircle2 className="w-4 h-4" />
                Email Verification Successful!
              </div>
              <p>
                The college email <strong className="underline">{formData.leader.collegeEmail}</strong> has been verified.
                {isTeam && !teammateVerified && ' Please complete verification for your Teammate.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {!leaderOtpSent ? (
                <div className="space-y-3">
                  <p className="text-xs text-gray-600 font-sans">
                    Complete the security CAPTCHA below to dispatch your 6-digit cryptographic verification code to your college email.
                  </p>

                  <TurnstileWidget
                    ref={leaderTurnstileRef}
                    label="Turnstile Security Verification (Leader)"
                    onVerify={(token) => {
                      setLeaderToken(token);
                      setLeaderError('');
                    }}
                    onExpire={() => setLeaderToken('')}
                    onError={() => {
                      setLeaderToken('');
                      setLeaderError('Security CAPTCHA verification failed. Please try again.');
                    }}
                  />

                  {leaderError && (
                    <div className="p-2.5 bg-red-50 border border-[#FF2E51] text-[#FF2E51] text-xs font-mono flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{leaderError}</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => handleSendLeaderOtp(false)}
                    disabled={leaderLoading || !leaderToken}
                    className="w-full neo-button bg-[#FF2E51] text-white py-2.5 text-xs font-mono font-bold tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-[#e02445]"
                  >
                    {leaderLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>DISPATCHING OTP TO {formData.leader.studentNumber}...</span>
                      </>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4" />
                        <span>SEND VERIFICATION OTP</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-mono">
                    <p className="font-bold">A 6-digit verification code has been dispatched!</p>
                    <p className="text-[11px] text-gray-600 mt-0.5">
                      Check your college inbox or spam folder for <span className="font-semibold text-black">{formData.leader.collegeEmail}</span>. Code expires in 5 minutes.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-mono font-bold text-black uppercase">
                      ENTER 6-DIGIT OTP:
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={leaderOtp}
                      onChange={(e) => setLeaderOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="123456"
                      className="w-full p-2.5 border-2 border-black bg-white text-center font-mono text-2xl tracking-[0.4em] font-extrabold focus:outline-none focus:border-[#FF2E51]"
                    />
                  </div>

                  {leaderError && (
                    <div className="p-2.5 bg-red-50 border border-[#FF2E51] text-[#FF2E51] text-xs font-mono flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{leaderError}</span>
                    </div>
                  )}

                  {leaderSuccess && (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-500 text-emerald-800 text-xs font-mono flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{leaderSuccess}</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleVerifyLeaderOtp}
                    disabled={leaderLoading || leaderOtp.trim().length !== 6}
                    className="w-full neo-button bg-black text-white py-2.5 text-xs font-mono font-bold tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-[#FF2E51]"
                  >
                    {leaderLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>VERIFYING CODE...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>VERIFY OTP</span>
                      </>
                    )}
                  </button>

                  {/* Resend Section */}
                  <div className="pt-3 border-t border-gray-200 space-y-2">
                    <p className="text-[11px] text-gray-500 font-mono">
                      Didn't get the email? Complete a fresh CAPTCHA below to resend:
                    </p>
                    <TurnstileWidget
                      ref={leaderTurnstileRef}
                      label="Security Verification for Resend"
                      onVerify={(token) => setLeaderToken(token)}
                      onExpire={() => setLeaderToken('')}
                      onError={() => setLeaderToken('')}
                    />
                    <button
                      type="button"
                      onClick={() => handleSendLeaderOtp(true)}
                      disabled={leaderLoading || leaderCooldown > 0 || !leaderToken}
                      className="text-xs font-mono font-bold text-gray-700 hover:text-[#FF2E51] underline disabled:opacity-50 disabled:no-underline"
                    >
                      {leaderCooldown > 0 ? `Resend OTP available in ${leaderCooldown}s` : 'Resend Verification Code'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TEAMMATE VERIFICATION CARD (FOR DUO TEAMS) */}
      {isTeam && activeTab === 'teammate' && (
        <div className="p-5 border-2 border-black bg-white shadow-neo-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-black/10">
            <div className="space-y-0.5">
              <span className="text-xs font-mono font-bold text-[#FF2E51] tracking-wider uppercase">
                TEAMMATE (MEMBER 2)
              </span>
              <h3 className="text-base font-bold text-black font-display">
                {formData.teammate.fullName} ({formData.teammate.studentNumber})
              </h3>
            </div>
            {teammateVerified ? (
              <span className="px-3 py-1 bg-emerald-100 border border-emerald-600 text-emerald-800 font-mono text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                VERIFIED
              </span>
            ) : (
              <span className="px-3 py-1 bg-amber-50 border border-amber-500 text-amber-800 font-mono text-xs font-bold">
                PENDING VERIFICATION
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs font-mono bg-gray-50 p-2.5 border border-black/20">
            <Mail className="w-4 h-4 text-gray-500 shrink-0" />
            <span className="text-gray-500">Official College Email:</span>
            <span className="font-bold text-black select-all">{formData.teammate.collegeEmail}</span>
          </div>

          {teammateVerified ? (
            <div className="p-4 bg-emerald-50 border-2 border-emerald-500 text-emerald-900 text-xs font-mono space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-sm text-emerald-800">
                <CheckCircle2 className="w-4 h-4" />
                Teammate Verification Successful!
              </div>
              <p>
                The college email <strong className="underline">{formData.teammate.collegeEmail}</strong> has been verified.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {!teammateOtpSent ? (
                <div className="space-y-3">
                  <p className="text-xs text-gray-600 font-sans">
                    Complete the security CAPTCHA below to dispatch the 6-digit verification code to the Teammate's college email.
                  </p>

                  <TurnstileWidget
                    ref={teammateTurnstileRef}
                    label="Turnstile Security Verification (Teammate)"
                    onVerify={(token) => {
                      setTeammateToken(token);
                      setTeammateError('');
                    }}
                    onExpire={() => setTeammateToken('')}
                    onError={() => {
                      setTeammateToken('');
                      setTeammateError('Security CAPTCHA verification failed for teammate.');
                    }}
                  />

                  {teammateError && (
                    <div className="p-2.5 bg-red-50 border border-[#FF2E51] text-[#FF2E51] text-xs font-mono flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{teammateError}</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => handleSendTeammateOtp(false)}
                    disabled={teammateLoading || !teammateToken}
                    className="w-full neo-button bg-[#FF2E51] text-white py-2.5 text-xs font-mono font-bold tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-[#e02445]"
                  >
                    {teammateLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>DISPATCHING OTP TO {formData.teammate.studentNumber}...</span>
                      </>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4" />
                        <span>SEND VERIFICATION OTP TO TEAMMATE</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-mono">
                    <p className="font-bold">A 6-digit code has been dispatched to Teammate!</p>
                    <p className="text-[11px] text-gray-600 mt-0.5">
                      Ask your teammate to check <span className="font-semibold text-black">{formData.teammate.collegeEmail}</span>. Code expires in 5 minutes.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-mono font-bold text-black uppercase">
                      ENTER TEAMMATE'S 6-DIGIT OTP:
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={teammateOtp}
                      onChange={(e) => setTeammateOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="123456"
                      className="w-full p-2.5 border-2 border-black bg-white text-center font-mono text-2xl tracking-[0.4em] font-extrabold focus:outline-none focus:border-[#FF2E51]"
                    />
                  </div>

                  {teammateError && (
                    <div className="p-2.5 bg-red-50 border border-[#FF2E51] text-[#FF2E51] text-xs font-mono flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{teammateError}</span>
                    </div>
                  )}

                  {teammateSuccess && (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-500 text-emerald-800 text-xs font-mono flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{teammateSuccess}</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleVerifyTeammateOtp}
                    disabled={teammateLoading || teammateOtp.trim().length !== 6}
                    className="w-full neo-button bg-black text-white py-2.5 text-xs font-mono font-bold tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-[#FF2E51]"
                  >
                    {teammateLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>VERIFYING CODE...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>VERIFY TEAMMATE OTP</span>
                      </>
                    )}
                  </button>

                  {/* Resend Section */}
                  <div className="pt-3 border-t border-gray-200 space-y-2">
                    <p className="text-[11px] text-gray-500 font-mono">
                      Didn't receive the email? Complete a fresh CAPTCHA below to resend:
                    </p>
                    <TurnstileWidget
                      ref={teammateTurnstileRef}
                      label="Security Verification for Teammate Resend"
                      onVerify={(token) => setTeammateToken(token)}
                      onExpire={() => setTeammateToken('')}
                      onError={() => setTeammateToken('')}
                    />
                    <button
                      type="button"
                      onClick={() => handleSendTeammateOtp(true)}
                      disabled={teammateLoading || teammateCooldown > 0 || !teammateToken}
                      className="text-xs font-mono font-bold text-gray-700 hover:text-[#FF2E51] underline disabled:opacity-50 disabled:no-underline"
                    >
                      {teammateCooldown > 0 ? `Resend OTP in ${teammateCooldown}s` : 'Resend Verification Code to Teammate'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Navigation Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t-2 border-black/10">
        <button
          type="button"
          onClick={onBack}
          className="neo-button bg-white text-black px-5 py-2.5 text-xs font-mono font-bold tracking-wider uppercase flex items-center gap-2 hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO DETAILS</span>
        </button>

        <button
          type="button"
          onClick={handleProceedToReview}
          disabled={!allVerified}
          className={`neo-button px-6 py-2.5 text-xs font-mono font-bold tracking-wider uppercase flex items-center gap-2 ${
            allVerified
              ? 'bg-[#FF2E51] text-white hover:bg-[#e02445]'
              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
          }`}
        >
          <span>CONTINUE TO REVIEW</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default OtpVerificationStep;
