interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  DB?: D1Database;
}

const fallbackSessions = [
  { id: 'welcome', title: 'Morning grounding', durationMinutes: 10, completedAt: null, createdAt: new Date().toISOString() },
  { id: 'focus', title: 'Focused breathing', durationMinutes: 15, completedAt: null, createdAt: new Date().toISOString() },
];

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === '/api/sessions' && request.method === 'GET') {
      if (!env.DB) return Response.json(fallbackSessions);
      const result = await env.DB.prepare('SELECT id, title, duration_minutes as durationMinutes, completed_at as completedAt, created_at as createdAt FROM meditation_sessions ORDER BY created_at DESC LIMIT 50').all();
      return Response.json(result.results);
    }
    return env.ASSETS.fetch(request);
  },
};
