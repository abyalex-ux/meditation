import { z } from 'zod';

export const meditationSessionSchema = z.object({
  id: z.string(), title: z.string(), durationMinutes: z.number().int().positive(), completedAt: z.string().nullable(), createdAt: z.string()
});
export const meditationSessionListSchema = z.array(meditationSessionSchema);
export const createMeditationSessionSchema = z.object({ title: z.string().trim().min(1).max(80), durationMinutes: z.number().int().min(1).max(180) });
export const completeMeditationSessionSchema = z.object({ completed: z.boolean() });
export type MeditationSession = z.infer<typeof meditationSessionSchema>;
