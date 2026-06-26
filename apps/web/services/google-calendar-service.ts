import { google } from 'googleapis';
import { prisma } from '@/lib/prisma';

export class GoogleCalendarService {
  /**
   * Resolves the OAuth2 client for a given user if they have a Google account linked.
   * Returns null if no Google account is linked.
   */
  private async getAuthClient(userId: string) {
    const account = await prisma.account.findFirst({
      where: { userId, provider: 'google' }
    });

    if (!account || !account.access_token) {
      console.log(`[GoogleCalendarService] User ${userId} does not have a linked Google account or access token.`);
      return null;
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    oauth2Client.setCredentials({
      access_token: account.access_token,
      refresh_token: account.refresh_token || undefined,
      expiry_date: account.expires_at ? account.expires_at * 1000 : undefined
    });

    // Handle token refresh events to persist the new access token
    oauth2Client.on('tokens', async (tokens) => {
      console.log(`[GoogleCalendarService] Received refreshed tokens for user ${userId}`);
      if (tokens.access_token) {
        const updateData: any = {
          access_token: tokens.access_token,
        };
        if (tokens.expiry_date) {
          updateData.expires_at = Math.floor(tokens.expiry_date / 1000);
        }
        if (tokens.refresh_token) {
          updateData.refresh_token = tokens.refresh_token;
        }

        await prisma.account.update({
          where: { id: account.id },
          data: updateData
        });
      }
    });

    return oauth2Client;
  }

  /**
   * Helper to format a GoalAction task into a Google Calendar event payload.
   */
  private buildEventPayload(action: any, goalTitle: string) {
    const title = action.isCompleted 
      ? `✅ ${action.title}` 
      : action.title;
    
    const description = `Meta: ${goalTitle}\n\n${action.description || 'Sin descripción.'}\n\nCreado vía BEAN Life Intelligence.`;

    // Construct start and end times
    let startDateTime = action.startDate ? new Date(action.startDate) : null;
    let endDateTime = action.targetDate ? new Date(action.targetDate) : null;

    if (!endDateTime) {
      // Fallback if no targetDate: default to today or tomorrow
      endDateTime = new Date();
      endDateTime.setHours(10, 0, 0, 0);
    }

    if (!startDateTime) {
      // Default to 1 hour before targetDate, or targetDate itself with a 1-hour duration
      startDateTime = new Date(endDateTime.getTime());
      if (action.estimatedHours && action.estimatedHours > 0) {
        startDateTime.setTime(startDateTime.getTime() - (action.estimatedHours * 60 * 60 * 1000));
      } else {
        startDateTime.setHours(startDateTime.getHours() - 1);
      }
    }

    // Google Calendar API expects ISO string format
    return {
      summary: title,
      description: description,
      start: {
        dateTime: startDateTime.toISOString(),
      },
      end: {
        dateTime: endDateTime.toISOString(),
      },
      extendedProperties: {
        private: {
          beanGoalActionId: action.id,
          sourceSystem: 'BEAN'
        }
      }
    };
  }

  /**
   * Creates a calendar event for a single task (GoalAction)
   */
  async createEvent(userId: string, action: any, goalTitle: string): Promise<string | null> {
    const auth = await this.getAuthClient(userId);
    if (!auth) return null;

    try {
      const calendar = google.calendar({ version: 'v3', auth });
      const eventPayload = this.buildEventPayload(action, goalTitle);

      const response = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: eventPayload
      });

      return response.data.id || null;
    } catch (error) {
      console.error(`[GoogleCalendarService] Error creating event for action ${action.id}:`, error);
      return null;
    }
  }

  /**
   * Updates an existing calendar event for a single task
   */
  async updateEvent(userId: string, googleEventId: string, action: any, goalTitle: string): Promise<boolean> {
    const auth = await this.getAuthClient(userId);
    if (!auth) return false;

    try {
      const calendar = google.calendar({ version: 'v3', auth });
      const eventPayload = this.buildEventPayload(action, goalTitle);

      await calendar.events.update({
        calendarId: 'primary',
        eventId: googleEventId,
        requestBody: eventPayload
      });

      return true;
    } catch (error: any) {
      // If the event was deleted on Google Calendar directly, we might get a 410 or 404.
      // In that case, we return false so that the caller can clear the event ID and recreate it.
      if (error.status === 410 || error.status === 404) {
        console.warn(`[GoogleCalendarService] Event ${googleEventId} not found or deleted on Google. Will trigger recreation.`);
      } else {
        console.error(`[GoogleCalendarService] Error updating event ${googleEventId}:`, error);
      }
      return false;
    }
  }

  /**
   * Deletes a calendar event by ID
   */
  async deleteEvent(userId: string, googleEventId: string): Promise<boolean> {
    const auth = await this.getAuthClient(userId);
    if (!auth) return false;

    try {
      const calendar = google.calendar({ version: 'v3', auth });
      await calendar.events.delete({
        calendarId: 'primary',
        eventId: googleEventId
      });
      return true;
    } catch (error: any) {
      if (error.status === 410 || error.status === 404) {
        // Event is already deleted on Google Calendar
        return true;
      }
      console.error(`[GoogleCalendarService] Error deleting event ${googleEventId}:`, error);
      return false;
    }
  }

  /**
   * Synchronizes all scheduled tasks (GoalActions of type 'task' or 'milestone' with dates)
   * for a given Goal/Branch.
   */
  async syncGoalActions(goalId: string, userId: string): Promise<void> {
    const auth = await this.getAuthClient(userId);
    if (!auth) {
      // User hasn't linked Google Calendar, skip silently
      return;
    }

    try {
      // 1. Fetch Goal and Actions from Database
      const goal = await prisma.goal.findUnique({
        where: { id: goalId },
        include: {
          actions: {
            where: {
              type: { in: ['task', 'milestone'] },
              OR: [
                { targetDate: { not: null } },
                { startDate: { not: null } }
              ]
            }
          }
        }
      });

      if (!goal) {
        console.warn(`[GoogleCalendarService] Goal ${goalId} not found during sync.`);
        return;
      }

      console.log(`[GoogleCalendarService] Starting sync for goal "${goal.title}" (${goal.actions.length} actions)`);

      // 2. Process each action
      for (const action of goal.actions) {
        if (action.googleEventId) {
          // Event already exists, update it
          const updated = await this.updateEvent(userId, action.googleEventId, action, goal.title);
          
          if (!updated) {
            // Event not found on Google (maybe user deleted it manually in Google Calendar). Recreate it.
            const newEventId = await this.createEvent(userId, action, goal.title);
            if (newEventId) {
              await prisma.goalAction.update({
                where: { id: action.id },
                data: { googleEventId: newEventId }
              });
            }
          }
        } else {
          // Create new event
          const eventId = await this.createEvent(userId, action, goal.title);
          if (eventId) {
            await prisma.goalAction.update({
              where: { id: action.id },
              data: { googleEventId: eventId }
            });
          }
        }
      }
    } catch (error) {
      console.error(`[GoogleCalendarService] Error syncing goal ${goalId}:`, error);
    }
  }

  /**
   * Deletes all Google Calendar events associated with the actions of a Goal.
   * Call this BEFORE deleting a Goal from the database.
   */
  async deleteGoalEvents(goalId: string, userId: string): Promise<void> {
    const auth = await this.getAuthClient(userId);
    if (!auth) return;

    try {
      const actions = await prisma.goalAction.findMany({
        where: {
          goalId,
          googleEventId: { not: null }
        },
        select: { id: true, googleEventId: true }
      });

      console.log(`[GoogleCalendarService] Deleting ${actions.length} calendar events for goal ${goalId}`);

      for (const action of actions) {
        if (action.googleEventId) {
          await this.deleteEvent(userId, action.googleEventId);
        }
      }
    } catch (error) {
      console.error(`[GoogleCalendarService] Error deleting calendar events for goal ${goalId}:`, error);
    }
  }
}
