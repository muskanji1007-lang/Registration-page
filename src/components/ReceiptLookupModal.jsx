import React, { useState } from 'react';
import { X, Search, RefreshCw, AlertCircle, CheckCircle2, Ticket, Printer } from 'lucide-react';
import { apiService } from '../services/apiService';

export const ReceiptLookupModal = ({ isOpen, onClose }) => {
  const [regId, setRegId] = useState('');
  const [studentNum, setStudentNum] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [receipt, setReceipt] = useState(null);

  if (!isOpen) return null;

  const handleLookup = async (e) => {
    e.preventDefault();
    if (!regId.trim() || !studentNum.trim()) {
      setError('Please provide both Registration ID and Student Number.');
      return;
    }

    setLoading(true);
    setError('');
    setReceipt(null);

    try {
      const res = await apiService.getRegistrationReceipt(regId.trim(), studentNum.trim());
      if (res?.registration) {
        setReceipt(res.registration);
      } else {
        setReceipt(res);
      }
    } catch (err) {
      setError(err.message || 'Could not find registration with the provided details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="neo-box-xl bg-[#FCFAF6] max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-black">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-[#FF2E51]" />
            <h3 className="font-display font-extrabold text-base uppercase text-black">
              LOOKUP REGISTRATION PASS
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-black hover:text-white border-2 border-black transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Form */}
        <form onSubmit={handleLookup} className="space-y-3 font-mono text-xs">
          <div>
            <label className="block font-bold text-gray-700 uppercase mb-1">
              Registration ID (e.g. REG-839201-B12A):
            </label>
            <input
              type="text"
              value={regId}
              onChange={(e) => setRegId(e.target.value)}
              placeholder="REG-XXXXXX-XXXX"
              className="w-full p-2 border-2 border-black bg-white focus:outline-none focus:border-[#FF2E51]"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase mb-1">
              Student Number (24/25):
            </label>
            <input
              type="text"
              value={studentNum}
              onChange={(e) => setStudentNum(e.target.value.replace(/\D/g, ''))}
              placeholder="e.g. 2512213"
              className="w-full p-2 border-2 border-black bg-white focus:outline-none focus:border-[#FF2E51]"
            />
          </div>

          {error && (
            <div className="p-2.5 bg-red-50 border border-[#FF2E51] text-[#FF2E51] flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full neo-button bg-black text-white py-2 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-[#FF2E51]"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>SEARCHING DATABASE...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>RETRIEVE PASS</span>
              </>
            )}
          </button>
        </form>

        {/* Result Card */}
        {receipt && (
          <div className="p-4 bg-white border-2 border-black shadow-neo-sm space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-black/10">
              <span className="font-extrabold text-[#FF2E51] text-sm">
                {receipt.registrationId}
              </span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-500 font-bold">
                {receipt.registrationStatus || 'CONFIRMED'}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-gray-500 uppercase block">Squad Name</span>
              <span className="font-bold text-sm text-black">{receipt.teamName}</span>
            </div>

            <div>
              <span className="text-[10px] text-gray-500 uppercase block">Leader</span>
              <span className="font-bold text-black">
                {receipt.teamLeader?.fullName || receipt.members?.[0]?.fullName} (
                {receipt.teamLeader?.studentNumber || receipt.members?.[0]?.studentNumber})
              </span>
            </div>

            <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
              <span className="text-[10px] text-gray-500">Venue: CCC Lab, 3rd Floor</span>
              <button
                type="button"
                onClick={() => window.print()}
                className="neo-button bg-white text-black px-2.5 py-1 text-[11px] font-bold flex items-center gap-1 hover:bg-gray-100"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>PRINT</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceiptLookupModal;
