import React, { useState, forwardRef } from 'react';
import Icon from '../AppIcon';

const Input = forwardRef(({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  error,
  disabled = false,
  required = false,
  variant = 'default',
  icon,
  iconPosition = 'left',
  button,
  className = '',
  id,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const baseInputClasses = 'block w-full rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    default: `border-border focus:border-primary focus:ring-primary ${error ? 'border-error focus:border-error focus:ring-error' : ''}`,
    search: 'border-border focus:border-primary focus:ring-primary bg-surface',
    'with-icon': `border-border focus:border-primary focus:ring-primary ${error ? 'border-error focus:border-error focus:ring-error' : ''}`,
    'with-button': `border-border focus:border-primary focus:ring-primary ${error ? 'border-error focus:border-error focus:ring-error' : ''}`,
    error: 'border-error focus:border-error focus:ring-error',
    disabled: 'border-border bg-gray-100 cursor-not-allowed'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  const getInputClasses = () => {
    let classes = `${baseInputClasses} ${variantClasses[disabled ? 'disabled' : variant]} ${sizeClasses.md}`;
    
    if (icon && iconPosition === 'left') {
      classes += ' pl-10';
    }
    if (icon && iconPosition === 'right') {
      classes += ' pr-10';
    }
    if (type === 'password') {
      classes += ' pr-10';
    }
    if (button) {
      classes += ' pr-20';
    }
    
    return classes;
  };

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label 
          htmlFor={inputId}
          className={`block text-sm font-medium ${error ? 'text-error' : 'text-text-primary'}`}
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {/* Left Icon */}
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon 
              name={icon} 
              size={16} 
              className={`${error ? 'text-error' : isFocused ? 'text-primary' : 'text-text-tertiary'}`} 
            />
          </div>
        )}

        {/* Input Field */}
        <input
          ref={ref}
          id={inputId}
          type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={getInputClasses()}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />

        {/* Right Icon */}
        {icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Icon 
              name={icon} 
              size={16} 
              className={`${error ? 'text-error' : isFocused ? 'text-primary' : 'text-text-tertiary'}`} 
            />
          </div>
        )}

        {/* Password Toggle */}
        {type === 'password' && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            tabIndex={-1}
          >
            <Icon 
              name={showPassword ? 'EyeOff' : 'Eye'} 
              size={16} 
              className="text-text-tertiary hover:text-text-primary transition-colors" 
            />
          </button>
        )}

        {/* Button */}
        {button && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            {button}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p id={`${inputId}-error`} className="text-sm text-error flex items-center">
          <Icon name="AlertCircle" size={14} className="mr-1" />
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;