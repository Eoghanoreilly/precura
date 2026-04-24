export const WORRY_WORDS = [
  'scared','scary','worried','worry','afraid','terrified','panicking','panic attack','anxious','anxiety',
  "can't sleep",'cant sleep','something serious','something wrong','heart rate','dying',
] as const;

type WorryWord = typeof WORRY_WORDS[number];

export type EmotionalMessage = { content: string; created_at: string };
export type EmotionalSignal = {
  triggered: boolean;
  messageCount7d: number;
  nightCount: number;
  worryWordHits: Partial<Record<WorryWord, number>>;
  recentMessages: EmotionalMessage[];
};

const MS_PER_DAY = 86_400_000;
const WINDOW_DAYS = 7;

export function evaluateEmotionalSignal(messages: EmotionalMessage[]): EmotionalSignal {
  const now = Date.now();
  const cutoff = now - WINDOW_DAYS * MS_PER_DAY;
  const recent = messages
    .filter((m) => new Date(m.created_at).getTime() >= cutoff)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const worryWordHits: Partial<Record<WorryWord, number>> = {};
  let nightCount = 0;
  for (const m of recent) {
    const body = m.content.toLowerCase();
    for (const w of WORRY_WORDS) {
      if (body.includes(w)) worryWordHits[w] = (worryWordHits[w] ?? 0) + 1;
    }
    const hour = new Date(m.created_at).getHours();
    if (hour >= 22 || hour < 6) nightCount += 1;
  }

  const hasWorryWord = Object.values(worryWordHits).some((n) => (n ?? 0) > 0);
  const triggered = recent.length >= 3 && (nightCount > 0 || hasWorryWord);

  return { triggered, messageCount7d: recent.length, nightCount, worryWordHits, recentMessages: recent.slice(0, 5) };
}
