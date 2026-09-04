import { Hono } from 'hono';
import { createMeditationSessionSchema, completeMeditationSessionSchema } from '../../shared/schemas';

type Env = { Bindings: { DB: D1Database } };
const app = new Hono<Env>().basePath('/api');
const fallback = [
  { id: 'welcome', title: 'Morning grounding', durationMinutes: 10, completedAt: null, createdAt: new Date().toISOString() },
  { id: 'focus', title: 'Focused breathing', durationMinutes: 15, completedAt: null, createdAt: new Date().toISOString() }
];

app.get('/sessions', async (c) => {
  if (!c.env.DB) return c.json(fallback);
  const { results } = await c.env.DB.prepare('SELECT id, title, duration_minutes as durationMinutes, completed_at as completedAt, created_at as createdAt FROM meditation_sessions ORDER BY created_at DESC LIMIT 50').all();
  return c.json(results);
});
app.post('/sessions', async (c) => {
  const parsed = createMeditationSessionSchema.safeParse(await c.req.json());
  if (!parsed.success) return c.json({ error: 'Please provide a title and a valid duration.' }, 400);
  const session = { id: crypto.randomUUID(), ...parsed.data, completedAt: null, createdAt: new Date().toISOString() };
  if (c.env.DB) await c.env.DB.prepare('INSERT INTO meditation_sessions (id, title, duration_minutes, created_at) VALUES (?, ?, ?, ?)').bind(session.id, session.title, session.durationMinutes, session.createdAt).run();
  return c.json(session, 201);
});
app.patch('/sessions/:id', async (c) => {
  const parsed = completeMeditationSessionSchema.safeParse(await c.req.json());
  if (!parsed.success) return c.json({ error: 'Invalid completion state.' }, 400);
  const completedAt = parsed.data.completed ? new Date().toISOString() : null;
  if (c.env.DB) await c.env.DB.prepare('UPDATE meditation_sessions SET completed_at = ? WHERE id = ?').bind(completedAt, c.req.param('id')).run();
  return c.json({ id: c.req.param('id'), completedAt });
});
export const onRequest = (context: Parameters<typeof app.fetch>[2]) => app.fetch(context.request, context.env, context);
