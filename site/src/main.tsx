import { StrictMode, useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Check, ChevronRight, CircleHelp, Clock3, Leaf, Menu, Play, Plus, Sparkles, X } from 'lucide-react';
import type { MeditationSession } from '../shared/schemas';
import './styles.css';

const guides = [
  { title: 'Mindful presence', text: 'Begin by noticing what is here: breath, body, thoughts, and feelings. Attention can be focused or wide, with curiosity instead of judgment.' },
  { title: 'Self-compassion', text: 'When practice feels difficult, respond as you would to a good friend. Awareness helps you recognize struggle; kindness helps you stay with it.' },
  { title: 'Connection and meaning', text: 'Meditation can widen beyond the self—toward belonging, gratitude, values, and the small choices that help a life feel purposeful.' },
];
const techniques = [
  { label: 'Open awareness', detail: 'Let sounds, sensations, and thoughts arrive and pass while you rest in a wider field of attention.', color: 'mint' },
  { label: 'Self-compassion break', detail: 'Name the hard moment, remember that difficulty is human, and offer yourself a supportive phrase.', color: 'sand' },
  { label: 'Loving-kindness', detail: 'Build a sense of connection by extending simple wishes of safety, ease, and well-being outward.', color: 'coral' },
];

function App() {
  const [sessions, setSessions] = useState<MeditationSession[]>([{ id: 'welcome', title: 'Morning grounding', durationMinutes: 10, completedAt: null, createdAt: new Date().toISOString() }, { id: 'focus', title: 'Focused breathing', durationMinutes: 15, completedAt: null, createdAt: new Date().toISOString() }]);
  const [duration, setDuration] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const completed = sessions.filter((session) => session.completedAt).length;
  const minutes = useMemo(() => sessions.reduce((sum, session) => sum + (session.completedAt ? session.durationMinutes : 0), 0), [sessions]);

  useEffect(() => { fetch('/api/sessions').then((response) => response.ok ? response.json() : null).then((data) => { if (Array.isArray(data)) setSessions(data); }).catch(() => undefined); }, []);

  async function addSession(event: React.FormEvent) {
    event.preventDefault();
    if (!title.trim()) return;
    const response = await fetch('/api/sessions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, durationMinutes: duration }) });
    const session = await response.json();
    setSessions((current) => [session, ...current]); setTitle(''); setShowForm(false);
  }
  async function toggleSession(session: MeditationSession) {
    const next = !session.completedAt;
    setSessions((current) => current.map((item) => item.id === session.id ? { ...item, completedAt: next ? new Date().toISOString() : null } : item));
    await fetch(`/api/sessions/${session.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ completed: next }) });
  }

  return <div className="app-shell">
    <header className="topbar"><div className="brand"><span className="brand-mark"><Leaf size={17} /></span><span>stillpoint</span></div><nav className={mobileOpen ? 'nav open' : 'nav'}><a href="#learn">Learn</a><a href="#practice">Practice</a><a href="#techniques">Techniques</a></nav><button className="menu-button" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle navigation">{mobileOpen ? <X /> : <Menu />}</button><button className="quiet-button">Today <ChevronRight size={15} /></button></header>
    <main>
      <section className="intro"><div><div className="eyebrow"><span className="eyebrow-dot" /> A calm place to begin</div><h1>Make a little room<br /><em>for yourself.</em></h1><p className="lead">Meditation is not about stopping your thoughts. It is learning to meet them with a bit more space.</p><div className="intro-actions"><a className="primary-button" href="#practice"><Play size={16} fill="currentColor" /> Start a practice</a><a className="text-link" href="#learn">Read the basics <ChevronRight size={16} /></a></div></div><div className="orb-wrap" aria-label="A simple breathing visual"><div className="orb"><span className="orb-core" /></div><div className="orb-caption"><span className="pulse" /> Follow your breath</div></div></section>
      <section className="stats"><div><strong>{completed}</strong><span>sessions complete</span></div><div><strong>{minutes}</strong><span>minutes present</span></div><div className="streak"><strong>3</strong><span>day streak <Sparkles size={14} /></span></div></section>
      <section id="learn" className="section"><div className="section-heading"><div><div className="eyebrow">A gentle introduction</div><h2>Meditation, in plain language.</h2></div><CircleHelp className="heading-icon" size={25} /></div><div className="guide-grid">{guides.map((guide, index) => <article className="guide-card" key={guide.title}><span className="card-number">0{index + 1}</span><h3>{guide.title}</h3><p>{guide.text}</p></article>)}</div></section>
      <section id="practice" className="practice-section"><div><div className="eyebrow">Your practice</div><h2>Small moments add up.</h2><p>Choose a session to put the ideas into motion.</p></div><div className="practice-panel"><div className="panel-header"><span>Recent sessions</span><button className="add-button" onClick={() => setShowForm(!showForm)}>{showForm ? <X size={16} /> : <Plus size={16} />} {showForm ? 'Close' : 'Add session'}</button></div>{showForm && <form className="session-form" onSubmit={addSession}><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Session name" aria-label="Session name" /><select value={duration} onChange={(event) => setDuration(Number(event.target.value))} aria-label="Duration"><option value={5}>5 min</option><option value={10}>10 min</option><option value={15}>15 min</option><option value={20}>20 min</option></select><button className="primary-button compact" type="submit">Save</button></form>}<div className="session-list">{sessions.map((session) => <div className={session.completedAt ? 'session completed' : 'session'} key={session.id}><button className="check-button" onClick={() => toggleSession(session)} aria-label={`Mark ${session.title} ${session.completedAt ? 'incomplete' : 'complete'}`}>{session.completedAt && <Check size={15} />}</button><div className="session-copy"><strong>{session.title}</strong><span><Clock3 size={13} /> {session.durationMinutes} minutes</span></div><span className="session-state">{session.completedAt ? 'Completed' : 'Ready'}</span></div>)}</div></div></section>
      <section id="techniques" className="section techniques"><div className="section-heading"><div><div className="eyebrow">Find your way in</div><h2>Three practices to try.</h2></div></div><div className="technique-grid">{techniques.map((item) => <article className={`technique-card ${item.color}`} key={item.label}><div className="technique-icon"><Leaf size={19} /></div><h3>{item.label}</h3><p>{item.detail}</p><a href="#practice">Try this <ChevronRight size={15} /></a></article>)}</div></section>
    </main><footer><span>stillpoint</span><span>A quieter way to check in.</span></footer>
  </div>;
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
