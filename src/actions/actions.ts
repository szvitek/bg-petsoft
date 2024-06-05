'use server';

import { signIn, signOut } from '@/lib/auth';
import prisma from '@/lib/db';
import { sleep } from '@/lib/utils';
import { petFormSchema, petIdSchema } from '@/lib/validations';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { checkAuth, getPetById } from '@/lib/server-utils';

// --- user actions ---
export async function logIn(formData: FormData) {
  await signIn('credentials', formData);
}

export async function logOut() {
  return signOut({ redirectTo: '/' });
}

export async function signUp(formData: FormData) {
  //todo: fix types
  const hashedPassword = await bcrypt.hash(
    formData.get('password') as string,
    10
  );

  await prisma.user.create({
    data: {
      email: formData.get('email') as string,
      hashedPassword,
    },
  });

  await signIn('credentials', formData);
}

// --- pet actions ---
export async function addPet(petData: unknown) {
  // mock network time
  await sleep(1000);

  // auth check
  const session = await checkAuth();

  // petFormSchema.safeParse() throws an error on fail
  const validatedPet = petFormSchema.safeParse(petData);
  if (!validatedPet.success) {
    return {
      message: 'Invalid pet data',
    };
  }

  try {
    await prisma.pet.create({
      data: {
        ...validatedPet.data,
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
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

  // auth check
  const session = await checkAuth();

  // validation
  const validatedPetId = petIdSchema.safeParse(petId);
  const validatedPet = petFormSchema.safeParse(petData);
  if (!validatedPetId.success || !validatedPet.success) {
    return {
      message: 'Invalid pet data',
    };
  }

  // authorization check
  const pet = await getPetById(validatedPetId.data);
  if (!pet) {
    return {
      message: 'Pet not found.',
    };
  }
  if (pet.userId !== session.user.id) {
    return {
      message: 'Not authorized.',
    };
  }

  // db mutation
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

  // authentication check
  const session = await checkAuth();

  // validation
  const validatedPetId = petIdSchema.safeParse(petId);
  if (!validatedPetId.success) {
    return {
      message: 'Invalid pet ID',
    };
  }

  // authorization check
  const pet = await getPetById(validatedPetId.data);
  if (!pet) {
    return {
      message: 'Pet not found.',
    };
  }
  if (pet.userId !== session.user.id) {
    return {
      message: 'Not authorized.',
    };
  }

  // db mutation
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
