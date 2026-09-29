'use client';

import type React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps {
  label: string;
  isArrow?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: 'outline' | 'filled';
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  isDisabled?: boolean;
  customIcon?: React.ReactNode;
  className?: string;
}

const MyButton: React.FC<ButtonProps> = ({
  isArrow = false,
  label,
  onClick,
  variant = 'filled',
  fullWidth,
  type = 'button',
  isDisabled = false,
  customIcon,
  className,
}) => {
  const baseClasses = cn(
    'rounded-[10px] text-sm font-medium transition-all duration-200',
    'flex items-center justify-center gap-2 cursor-pointer',
    'disabled:opacity-70 disabled:cursor-not-allowed',
    'px-4 py-2',
    {
      'w-full': fullWidth,
    }
  );

  const variantClasses = {
    outline: cn(
      'border border-gray-300 text-primary bg-white',
      'hover:bg-gray-50 hover:text-secondary active:bg-gray-100',
      'focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2'
    ),
    filled: cn(
      'bg-primary text-white border border-transparent',
      'hover:bg-gray-800 active:bg-primary',
      'focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2'
    ),
  };

  return (
    <button
      disabled={isDisabled}
      type={type}
      onClick={onClick}
      className={cn(baseClasses, variantClasses[variant], className)}
    >
      {label}
      {(isArrow || customIcon) && (
        <span className="flex items-center">
          {isArrow && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className={cn({
                'text-white': variant === 'filled',
                'text-primary': variant === 'outline',
              })}
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M19.4489 11.1013C17.1085 11.1013 14.9753 8.96916 14.9753 6.62772V5.66772H13.0553V6.62772C13.0553 8.33076 13.8022 9.92819 14.9744 11.1013H3.12891V13.0213H14.9744C13.8022 14.1944 13.0553 15.7919 13.0553 17.4949V18.4549H14.9753V17.4949C14.9753 15.1535 17.1085 13.0213 19.4489 13.0213H20.4089V11.1013H19.4489Z"
                fill="currentColor"
              />
            </svg>
          )}
          {customIcon}
        </span>
      )}
    </button>
  );
};

export default MyButton;
