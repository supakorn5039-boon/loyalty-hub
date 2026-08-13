import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'emerald' | 'amber' | 'indigo' | 'rose' | 'slate';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'slate',
  size = 'sm',
  className = '',
}) => {
  const variantStyles = {
    emerald: 'bg-emerald-100 text-emerald-900 border-emerald-200',
    amber: 'bg-amber-100 text-amber-900 border-amber-200',
    indigo: 'bg-indigo-100 text-indigo-900 border-indigo-200',
    rose: 'bg-rose-100 text-rose-900 border-rose-200',
    slate: 'bg-slate-100 text-slate-800 border-slate-200',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[9px]',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span
      className={`font-bold uppercase tracking-wider rounded-md border inline-flex items-center justify-center ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};
