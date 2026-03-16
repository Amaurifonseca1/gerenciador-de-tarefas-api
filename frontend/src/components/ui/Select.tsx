import type { SelectHTMLAttributes } from "react";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  id: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
}

export function Select({
  label,
  id,
  options,
  placeholder,
  error,
  className = "",
  ...rest
}: SelectProps) {
  return (
    <div className="form-field">
      {label && (
        <label htmlFor={id} className="form-field__label">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`form-field__select ${error ? "form-field__select--error" : ""} ${className}`.trim()}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <span id={`${id}-error`} className="form-field__error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
