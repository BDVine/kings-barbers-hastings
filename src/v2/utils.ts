/** Live open/closed status based on UK time (Mon–Sat 9–6, Sun 10–4). */
export function shopStatus(): { open: boolean; label: string } {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '0';
  const weekday = get('weekday');
  const minutes = parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10);

  const isSun = weekday === 'Sun';
  const openAt = isSun ? 10 * 60 : 9 * 60;
  const closeAt = isSun ? 16 * 60 : 18 * 60;

  if (minutes >= openAt && minutes < closeAt) {
    return { open: true, label: `Open now · until ${isSun ? '4pm' : '6pm'}` };
  }
  if (minutes < openAt) {
    return { open: false, label: `Closed · opens ${isSun ? '10am' : '9am'}` };
  }
  const tomorrowIsSun = weekday === 'Sat';
  return { open: false, label: `Closed · opens ${tomorrowIsSun ? '10am' : '9am'} tomorrow` };
}

export function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

/** Apple Maps link — opens the native Maps app on iPhone. */
export const appleMapsUrl = (address: string, postcode: string) =>
  `https://maps.apple.com/?q=${encodeURIComponent(`Kings Barbers, ${address}, ${postcode}`)}`;
