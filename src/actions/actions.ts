'use server';

import prisma from '@/lib/db';
import { sleep } from '@/lib/utils';
import { revalidatePath } from 'next/cache';

export async function addPet(formData) {
  // mock network time
  await sleep(2000);

  try {
    await prisma.pet.create({
      data: {
        name: formData.get('name'),
        ownerName: formData.get('ownerName'),
        imageUrl:
          formData.get('imageUrl') ||
          'https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png',
        age: parseInt(formData.get('age')),
        notes: formData.get('notes'),
      },
    });
  } catch (error) {
    return {
      message: 'Could not add pet.',
    };
  }

  revalidatePath('/app', 'layout');
}

export async function editPet(petId: string, formData) {
  // mock network time
  await sleep(2000);

  try {
    await prisma.pet.update({
      where: {
        id: petId,
      },
      data: {
        name: formData.get('name'),
        ownerName: formData.get('ownerName'),
        imageUrl: formData.get('imageUrl'),
        age: parseInt(formData.get('age')),
        notes: formData.get('notes'),
      },
    });
  } catch (error) {
    return {
      message: 'Could not update pet.',
    };
  }

  revalidatePath('/app', 'layout');
}
