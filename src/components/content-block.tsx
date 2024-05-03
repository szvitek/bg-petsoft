import { PropsWithChildren } from 'react';

export default function ContentBlock({ children }: PropsWithChildren) {
  return (
    <div className="bg-[#f7f8fa] shadow-sm rounded-md overflow-hidden h-full w-full">
      {children}
    </div>
  );
}
