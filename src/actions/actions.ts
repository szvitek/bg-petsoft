'use server';

import prisma from '@/lib/db';
import { sleep } from '@/lib/utils';
import { revalidatePath } from 'next/cache';

export async function addPet(petData) {
  // mock network time
  await sleep(2000);

  try {
    await prisma.pet.create({
      data: petData,
    });
  } catch (error) {
    return {
      message: 'Could not add pet.',
    };
  }

  revalidatePath('/app', 'layout');
}

export async function editPet(petId: string, petData) {
  // mock network time
  await sleep(2000);

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

export async function deletePet(petId: string) {
  // mock network time
  await sleep(2000);

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
