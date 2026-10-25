import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, ArrowRight, ArrowLeft, RefreshCw, Shield, User, Users, Award, Mail, Phone, MapPin } from 'lucide-react';
import { apiService } from '../services/apiService';

export const ReviewStep = ({
  formData,
  onConfirmedSubmit,
  onBack,
}) => {
  const isTeam = formData.registrationType === 'team';
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewData, setReviewData] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Format payload according to Backend README specification
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

    // Solo payload (flat format)
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

  // Perform pre-flight review check on mount
  useEffect(() => {
    let isMounted = true;
    const payload = buildPayload();

    setReviewLoading(true);
    setReviewError('');

    apiService
      .reviewRegistration(payload)
      .then((res) => {
        if (isMounted) {
          setReviewSuccess(true);
          setReviewData(res.reviewData || res);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setReviewError(err.message || 'Validation failed during pre-flight review.');
        }
      })
      .finally(() => {
        if (isMounted) {
          setReviewLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Submit final registration
  const handleSubmit = async () => {
    setSubmitting(true);
    setReviewError('');

    try {
      const payload = buildPayload();
      const res = await apiService.submitRegistration(payload);
      onConfirmedSubmit(res.registration || res);
    } catch (err) {
      setReviewError(err.message || 'Registration submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="neo-box p-6 md:p-8 bg-[#FCFAF6] space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b-2 border-black gap-2">
        <div>
          <div className="inline-block bg-black text-white px-2.5 py-0.5 text-[10px] font-mono font-bold tracking-wider uppercase mb-1">
            STEP 03 // PRE-FLIGHT AUDIT
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold font-display uppercase tracking-tight text-black">
            REVIEW REGISTRATION DETAILS
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-3 py-1 bg-emerald-100 text-emerald-900 border border-black shadow-neo-sm">
            FEE: ₹0 (100% FREE)
          </span>
        </div>
      </div>

      {/* Loading state for review */}
      {reviewLoading && (
        <div className="p-6 bg-white border-2 border-black shadow-neo-sm text-center space-y-2">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#FF2E51]" />
          <p className="text-xs font-mono font-bold text-gray-700 uppercase">
            AUDITING REGISTRATION PARAMETERS AGAINST DATABASE...
          </p>
        </div>
      )}

      {/* Review Error alert */}
      {reviewError && (
        <div className="p-4 bg-red-50 border-2 border-[#FF2E51] text-red-900 text-xs font-mono space-y-2">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-[#FF2E51] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm text-[#FF2E51]">Validation or Collision Error</p>
              <p className="mt-1 leading-relaxed">{reviewError}</p>
            </div>
          </div>
          <p className="text-[11px] text-gray-600">
            If your student number or team name has already been registered, please return to edit the details.
          </p>
        </div>
      )}

      {/* Team / Solo Summary Card */}
      <div className="p-4 bg-[#F4EFE6] border-2 border-black shadow-neo-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider">
            SQUAD DESIGNATION
          </span>
          <h3 className="text-lg font-bold font-display text-black">
            {formData.teamName}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-2.5 py-1 bg-black text-white uppercase">
            {isTeam ? 'DUO SQUAD (2 MEMBERS)' : 'SOLO HUNTER (1 MEMBER)'}
          </span>
          <span className="text-xs font-mono font-bold px-2.5 py-1 bg-emerald-600 text-white flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            VERIFIED
          </span>
        </div>
      </div>

      {/* Candidate 1: Team Leader */}
      <div className="p-5 border-2 border-black bg-white shadow-neo-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-black/10">
          <div className="flex items-center gap-2">
            <span className="p-1 bg-[#FF2E51] text-white">
              <User className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold text-black uppercase">
              {isTeam ? '1. TEAM LEADER' : 'PARTICIPANT DETAILS'}
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-500 font-bold">
            EMAIL VERIFIED
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs font-mono">
          <div>
            <span className="text-gray-500 block text-[10px] uppercase">Full Name</span>
            <span className="font-bold text-black text-sm">{formData.leader.fullName}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-[10px] uppercase">Student Roll No</span>
            <span className="font-bold text-black text-sm">{formData.leader.studentNumber}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-[10px] uppercase">Branch &amp; Section</span>
            <span className="font-bold text-black">{formData.leader.branch}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-[10px] uppercase">Verified AKGEC Email</span>
            <span className="font-bold text-black break-all">{formData.leader.collegeEmail}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-[10px] uppercase">Phone / WhatsApp</span>
            <span className="font-bold text-black">{formData.leader.phone}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-[10px] uppercase">Gender &amp; Residence</span>
            <span className="font-bold text-black">
              {formData.leader.gender} • {formData.leader.residence}
            </span>
          </div>
        </div>
      </div>

      {/* Candidate 2: Teammate (If Duo Squad) */}
      {isTeam && formData.teammate && (
        <div className="p-5 border-2 border-black bg-white shadow-neo-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-black/10">
            <div className="flex items-center gap-2">
              <span className="p-1 bg-black text-white">
                <Users className="w-4 h-4" />
              </span>
              <span className="text-xs font-mono font-bold text-black uppercase">
                2. TEAMMATE (MEMBER 2)
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-500 font-bold">
              EMAIL VERIFIED
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs font-mono">
            <div>
              <span className="text-gray-500 block text-[10px] uppercase">Full Name</span>
              <span className="font-bold text-black text-sm">{formData.teammate.fullName}</span>
            </div>
            <div>
              <span className="text-gray-500 block text-[10px] uppercase">Student Roll No</span>
              <span className="font-bold text-black text-sm">{formData.teammate.studentNumber}</span>
            </div>
            <div>
              <span className="text-gray-500 block text-[10px] uppercase">Branch &amp; Section</span>
              <span className="font-bold text-black">{formData.teammate.branch}</span>
            </div>
            <div>
              <span className="text-gray-500 block text-[10px] uppercase">Verified AKGEC Email</span>
              <span className="font-bold text-black break-all">{formData.teammate.collegeEmail}</span>
            </div>
            <div>
              <span className="text-gray-500 block text-[10px] uppercase">Phone / WhatsApp</span>
              <span className="font-bold text-black">{formData.teammate.phone}</span>
            </div>
            <div>
              <span className="text-gray-500 block text-[10px] uppercase">Gender &amp; Residence</span>
              <span className="font-bold text-black">
                {formData.teammate.gender} • {formData.teammate.residence}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Rules Notice */}
      <div className="p-3 bg-amber-50 border border-amber-300 text-amber-900 text-xs font-mono flex items-start gap-2">
        <Shield className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Confirmation Email Protocol:</p>
          <p className="text-[11px] text-gray-700">
            The official confirmation ticket will be dispatched <strong>strictly to the Team Leader</strong> ({formData.leader.collegeEmail}). Teammates will participate under the Leader's registration credentials.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t-2 border-black/10">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="neo-button bg-white text-black px-5 py-2.5 text-xs font-mono font-bold tracking-wider uppercase flex items-center gap-2 hover:bg-gray-100 disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>EDIT DETAILS</span>
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting || reviewLoading || Boolean(reviewError)}
          className="neo-button bg-[#FF2E51] text-white px-7 py-3 text-xs sm:text-sm font-mono font-bold tracking-wider uppercase flex items-center gap-2 hover:bg-[#e02445] disabled:opacity-50"
        >
          {submitting ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>RECORDING REGISTRATION IN DATABASE...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>CONFIRM &amp; COMPLETE REGISTRATION</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ReviewStep;
