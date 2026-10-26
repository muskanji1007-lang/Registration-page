import React, { useState, useEffect } from 'react';
import { User, Menu, X, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react';
import CccLogo from './CccLogo';
import { apiService } from '../services/apiService';

export const Navbar = ({ activePage, setActivePage, onAdminClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking'); // 'online' | 'offline' | 'checking'

  useEffect(() => {
    let isMounted = true;
    apiService
      .getHealth()
      .then((res) => {
        if (isMounted) {
          if (res?.status === 'healthy' || res?.database) {
            setBackendStatus('online');
          } else {
            setBackendStatus('offline');
          }
        }
      })
      .catch(() => {
        if (isMounted) {
          setBackendStatus('offline');
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const navItems = [
    { id: 'home', label: 'HOME' },
    { id: 'about', label: 'ABOUT' },
    { id: 'rules', label: 'RULES' },
    { id: 'faq', label: 'FAQ' },
  ];

  return (
    <header className="w-full bg-[#F6F3EB] border-b-2 border-black/10 sticky top-0 z-40">
      {/* Top Banner Notice */}
      <div className="max-w-6xl mx-auto px-4 pt-3 pb-1">
        <div className="flex items-center justify-between py-2 border-b-2 border-black">
          {/* Logo Brand */}
          <button
            onClick={() => setActivePage('home')}
            className="flex items-center gap-2.5 group text-left"
          >
            <CccLogo className="w-8 h-8 transition-transform group-hover:rotate-12" />
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-black font-display">
                DEBUGX
              </span>
              <span className="text-sm font-bold text-[#FF2E51] font-mono">//</span>
            </div>
          </button>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`text-xs font-mono font-bold tracking-wider transition-all ${
                    isActive
                      ? 'bg-black text-white px-3 py-1 border border-black shadow-neo-sm'
                      : 'text-gray-700 hover:text-black py-1 px-2 hover:bg-black/5'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right CTA and Icons */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Backend Health Badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 text-[11px] font-mono border border-black/30 bg-white">
              <span
                className={`w-2 h-2 rounded-full ${
                  backendStatus === 'online'
                    ? 'bg-emerald-500 animate-pulse'
                    : backendStatus === 'checking'
                    ? 'bg-yellow-400'
                    : 'bg-[#FF2E51]'
                }`}
              />
              <span className="text-[10px] text-gray-700 font-semibold uppercase">
                {backendStatus === 'online'
                  ? 'API ONLINE'
                  : backendStatus === 'checking'
                  ? 'API CHECK'
                  : 'API OFFLINE'}
              </span>
            </div>

            {/* Register CTA */}
            {activePage !== 'register' ? (
              <button
                onClick={() => setActivePage('register')}
                className="neo-button bg-[#FF2E51] text-white px-2.5 sm:px-4 py-1.5 text-[11px] sm:text-xs font-mono tracking-wider uppercase flex items-center gap-1.5 hover:bg-[#e02445] whitespace-nowrap"
              >
                <span className="hidden sm:inline">REGISTER NOW</span>
                <span className="sm:hidden">REGISTER</span>
              </button>
            ) : (
              <button
                onClick={() => setActivePage('home')}
                className="neo-button bg-white text-black px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-mono tracking-wider uppercase flex items-center gap-1.5 hover:bg-gray-50"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>HOME</span>
              </button>
            )}

            {/* Admin / Desk Icon */}
            <button
              onClick={onAdminClick}
              title="Receipt / Ticket Lookup"
              className="p-1.5 border-2 border-black bg-white hover:bg-gray-100 shadow-neo-sm transition-all"
            >
              <User className="w-4 h-4 text-black" />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 border-2 border-black bg-white shadow-neo-sm"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Subtle decorative divider notch */}
        <div className="flex items-center justify-center -mt-[5px]">
          <div className="w-2.5 h-2.5 bg-black rotate-45 border border-white" />
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b-2 border-black px-4 py-3 shadow-lg">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left py-2 px-3 text-xs font-mono font-bold tracking-wider ${
                  activePage === item.id ? 'bg-black text-white' : 'hover:bg-gray-100 text-gray-800'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-2 border-t border-gray-200">
              <button
                onClick={() => {
                  setActivePage('register');
                  setMobileMenuOpen(false);
                }}
                className="w-full neo-button bg-[#FF2E51] text-white py-2 text-xs font-mono font-bold uppercase tracking-wider text-center"
              >
                REGISTER NOW FOR DEBUGX
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
