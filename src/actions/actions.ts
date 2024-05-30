'use server';

import prisma from '@/lib/db';
import { PetEssentials } from '@/lib/types';
import { sleep } from '@/lib/utils';
import { petFormSchema } from '@/lib/validations';
import { Pet } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function addPet(petData: unknown) {
  // mock network time
  await sleep(1000);

  // petFormSchema.safeParse() throws an error on fail
  const validatedPet = petFormSchema.safeParse(petData);
  if (!validatedPet.success) {
    return {
      message: 'Invalid pet data',
    };
  }

  try {
    await prisma.pet.create({
      data: validatedPet.data,
    });
  } catch (error) {
    console.log(error);
    return {
      message: 'Could not add pet.',
    };
  }

  revalidatePath('/app', 'layout');
}

export async function editPet(petId: Pet['id'], petData: PetEssentials) {
  // mock network time
  await sleep(1000);

  try {
    await prisma.pet.update({
      where: {
        id: petId,
      },
      data: petData,
    });
  } catch (error) {
    return {
      message: 'Could not update pet.',
    };
  }

  revalidatePath('/app', 'layout');
}

export async function deletePet(petId: Pet['id']) {
  // mock network time
  await sleep(1000);

  try {
    await prisma.pet.delete({
      where: {
        id: petId,
      },
    });
  } catch (error) {
    return {
      message: 'Could not checkout pet.',
    };
  }
  revalidatePath('/app', 'layout');
}
