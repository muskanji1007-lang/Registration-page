import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import RegistrationPage from './pages/RegistrationPage';
import RulesPage from './pages/RulesPage';
import FaqPage from './pages/FaqPage';
import ReceiptLookupModal from './components/ReceiptLookupModal';
import DebugXLogo from './components/DebugXLogo';

export const App = () => {
  const [activePage, setActivePage] = useState('home');
  const [isLookupOpen, setIsLookupOpen] = useState(false);

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#F6F3EB] text-[#000000] flex flex-col justify-between selection:bg-[#FF2E51] selection:text-white">
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

      {/* Footer - Minimal DeBugX Only */}
      <footer className="w-full bg-[#FCFAF6] border-t-2 border-black py-5 px-4 mt-auto">
        <div className="max-w-6xl mx-auto flex items-center justify-center">
          <DebugXLogo size="sm" />
        </div>
      </footer>
    </div>
  );
};

export default App;
