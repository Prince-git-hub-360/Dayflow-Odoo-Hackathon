import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, hoverable = false }) => {
  return (
    <div
      className={twMerge(
        clsx(
          'glass-card rounded-xl p-6 transition-all duration-200',
          hoverable && 'glass-card-hover cursor-pointer',
          className
        )
      )}
    >
      {children}
    </div>
  );
};
