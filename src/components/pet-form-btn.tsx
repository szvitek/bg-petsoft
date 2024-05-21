import { useFormStatus } from 'react-dom';
import { Button } from './ui/button';

export default function PetFormBtn({ actionType }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="mt-5 self-end">
      {actionType === 'add' ? 'Add a new pet' : 'Edit pet'}
    </Button>
  );
}
