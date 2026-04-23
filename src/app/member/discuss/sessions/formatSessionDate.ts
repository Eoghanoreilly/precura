/**
 * formatSessionDate - human-friendly date for session cards.
 *
 * Today           -> "Today"
 * Yesterday       -> "Yesterday"
 * This week       -> "Monday", "Tuesday", ...
 * This year       -> "Monday, 13 April"
 * Previous years  -> "13 April 2025"
 */
export function formatSessionDate(isoString: string): string {
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return "";

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = Math.floor(
    (todayStart.getTime() - dStart.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";

  if (diffDays < 7) {
    return d.toLocaleDateString("en-GB", { weekday: "long" });
  }
  if (d.getFullYear() === now.getFullYear()) {
    return d.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  }
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
