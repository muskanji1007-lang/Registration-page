import React, { useEffect, useRef, useImperativeHandle, forwardRef, useState } from 'react';
import { ShieldCheck, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { DEFAULT_TURNSTILE_SITE_KEY } from '../utils/constants';

const TurnstileWidget = forwardRef(({ onVerify, onSuccess, onExpire, onError, label = 'Security Verification' }, ref) => {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  // Active site key strictly from env or project constants - NO dummy test bypass
  const activeSiteKey = ((import.meta.env.VITE_TURNSTILE_SITE_KEY || '').trim()) || DEFAULT_TURNSTILE_SITE_KEY;

  const reset = () => {
    setIsVerified(false);
    setIsExpired(false);
    setErrorMessage(null);
    if (window.turnstile && widgetIdRef.current !== null) {
      try {
        window.turnstile.reset(widgetIdRef.current);
      } catch (err) {
        console.warn('Turnstile reset error:', err);
      }
    }
  };

  useImperativeHandle(ref, () => ({
    reset,
  }));

  const renderWidget = () => {
    if (!window.turnstile || !containerRef.current) return;

    // Clean up existing instance before re-rendering
    if (widgetIdRef.current !== null) {
      try {
        window.turnstile.remove(widgetIdRef.current);
      } catch (_) {}
      widgetIdRef.current = null;
    }

    try {
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: activeSiteKey,
        action: 'otp_send',
        theme: 'light',
        callback: (token) => {
          setIsVerified(true);
          setIsExpired(false);
          setErrorMessage(null);
          if (onVerify) onVerify(token);
          if (onSuccess) onSuccess(token);
        },
        'expired-callback': () => {
          setIsVerified(false);
          setIsExpired(true);
          setErrorMessage('Verification expired. Please re-check the security box.');
          if (onExpire) onExpire();
        },
        'error-callback': (errorCode) => {
          setIsVerified(false);
          let friendlyMsg = `Cloudflare security challenge failed (Code: ${errorCode || 'unknown'}).`;
          if (errorCode === '110200') {
            friendlyMsg = `Domain Authorization Error (110200): "${window.location.hostname}" is not added to allowed hostnames in Cloudflare Turnstile dashboard.`;
          } else if (errorCode === '300030') {
            friendlyMsg = 'Verification challenge timed out. Please click Reload below.';
          }
          setErrorMessage(friendlyMsg);
          if (onError) onError(friendlyMsg, errorCode);
        },
      });
    } catch (err) {
      console.error('Error rendering Turnstile:', err);
      setErrorMessage(err.message || 'Failed to initialize security verification widget.');
    }
  };

  useEffect(() => {
    let timerId = null;
    let attempts = 0;

    if (window.turnstile) {
      renderWidget();
    } else {
      timerId = setInterval(() => {
        attempts += 1;
        if (window.turnstile) {
          clearInterval(timerId);
          renderWidget();
        } else if (attempts > 30) {
          clearInterval(timerId);
          setErrorMessage('Cloudflare Turnstile script failed to load. Please check your network or adblocker.');
        }
      }, 100);
    }

    return () => {
      if (timerId) clearInterval(timerId);
      if (window.turnstile && widgetIdRef.current !== null) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (_) {}
        widgetIdRef.current = null;
      }
    };
  }, [activeSiteKey]);

  return (
    <div className="my-3 p-4 bg-white border-2 border-black shadow-neo-sm rounded-sm">
      {/* Header with Title & Status */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-black">
          <ShieldCheck className="w-4 h-4 text-[#FF2E51]" />
          <span>{label}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono px-2 py-0.5 bg-gray-100 border border-black/40 rounded text-gray-700">
            Cloudflare Turnstile
          </span>
          {isVerified ? (
            <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-600 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              VERIFIED
            </span>
          ) : isExpired ? (
            <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-600 font-bold">
              EXPIRED
            </span>
          ) : errorMessage ? (
            <span className="text-[10px] font-mono px-2 py-0.5 bg-red-100 text-red-800 border border-red-600 font-bold">
              ERROR
            </span>
          ) : (
            <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-400 font-bold">
              PENDING
            </span>
          )}
        </div>
      </div>

      {/* Centered Turnstile Widget Container */}
      <div className="w-full flex justify-center items-center py-2 text-center overflow-x-auto min-h-[70px]">
        <div
          ref={containerRef}
          className="flex items-center justify-center mx-auto text-center [&>div]:mx-auto [&>iframe]:mx-auto"
        />
      </div>

      {/* Clear error feedback if challenge fails or domain not authorized */}
      {errorMessage && (
        <div className="mt-3 text-xs p-3 bg-red-50 border-2 border-[#FF2E51] text-red-900 rounded space-y-2 text-center">
          <div className="flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#FF2E51] shrink-0" />
            <p className="font-bold text-xs uppercase text-red-950">
              Security Challenge Notice
            </p>
          </div>
          <p className="text-[11px] text-gray-800 font-mono leading-relaxed">
            {errorMessage}
          </p>
          <button
            type="button"
            onClick={reset}
            className="w-full sm:w-auto px-4 py-1.5 bg-black text-white font-mono font-bold text-xs hover:bg-gray-800 transition-colors shadow-neo-sm inline-flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload Security Challenge</span>
          </button>
        </div>
      )}
    </div>
  );
});

export default TurnstileWidget;
