import { PropsWithChildren } from 'react';

export default function H1({ children }: PropsWithChildren) {
  return <h1 className="font-medium text-2xl leading-6">{children}</h1>;
}
