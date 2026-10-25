import { format, formatDistanceToNow, parseISO, isAfter } from 'date-fns';

/**
 * Converts English Arabic digits (0-9) to standard Bengali digits (০-৯)
 */
export function toBanglaDigits(input: string | number): string {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(input).replace(/[0-9]/g, (w) => bnDigits[+w]);
}

/**
 * Format date & time in Dhaka timezone (UTC+6)
 */
export function formatDhakaDateTime(
  isoDateString: string,
  useBanglaNumerals: boolean = false,
  pattern: string = 'dd MMM yyyy, hh:mm a'
): string {
  try {
    const date = parseISO(isoDateString);
    const formatted = format(date, pattern);
    return useBanglaNumerals ? toBanglaDigits(formatted) : formatted;
  } catch (err) {
    return isoDateString;
  }
}

/**
 * Format relative time (e.g. "5 minutes ago", "২ ঘণ্টা আগে")
 */
export function formatRelativeTime(
  isoDateString: string,
  lang: 'bn' | 'en' = 'bn',
  useBanglaNumerals: boolean = false
): string {
  try {
    const date = parseISO(isoDateString);
    const relative = formatDistanceToNow(date, { addSuffix: true });

    if (lang === 'bn') {
      // Basic Bengali relative mapping
      let bn = relative
        .replace('less than a minute ago', 'কিছুক্ষণ আগে')
        .replace(/about (\d+) hours? ago/, '$1 ঘণ্টা আগে')
        .replace(/(\d+) minutes? ago/, '$1 মিনিট আগে')
        .replace(/(\d+) days? ago/, '$1 দিন আগে')
        .replace(/about (\d+) months? ago/, '$1 মাস আগে')
        .replace(/in (\d+) hours?/, '$1 ঘণ্টার মধ্যে')
        .replace(/in (\d+) minutes?/, '$1 মিনিটের মধ্যে');

      return useBanglaNumerals ? toBanglaDigits(bn) : bn;
    }

    return relative;
  } catch (err) {
    return isoDateString;
  }
}

export interface SlaStatus {
  isOverdue: boolean;
  hoursRemaining: number;
  minutesRemaining: number;
  displayText: string;
  badgeColor: 'green' | 'amber' | 'red';
  percentageElapsed: number;
}

/**
 * Calculates remaining SLA time for law enforcement action (e.g. 24h for initial response, 72h for report)
 */
export function calculateSla(
  createdAtIso: string,
  slaDueAtIso: string,
  useBanglaNumerals: boolean = false,
  lang: 'bn' | 'en' = 'bn'
): SlaStatus {
  const now = new Date();
  const due = parseISO(slaDueAtIso);
  const created = parseISO(createdAtIso);

  const totalDurationMs = due.getTime() - created.getTime();
  const elapsedMs = now.getTime() - created.getTime();
  const remainingMs = due.getTime() - now.getTime();

  const percentageElapsed = Math.min(
    100,
    Math.max(0, Math.round((elapsedMs / (totalDurationMs || 1)) * 100))
  );

  const isOverdue = isAfter(now, due);

  const totalMinutesRemaining = Math.abs(Math.round(remainingMs / (1000 * 60)));
  const hours = Math.floor(totalMinutesRemaining / 60);
  const minutes = totalMinutesRemaining % 60;

  let badgeColor: 'green' | 'amber' | 'red' = 'green';
  if (isOverdue) {
    badgeColor = 'red';
  } else if (hours < 6) {
    badgeColor = 'amber';
  }

  let displayText = '';
  if (isOverdue) {
    displayText =
      lang === 'bn'
        ? `এসএলএ সময়সীমা পার হয়েছে (${hours} ঘণ্টা ${minutes} মিনিট পূর্বে)`
        : `SLA Overdue by ${hours}h ${minutes}m`;
  } else {
    displayText =
      lang === 'bn'
        ? `${hours} ঘণ্টা ${minutes} মিনিট বাকি`
        : `${hours}h ${minutes}m remaining`;
  }

  if (useBanglaNumerals && lang === 'bn') {
    displayText = toBanglaDigits(displayText);
  }

  return {
    isOverdue,
    hoursRemaining: hours,
    minutesRemaining: minutes,
    displayText,
    badgeColor,
    percentageElapsed,
  };
}
