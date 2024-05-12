import { cn } from '@/lib/utils';
import { PropsWithChildren } from 'react';

type ContentBlockProps = {
  className?: string;
};

export default function ContentBlock({
  children,
  className,
}: PropsWithChildren<ContentBlockProps>) {
  return (
    <div
      className={cn(
        'bg-[#f7f8fa] shadow-sm rounded-md overflow-hidden h-full w-full',
        className
      )}
    >
      {children}
    </div>
  );
}
