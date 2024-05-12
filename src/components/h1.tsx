import { cn } from '@/lib/utils';
import { PropsWithChildren } from 'react';

type H1Props = {
  className?: string
}

export default function H1({ children, className }: PropsWithChildren<H1Props>) {
  return <h1 className={cn("font-medium text-2xl leading-6", className)}>{children}</h1>;
}
