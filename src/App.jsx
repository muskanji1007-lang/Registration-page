import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import RegistrationPage from './pages/RegistrationPage';
import RulesPage from './pages/RulesPage';
import FaqPage from './pages/FaqPage';
import ReceiptLookupModal from './components/ReceiptLookupModal';

export const App = () => {
  const [activePage, setActivePage] = useState('home');
  const [isLookupOpen, setIsLookupOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F6F3EB] text-[#000000] flex flex-col justify-between selection:bg-[#FF2E51] selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        onAdminClick={() => setIsLookupOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-12">
        {activePage === 'home' && (
          <HomePage
            onRegisterClick={() => {
              setActivePage('register');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onRulesClick={() => {
              setActivePage('rules');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activePage === 'about' && (
          <AboutPage
            onRegisterClick={() => {
              setActivePage('register');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onRulesClick={() => {
              setActivePage('rules');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activePage === 'register' && (
          <RegistrationPage
            onHome={() => {
              setActivePage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activePage === 'rules' && (
          <RulesPage
            onRegisterClick={() => {
              setActivePage('register');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onHome={() => {
              setActivePage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activePage === 'faq' && (
          <FaqPage
            onRegisterClick={() => {
              setActivePage('register');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onHome={() => {
              setActivePage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Receipt Lookup Modal */}
      <ReceiptLookupModal
        isOpen={isLookupOpen}
        onClose={() => setIsLookupOpen(false)}
      />

      {/* Retro Neobrutalist Footer */}
      <footer className="w-full bg-[#FCFAF6] border-t-2 border-black py-6 px-4 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs text-gray-700">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#FF2E51]" />
            <span className="font-bold text-black uppercase">
              DeBugX 2026 // Bug Hunting Challenge
            </span>
          </div>

          <div className="text-center md:text-right text-[11px] space-y-0.5">
            <p className="font-semibold text-black">
              Hosted by Cloud Computing Cell (CCC)
            </p>
            <p className="text-gray-500">
              Ajay Kumar Garg Engineering College, Ghaziabad • 100% Free Entry
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
