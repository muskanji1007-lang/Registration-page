import React from 'react';
import { AlertCircle } from 'lucide-react';

export const FormField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = true,
  icon: Icon,
  disabled = false,
  readOnly = false,
  helperText,
  rightBadge,
  maxLength,
  children,
  ...rest
}) => {
  return (
    <div className="space-y-1.5 w-full">
      <div className="flex items-center justify-between">
        <label htmlFor={name} className="block text-xs font-mono font-bold tracking-wider text-black uppercase">
          {label} {required && <span className="text-[#FF2E51]">*</span>}
        </label>
        {rightBadge && <div>{rightBadge}</div>}
      </div>

      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            <Icon className="w-4 h-4" />
          </div>
        )}

        {children ? (
          children
        ) : type === 'select' ? (
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={`w-full bg-white border-2 text-black text-xs sm:text-sm font-mono py-2.5 ${
              Icon ? 'pl-9' : 'pl-3'
            } pr-8 focus:outline-none focus:ring-0 transition-colors ${
              error
                ? 'border-[#FF2E51] bg-red-50/20'
                : 'border-black focus:border-[#FF2E51]'
            } ${disabled ? 'bg-gray-100 cursor-not-allowed text-gray-500' : ''}`}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {/* options will be passed as children if needed, or handled in parent */}
          </select>
        ) : (
          <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            maxLength={maxLength}
            onInput={(e) => {
              if (maxLength && e.target.value && e.target.value.length > maxLength) {
                e.target.value = e.target.value.slice(0, maxLength);
              }
              if (rest.onInput) rest.onInput(e);
            }}
            {...rest}
            className={`w-full bg-white border-2 text-black text-xs sm:text-sm font-mono py-2.5 ${
              Icon ? 'pl-9' : 'pl-3'
            } pr-3 focus:outline-none focus:ring-0 transition-colors ${
              error
                ? 'border-[#FF2E51] bg-red-50/20'
                : 'border-black focus:border-[#FF2E51]'
            } ${
              disabled || readOnly
                ? 'bg-gray-100 text-gray-700 cursor-not-allowed select-all'
                : ''
            }`}
          />
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

export default FormField;
