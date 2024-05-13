import { PlusIcon } from '@radix-ui/react-icons';
import { Button } from './ui/button';
import { PropsWithChildren } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import PetForm from './pet-form';

type PetButtonProps = {
  actionType: 'add' | 'edit' | 'checkout';
  onClick?: () => void;
};

export default function PetButton({
  actionType,
  children,
  onClick,
}: PropsWithChildren<PetButtonProps>) {
  if (actionType === 'checkout') {
    return (
      <Button variant="secondary" onClick={onClick}>
        {children}
      </Button>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {actionType === 'add' ? (
          <Button size="icon">
            <PlusIcon className="h-6 w-6" />
          </Button>
        ) : (
          <Button variant="secondary">{children}</Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {actionType === 'add' ? 'Add a new pet' : 'Edit pet'}
          </DialogTitle>
        </DialogHeader>
        <PetForm />
      </DialogContent>
    </Dialog>
  );
}
