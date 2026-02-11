import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export const Panel = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  return (
    <section
      className={cn(
        'rounded-3xl border border-slate-200/90 bg-white/75 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/60',
        className,
      )}
      {...props}
    />
  );
};
