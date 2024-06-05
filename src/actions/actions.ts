'use server';

import { signIn, signOut } from '@/lib/auth';
import prisma from '@/lib/db';
import { sleep } from '@/lib/utils';
import { petFormSchema, petIdSchema } from '@/lib/validations';
import { revalidatePath } from 'next/cache';

// --- user actions ---
export async function logIn(formData: FormData) {
  // const authData = Object.fromEntries(formData.entries());
  // console.log(authData);

  await signIn('credentials', formData);
}

export async function logOut() {
  return signOut({ redirectTo: '/' })
}

// --- pet actions ---
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

export async function editPet(petId: unknown, petData: unknown) {
  // mock network time
  await sleep(1000);

  const validatedPetId = petIdSchema.safeParse(petId);
  const validatedPet = petFormSchema.safeParse(petData);
  if (!validatedPetId.success || !validatedPet.success) {
    return {
      message: 'Invalid pet data',
    };
  }

  try {
    await prisma.pet.update({
      where: {
        id: validatedPetId.data,
      },
      data: validatedPet.data,
    });
  } catch (error) {
    return {
      message: 'Could not update pet.',
    };
  }

  revalidatePath('/app', 'layout');
}

export async function deletePet(petId: unknown) {
  // mock network time
  await sleep(1000);

  const validatedPetId = petIdSchema.safeParse(petId);
  if (!validatedPetId.success) {
    return {
      message: 'Invalid pet ID',
    };
  }

  try {
    await prisma.pet.delete({
      where: {
        id: validatedPetId.data,
      },
    });
  } catch (error) {
    return {
      message: 'Could not checkout pet.',
    };
  }
  revalidatePath('/app', 'layout');
}
