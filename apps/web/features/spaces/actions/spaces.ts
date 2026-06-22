'use server';

import { auth } from '../../../auth';
import { prisma } from '../../../lib/prisma';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';

/**
 * Creates a new space and assigns the current user as the owner.
 */
export async function createSpace(name: string, description?: string, theme?: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const space = await prisma.space.create({
    data: {
      name,
      description,
      theme,
      members: {
        create: {
          userId: session.user.id,
          role: 'owner',
        },
      },
    },
  });

  revalidatePath('/home');
  return space;
}

/**
 * Fetches all spaces the current user is a member of.
 */
export async function getSpaces() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const spaces = await prisma.space.findMany({
    where: {
      members: {
        some: {
          userId: session.user.id,
        },
      },
    },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              avatarUrl: true,
            },
          },
        },
      },
    },
  });

  return spaces;
}

/**
 * Generates an invitation link for a specific space.
 */
export async function generateInviteLink(spaceId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  // Check if user is a member (ideally an owner, but for now any member can invite)
  const membership = await prisma.spaceMember.findFirst({
    where: { spaceId, userId: session.user.id },
  });

  if (!membership) {
    throw new Error('Not a member of this space');
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // Valid for 7 days

  await prisma.spaceInvitation.create({
    data: {
      spaceId,
      token,
      expiresAt,
    },
  });

  return token;
}

/**
 * Accepts an invitation and adds the user to the space.
 */
export async function joinSpace(token: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const invitation = await prisma.spaceInvitation.findUnique({
    where: { token },
  });

  if (!invitation) {
    throw new Error('Invalid invitation token');
  }

  if (invitation.expiresAt < new Date()) {
    throw new Error('Invitation expired');
  }

  if (invitation.status !== 'pending') {
    throw new Error('Invitation already used or revoked');
  }

  // Check if user is already a member
  const existingMembership = await prisma.spaceMember.findFirst({
    where: {
      spaceId: invitation.spaceId,
      userId: session.user.id,
    },
  });

  if (existingMembership) {
    return { success: true, message: 'Already a member' };
  }

  await prisma.$transaction([
    prisma.spaceMember.create({
      data: {
        spaceId: invitation.spaceId,
        userId: session.user.id,
        role: 'member',
      },
    }),
    prisma.spaceInvitation.update({
      where: { id: invitation.id },
      data: { status: 'accepted' },
    }),
  ]);

  revalidatePath('/home');
  return { success: true };
}
