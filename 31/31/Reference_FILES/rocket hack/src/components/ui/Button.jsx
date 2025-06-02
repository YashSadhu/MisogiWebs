import React from 'react';
import Icon from '../AppIcon';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-hover focus:ring-primary',
    secondary: 'bg-surface text-text-primary border border-border hover:bg-gray-100 focus:ring-primary',
    outline: 'border border-primary text-primary bg-transparent hover:bg-primary hover:text-white focus:ring-primary',
    ghost: 'text-text-primary hover:bg-surface focus:ring-primary',
    destructive: 'bg-error text-white hover:bg-red-600 focus:ring-error',
    link: 'text-primary underline-offset-4 hover:underline focus:ring-primary',
    icon: 'text-text-secondary hover:text-text-primary hover:bg-surface focus:ring-primary'
  };

  const sizeClasses = {
    sm: variant === 'icon' ? 'h-8 w-8' : 'px-3 py-1.5 text-sm',
    md: variant === 'icon' ? 'h-10 w-10' : 'px-4 py-2 text-sm',
    lg: variant === 'icon' ? 'h-12 w-12' : 'px-6 py-3 text-base',
    xl: variant === 'icon' ? 'h-14 w-14' : 'px-8 py-4 text-lg'
  };

  const iconSizes = {
    sm: 16,
    md: 18,
    lg: 20,
    xl: 22
  };

  const handleClick = (e) => {
    if (disabled || loading) return;
    onClick?.(e);
  };

  const buttonContent = () => {
    if (variant === 'icon') {
      return (
        <>
          {loading ? (
            <Icon name="Loader2" size={iconSizes[size]} className="animate-spin" />
          ) : (
            <Icon name={icon || 'Plus'} size={iconSizes[size]} />
          )}
        </>
      );
    }

    return (
      <>
        {loading && (
          <Icon name="Loader2" size={iconSizes[size]} className="animate-spin mr-2" />
        )}
        {!loading && icon && iconPosition === 'left' && (
          <Icon name={icon} size={iconSizes[size]} className="mr-2" />
        )}
        {children}
        {!loading && icon && iconPosition === 'right' && (
          <Icon name={icon} size={iconSizes[size]} className="ml-2" />
        )}
      </>
    );
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={handleClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {buttonContent()}
    </button>
  );
};

export default Button;