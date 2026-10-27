import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check, AlertCircle } from 'lucide-react';

export const CustomSelect = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  icon: Icon,
  error,
  helperText,
  required = true,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Normalize options to { value, label } format
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === 'object' && opt !== null) {
      return { value: String(opt.value), label: String(opt.label ?? opt.value) };
    }
    return { value: String(opt), label: String(opt) };
  });

  const selectedOption = normalizedOptions.find(
    (opt) => String(opt.value).toLowerCase() === String(value || '').toLowerCase()
  );

  const handleSelect = (optValue) => {
    if (disabled) return;
    if (onChange) {
      // Support both plain value and event-like object
      const synthEvent = {
        target: { name, value: optValue },
        currentTarget: { name, value: optValue },
        value: optValue,
      };
      onChange(optValue, synthEvent);
    }
    setIsOpen(false);
  };

  return (
    <div className="space-y-1.5 w-full relative" ref={dropdownRef}>
      {label && (
        <label
          htmlFor={name}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className="block text-xs font-mono font-bold tracking-wider text-black dark:text-white uppercase cursor-pointer"
        >
          {label} {required && <span className="text-[#FF2E51]">*</span>}
        </label>
      )}

      <div className="relative">
        {/* Trigger Button */}
        <button
          type="button"
          id={name}
          disabled={disabled}
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className={`w-full bg-white dark:bg-[#141414] border-2 text-black dark:text-white text-xs sm:text-sm font-mono py-2.5 ${
            Icon ? 'pl-9' : 'pl-3'
          } pr-9 text-left flex items-center justify-between transition-all duration-150 relative select-none ${
            error
              ? 'border-[#FF2E51] bg-red-50/20'
              : isOpen
              ? 'border-black dark:border-[#FF2E51] shadow-neo dark:shadow-[3px_3px_0px_#FF2E51] ring-1 ring-black dark:ring-[#FF2E51]'
              : 'border-black dark:border-[#333333] hover:border-black dark:hover:border-white/50 focus:border-[#FF2E51]'
          } ${
            disabled
              ? 'bg-gray-100 dark:bg-[#1A1A1A] text-gray-400 cursor-not-allowed border-gray-300 dark:border-[#2A2A2A]'
              : 'cursor-pointer hover:shadow-neo-sm'
          }`}
        >
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <Icon className="w-4 h-4" />
            </div>
          )}

          <span
            className={`truncate ${
              selectedOption ? 'font-bold text-black dark:text-white' : 'text-gray-400 font-normal'
            }`}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>

          <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ChevronDown
              className={`w-4 h-4 text-black dark:text-white transition-transform duration-200 ${
                isOpen ? 'transform rotate-180 text-[#FF2E51] dark:text-[#FF2E51]' : ''
              }`}
            />
          </span>
        </button>

        {/* Custom Neo-Brutalist Dropdown Menu */}
        {isOpen && (
          <div
            role="listbox"
            className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white dark:bg-[#141414] border-2 border-black dark:border-[#FF2E51] shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#FF2E51] max-h-60 overflow-y-auto animate-in fade-in-50 zoom-in-95 duration-100"
          >
            {normalizedOptions.length === 0 ? (
              <div className="px-3 py-2 text-xs font-mono text-gray-400">No options available</div>
            ) : (
              normalizedOptions.map((opt) => {
                const isSelected =
                  String(opt.value).toLowerCase() === String(value || '').toLowerCase();
                return (
                  <div
                    key={opt.value}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(opt.value)}
                    className={`px-3 py-2.5 text-xs sm:text-sm font-mono cursor-pointer flex items-center justify-between transition-colors border-b border-gray-100 dark:border-[#242424] last:border-b-0 ${
                      isSelected
                        ? 'bg-black dark:bg-[#222222] text-white font-bold'
                        : 'text-black dark:text-white hover:bg-[#FF2E51] hover:text-white'
                    }`}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-[#FBBF24] shrink-0 ml-2" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {helperText && !error && (
        <p className="text-[11px] text-gray-500 font-mono">{helperText}</p>
      )}

      {error && (
        <div className="flex items-center gap-1 text-[11px] font-mono text-[#FF2E51] font-semibold mt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
