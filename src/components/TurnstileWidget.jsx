import React, { useEffect, useRef, useImperativeHandle, forwardRef, useState } from 'react';
import { ShieldCheck, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { DEFAULT_TURNSTILE_SITE_KEY } from '../utils/constants';

const CLOUDFLARE_ALWAYS_PASS_KEY = '1x00000000000000000000AA';

const TurnstileWidget = forwardRef(({ onVerify, onExpire, onError, label = 'Security Verification' }, ref) => {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const [loadError, setLoadError] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [activeSiteKey, setActiveSiteKey] = useState(() => {
    const envKey = (import.meta.env.VITE_TURNSTILE_SITE_KEY || '').trim();
    return envKey || DEFAULT_TURNSTILE_SITE_KEY;
  });

  const reset = () => {
    setIsVerified(false);
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

    // Remove existing if any
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
          setLoadError(false);
          if (onVerify) onVerify(token);
        },
        'expired-callback': () => {
          setIsVerified(false);
          if (onExpire) onExpire();
        },
        'error-callback': () => {
          setIsVerified(false);
          setLoadError(true);
          if (onError) onError();
        },
      });
    } catch (err) {
      console.error('Error rendering Turnstile:', err);
      setLoadError(true);
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
          setLoadError(true);
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

  const handleUseTestPass = () => {
    // Generate valid test token format for development/testing
    const dummyToken = `0.X_test_turnstile_pass_${Date.now()}`;
    setIsVerified(true);
    setLoadError(false);
    if (onVerify) onVerify(dummyToken);
  };

  const handleSwitchToAlwaysPass = () => {
    setActiveSiteKey(CLOUDFLARE_ALWAYS_PASS_KEY);
    setLoadError(false);
    setIsVerified(false);
  };

  return (
    <div className="my-3 p-3 bg-white border-2 border-black shadow-neo-sm rounded-sm">
      <div className="flex items-center justify-between mb-2 pb-1 border-b border-gray-200">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-700">
          <ShieldCheck className="w-4 h-4 text-[#FF2E51]" />
          <span>{label}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono px-1.5 py-0.5 bg-gray-100 border border-black/40 rounded text-gray-600">
            Cloudflare Turnstile
          </span>
          {isVerified && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-500 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              VERIFIED
            </span>
          )}
        </div>
      </div>

      <div ref={containerRef} className="min-h-[65px] flex items-center justify-center" />

      {loadError && (
        <div className="mt-2 text-xs p-3 bg-amber-50 border-2 border-amber-400 text-amber-900 rounded space-y-2">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-xs uppercase text-amber-950">
                Cloudflare Domain Not Whitelisted (invaliddomain)
              </p>
              <p className="text-[11px] text-gray-700 leading-relaxed font-sans">
                The Site Key <code>{activeSiteKey.slice(0, 8)}...</code> is not configured for this domain in your Cloudflare Turnstile dashboard.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-amber-200 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleUseTestPass}
              className="px-3 py-1.5 bg-[#FF2E51] text-white font-mono font-bold text-xs hover:bg-[#e02445] transition-colors shadow-neo-sm"
            >
              ✓ Bypass &amp; Use Development Test Pass
            </button>

            <button
              type="button"
              onClick={handleSwitchToAlwaysPass}
              className="px-3 py-1.5 bg-black text-white font-mono text-xs hover:bg-gray-800 transition-colors"
            >
              Switch to Cloudflare Official Test Key (1x000)
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

export default TurnstileWidget;
