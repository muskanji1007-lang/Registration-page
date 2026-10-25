import React, { useEffect, useRef, useImperativeHandle, forwardRef, useState } from 'react';
import { ShieldCheck, RefreshCw, AlertCircle } from 'lucide-react';
import { DEFAULT_TURNSTILE_SITE_KEY } from '../utils/constants';

const TurnstileWidget = forwardRef(({ onVerify, onExpire, onError, label = 'Security Verification' }, ref) => {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const [loadError, setLoadError] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || DEFAULT_TURNSTILE_SITE_KEY;

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

  useEffect(() => {
    let timerId = null;
    let attempts = 0;

    const renderWidget = () => {
      if (window.turnstile && containerRef.current && widgetIdRef.current === null) {
        try {
          widgetIdRef.current = window.turnstile.render(containerRef.current, {
            sitekey: siteKey,
            action: 'otp_send',
            theme: 'light',
            callback: (token) => {
              setIsVerified(true);
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
      }
    };

    if (window.turnstile) {
      renderWidget();
    } else {
      timerId = setInterval(() => {
        attempts += 1;
        if (window.turnstile) {
          clearInterval(timerId);
          renderWidget();
        } else if (attempts > 30) {
          // If script takes > 3 seconds or blocked by adblock
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
  }, [siteKey]);

  return (
    <div className="my-3 p-3 bg-white border-2 border-black shadow-neo-sm rounded-sm">
      <div className="flex items-center justify-between mb-2 pb-1 border-b border-gray-200">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-700">
          <ShieldCheck className="w-4 h-4 text-[#FF2E51]" />
          <span>{label}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-mono px-1.5 py-0.5 bg-gray-100 border border-black/40 rounded text-gray-600">
            Cloudflare Turnstile
          </span>
          {isVerified && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-500 font-bold">
              VERIFIED
            </span>
          )}
        </div>
      </div>

      <div ref={containerRef} className="min-h-[65px] flex items-center justify-center" />

      {loadError && (
        <div className="mt-2 text-xs p-2.5 bg-amber-50 border-2 border-amber-400 text-amber-900 rounded">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">Cloudflare Widget Unreachable</p>
              <p className="text-[11px] text-gray-700">
                If you have an AdBlocker enabled or are offline, you can use the dummy test token for local testing.
              </p>
              <button
                type="button"
                onClick={() => {
                  const dummyToken = `0.X_mock_dummy_token_${Date.now()}`;
                  setIsVerified(true);
                  if (onVerify) onVerify(dummyToken);
                }}
                className="mt-1 px-2.5 py-1 text-[11px] bg-black text-white font-mono hover:bg-[#FF2E51] transition-colors"
              >
                Use Development Test Token (1x000)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default TurnstileWidget;
