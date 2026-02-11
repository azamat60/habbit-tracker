import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  tone?: 'default' | 'soft' | 'danger';
}

export const Card = ({ tone = 'default', className, ...props }: CardProps) => {
  const toneClass =
    tone === 'danger'
      ? 'border-rose-200 bg-white dark:border-rose-400/35 dark:bg-slate-900'
      : tone === 'soft'
        ? 'border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/55'
        : 'border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900';

  return <div className={cn('rounded-2xl border p-3', toneClass, className)} {...props} />;
};
