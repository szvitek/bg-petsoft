'use client';

import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { usePetContext } from '@/lib/hooks';
import PetFormBtn from './pet-form-btn';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { DEFAULT_PET_IMAGE } from '@/lib/constatns';

type PetFormProps = {
  actionType: 'add' | 'edit';
  onFormSubmission: () => void;
};

const petFormSchema = z.object({
  name: z.string().trim().min(1, { message: 'Name is required' }).max(100),
  ownerName: z
    .string()
    .trim()
    .min(1, { message: 'Owner name is required' })
    .max(100),
  imageUrl: z.union([
    z.literal(''),
    z.string().trim().url({ message: 'Image url must be a valid url' }),
  ]),
  age: z.coerce.number().int().positive().max(100),
  notes: z.union([z.literal(''), z.string().trim().max(1000)]),
});
/*
  this is not working with this setup because server actions are consuming formData,
  but with onSubmit this is how to transform form data
  same thing with z.trim() and z.coerce() ... :/
  .transform((data) => ({
    ...data,
    imageUrl:
      data.imageUrl ||
      DEFAULT_PET_IMAGE,
  }));
  */

type TPetForm = z.infer<typeof petFormSchema>;

export default function PetForm({
  actionType,
  onFormSubmission,
}: PetFormProps) {
  const { handleAddPet, handleEditPet, selectedPet } = usePetContext();

  const {
    register,
    formState: { errors },
    trigger,
    getValues,
  } = useForm<TPetForm>({
    resolver: zodResolver(petFormSchema),
  });

  return (
    <form
      action={async (formData) => {
        const result = await trigger();
        if (!result) return;

        onFormSubmission();

        const petData = getValues();
        petData.imageUrl = petData.imageUrl || DEFAULT_PET_IMAGE;

        if (actionType === 'add') {
          await handleAddPet(petData);
        } else if (actionType === 'edit') {
          await handleEditPet(selectedPet!.id, petData);
        }
      }}
      className="flex flex-col"
    >
      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            {...register('name', {
              required: 'Name is required',
              minLength: {
                value: 3,
                message: 'Name must be at least 3 characters long',
              },
            })}
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="ownerName">Owner Name</Label>
          <Input
            id="ownerName"
            {...register('ownerName', {
              required: 'Owner name is required',
              maxLength: {
                value: 20,
                message: 'Owner name must be less than 20 characters long',
              },
            })}
          />
          {errors.ownerName && (
            <p className="text-red-500">{errors.ownerName.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="imageUrl">Image Url</Label>
          <Input id="imageUrl" {...register('imageUrl')} />
          {errors.imageUrl && (
            <p className="text-red-500">{errors.imageUrl.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="age">Age</Label>
          <Input id="age" {...register('age')} />
          {errors.age && <p className="text-red-500">{errors.age.message}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" {...register('notes')} />
          {errors.notes && (
            <p className="text-red-500">{errors.notes.message}</p>
          )}
        </div>
      </div>

      <PetFormBtn actionType={actionType} />
    </form>
  );
}
