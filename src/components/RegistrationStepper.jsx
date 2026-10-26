import React from 'react';

export const RegistrationStepper = ({ currentStep, isTeam }) => {
  const steps = isTeam
    ? [
        { num: 1, title: 'LEADER DETAILS' },
        { num: 2, title: 'TEAMMATE DETAILS' },
        { num: 3, title: 'VERIFY EMAIL' },
        { num: 4, title: 'TICKET PASS' },
      ]
    : [
        { num: 1, title: 'CANDIDATE DETAILS' },
        { num: 2, title: 'VERIFY EMAIL' },
        { num: 3, title: 'TICKET PASS' },
      ];

  const gridCols = isTeam ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-1 sm:grid-cols-3';

  return (
    <div className={`grid ${gridCols} gap-2 border-2 border-black p-1.5 bg-[#F6F3EB] shadow-neo-sm`}>
      {steps.map((st) => {
        const isActive = st.num === currentStep;
        const isDone = st.num < currentStep;

        return (
          <div
            key={st.num}
            className={`p-2.5 border-2 transition-all flex items-center gap-2.5 ${
              isActive
                ? 'border-black bg-[#FCFAF6] shadow-neo-sm ring-1 ring-black'
                : isDone
                ? 'border-black bg-black text-white shadow-neo-sm'
                : 'border-black/30 bg-[#FCFAF6]/60 text-gray-500'
            }`}
          >
            <div
              className={`w-6 h-6 shrink-0 flex items-center justify-center font-mono font-bold text-xs ${
                isActive
                  ? 'bg-[#FF2E51] text-white'
                  : isDone
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-200 text-black'
              }`}
            >
              {isDone ? '✓' : st.num}
            </div>
            <div className="leading-tight overflow-hidden">
              <div
                className={`text-[11px] font-mono font-bold tracking-tight uppercase truncate ${
                  isActive ? 'text-black' : isDone ? 'text-white' : 'text-gray-700'
                }`}
              >
                {st.title}
              </div>
              <div
                className={`text-[9px] font-mono truncate ${
                  isActive
                    ? 'text-[#FF2E51] font-semibold'
                    : isDone
                    ? 'text-gray-300'
                    : 'text-gray-400'
                }`}
              >
                {isActive ? 'Active Step' : isDone ? 'Completed' : 'Pending'}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RegistrationStepper;
