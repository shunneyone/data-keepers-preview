import { rounds, context, ending } from './story.js';
export function createSession() { return { phase: 'intro', history: [] }; }
export function start(session) {
  if (session.phase !== 'intro') throw new Error('Can only start from the introduction');
  return { phase: 'decision', history: [] };
}
export function choose(session, id) {
  if (session.phase !== 'decision') throw new Error('No decision available');
  const round = rounds[session.history.length];
  if (!round || !round.choices.some(choice => choice.id === id)) throw new Error('Choice unavailable');
  const history = [...session.history, id];
  return { phase: history.length === rounds.length ? 'debrief' : 'decision', history };
}
export function view(session) {
  if (session.phase === 'intro') return { phase: 'intro' };
  if (session.phase === 'debrief') return { phase: 'debrief', ...ending(session.history) };
  return { phase: 'decision', round: rounds[session.history.length], number: session.history.length + 1, context: context(session.history) };
}
export function restart() { return createSession(); }
