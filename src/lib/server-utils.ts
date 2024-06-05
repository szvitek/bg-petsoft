import 'server-only';
import { redirect } from 'next/navigation';
import { auth } from './auth';
import { Pet, User } from '@prisma/client';
import prisma from './db';

export async function checkAuth() {
  const session = await auth();
  if (!session?.user) {
    return redirect('/login');
  }

  return session;
}

export function getUserByEmail(email: User['email']) {
  return prisma.user.findUnique({
    where: {
      email: email,
    },
  });
}

export function getPetById(petId: Pet['id']) {
  return prisma.pet.findUnique({
    where: {
      id: petId,
    },
  });
}

export function getPetsByUserId(userId: User['id']) {
  return prisma.pet.findMany({
    where: {
      userId,
    },
  });
}
