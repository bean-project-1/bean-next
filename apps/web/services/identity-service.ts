import { prisma } from '@/lib/prisma';

export class IdentityService {
  /**
   * Generates a unified view of a user's DNA for a specific dimension.
   * Merges History, Current Commitments, Skills/Attributes, and Future Intent.
   */
  async getUnifiedDimension(userId: string, dimensionName: string) {
    const dimension = await prisma.dimension.findUnique({
      where: { name: dimensionName },
      include: {
        attributes: { where: { userId } },
        lifeEvents: { where: { userId }, orderBy: { date: 'desc' } },
        // We'll need to fetch goals separately since they link to User, not directly back to Dimension in a clean way sometimes
      }
    });

    if (!dimension) return null;

    // Fetch commitments for this user and this dimension
    const baseCommitments = await prisma.baseCommitment.findMany({
      where: {
        userId,
        isActive: true,
        dimensionIds: { has: dimension.id }
      }
    });

    // Fetch goals for this dimension
    const goals = await prisma.goal.findMany({
      where: { userId, dimensionId: dimension.id, status: 'active' },
      include: { actions: { take: 5 } }
    });

    return {
      dimension: {
        id: dimension.id,
        name: dimension.name,
        label: dimension.label,
        category: dimension.category
      },
      identity: {
        // Assets: What I have/know
        assets: dimension.attributes.filter(a => a.category !== 'intent').map(a => ({
          name: a.name,
          category: a.category,
          level: (a.metadata as any)?.level || 'learned'
        })),
        // Current: What I'm doing now
        current: baseCommitments.map(c => ({
          title: c.title,
          type: c.type,
          hoursPerDay: c.hoursPerDay,
          commuteHours: c.commuteHours,
          startTime: c.startTime,
          endTime: c.endTime
        })),
        // History: Where I've been
        history: dimension.lifeEvents.map(e => ({
          title: e.title,
          type: e.type,
          date: e.date,
          description: e.description
        })),
        // Intent: Where I'm going
        intent: [
          ...goals.map(g => ({
            title: g.title,
            progress: g.progress
          })),
          ...dimension.attributes.filter(a => a.category === 'intent').map(a => ({
            title: a.name,
            progress: (a.metadata as any)?.progress || 0
          }))
        ]
      }
    };
  }

  async getFullIdentity(userId: string) {
    const dimensions = await prisma.dimension.findMany();
    const identity: any = {};

    await Promise.all(dimensions.map(async (dim) => {
      identity[dim.name] = await this.getUnifiedDimension(userId, dim.name);
    }));

    return identity;
  }
}

export const identityService = new IdentityService();
