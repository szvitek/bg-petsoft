import { PlusIcon } from '@radix-ui/react-icons';
import { Button } from './ui/button';
import { PropsWithChildren } from 'react';

type PetButtonProps = {
  actionType: 'add' | 'edit' | 'checkout';
};

export default function PetButton({
  actionType,
  children,
}: PropsWithChildren<PetButtonProps>) {
  if (actionType === 'add') {
    return (
      <Button size="icon">
        <PlusIcon className="h-6 w-6" />
      </Button>
    );
  }

  if (actionType === 'edit') {
    return <Button variant="secondary">{children}</Button>;
  }

  if (actionType === 'checkout') {
    return <Button variant="secondary">{children}</Button>;
  }
}
