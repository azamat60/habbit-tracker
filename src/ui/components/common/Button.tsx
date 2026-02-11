import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

type ButtonVariant =
  | 'primary'
  | 'ghost'
  | 'info'
  | 'warning'
  | 'success'
  | 'danger'
  | 'tabActive'
  | 'tabIdle';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'rounded-xl border border-indigo-300 bg-indigo-100 px-3 py-2 text-sm font-semibold text-indigo-800 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-400 hover:bg-indigo-200 dark:border-indigo-700/70 dark:bg-indigo-900/40 dark:text-indigo-100 dark:hover:border-indigo-600 dark:hover:bg-indigo-900/60 disabled:cursor-not-allowed disabled:opacity-50',
  ghost:
    'rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-600',
  info:
    'rounded-xl border border-sky-300 bg-sky-100 px-3 py-2 text-sm font-semibold text-sky-800 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-400 hover:bg-sky-200 dark:border-sky-700/70 dark:bg-sky-900/40 dark:text-sky-100 dark:hover:border-sky-600 dark:hover:bg-sky-900/60 disabled:cursor-not-allowed disabled:opacity-50',
  warning:
    'rounded-xl border border-amber-300 bg-amber-100 px-3 py-2 text-sm font-semibold text-amber-800 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-400 hover:bg-amber-200 dark:border-amber-700/70 dark:bg-amber-900/40 dark:text-amber-100 dark:hover:border-amber-600 dark:hover:bg-amber-900/60 disabled:cursor-not-allowed disabled:opacity-50',
  success:
    'rounded-xl border border-emerald-300 bg-emerald-100 px-3 py-2 text-sm font-semibold text-emerald-800 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-emerald-200 dark:border-emerald-700/70 dark:bg-emerald-900/40 dark:text-emerald-100 dark:hover:border-emerald-600 dark:hover:bg-emerald-900/60 disabled:cursor-not-allowed disabled:opacity-50',
  danger:
    'rounded-xl border border-rose-300 bg-rose-100 px-3 py-2 text-sm font-semibold text-rose-800 shadow-sm transition hover:-translate-y-0.5 hover:border-rose-400 hover:bg-rose-200 dark:border-rose-700/70 dark:bg-rose-900/40 dark:text-rose-100 dark:hover:border-rose-600 dark:hover:bg-rose-900/60 disabled:cursor-not-allowed disabled:opacity-50',
  tabActive:
    'rounded-2xl border border-slate-900 bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 dark:border-white dark:bg-white dark:text-slate-900',
  tabIdle:
    'rounded-2xl border border-slate-200 bg-white/80 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:hover:border-slate-600',
};

export const Button = ({ variant = 'ghost', className, type = 'button', ...props }: ButtonProps) => {
  return <button type={type} className={cn(variants[variant], className)} {...props} />;
};
