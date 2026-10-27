import React from 'react';

export const RegistrationStepper = ({ currentStep = 1 }) => {
  const steps = [
    { num: 1, title: 'REGISTRATION & VERIFICATION' },
    { num: 2, title: 'CONFIRMED PASS' },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 border-2 border-black dark:border-[#2E2E2E] p-1.5 bg-[#F6F3EB] dark:bg-[#000000] shadow-neo-sm">
      {steps.map((st) => {
        const isActive = st.num === currentStep;
        const isDone = st.num < currentStep;

        return (
          <div
            key={st.num}
            className={`p-2.5 border-2 transition-all flex items-center gap-2.5 ${
              isActive
                ? 'border-black dark:border-[#FF2E51] bg-[#FCFAF6] dark:bg-[#1A1A1A] shadow-neo-sm ring-1 ring-black dark:ring-[#FF2E51]'
                : isDone
                ? 'border-black dark:border-emerald-500 bg-black dark:bg-[#111111] text-white shadow-neo-sm'
                : 'border-black/30 dark:border-[#2A2A2A] bg-[#FCFAF6]/60 dark:bg-[#141414] text-gray-500 dark:text-gray-400'
            }`}
          >
            <div
              className={`w-6 h-6 shrink-0 flex items-center justify-center font-mono font-bold text-xs ${
                isActive
                  ? 'bg-[#FF2E51] text-white'
                  : isDone
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-200 dark:bg-[#262626] text-black dark:text-gray-400'
              }`}
            >
              {isDone ? '✓' : st.num}
            </div>
            <div className="leading-tight overflow-hidden">
              <div
                className={`text-[11px] font-mono font-bold tracking-tight uppercase truncate ${
                  isActive
                    ? 'text-black dark:text-white'
                    : isDone
                    ? 'text-white dark:text-gray-200'
                    : 'text-gray-700 dark:text-gray-400'
                }`}
              >
                {st.title}
              </div>
              <div
                className={`text-[9px] font-mono truncate ${
                  isActive
                    ? 'text-[#FF2E51] font-semibold'
                    : isDone
                    ? 'text-gray-300 dark:text-gray-400'
                    : 'text-gray-400 dark:text-gray-500'
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
