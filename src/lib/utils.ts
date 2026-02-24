import type { Participant } from './types';

const driveIdRegexes = [
  /drive\.google\.com\/file\/d\/([^/]+)/i,
  /drive\.google\.com\/open\?id=([^&]+)/i,
  /drive\.google\.com\/uc\?id=([^&]+)/i,
  /[?&]id=([^&]+)/i,
];

export const toDirectDriveUrl = (url?: string): string | undefined => {
  if (!url) return undefined;
  if (!url.includes('drive.google.com')) return url;

  for (const pattern of driveIdRegexes) {
    const match = url.match(pattern);
    if (match?.[1]) return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  return url;
};

export const formatINR = (amount: number): string =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number.isFinite(amount) ? amount : 0);

export const cleanName = (name: string): string => name.replace(/\s+/g, ' ').trim();

export const simpleHash = (value: string): string => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return `${Math.abs(hash)}`;
};

export const buildDedupeKey = (
  id?: string,
  timestamp?: string,
  fullName?: string,
  photoUrl?: string,
): string => {
  if (id) return `id:${id}`;
  if (timestamp) return `ts:${timestamp}`;
  return `sig:${simpleHash(`${cleanName(fullName || '')}|${photoUrl || ''}`)}`;
};

export const mergeIncrementalParticipants = (
  previousByKey: Record<string, Participant>,
  incoming: Participant[],
): { byKey: Record<string, Participant>; changedCount: number } => {
  const byKey = { ...previousByKey };
  let changedCount = 0;

  for (const next of incoming) {
    const prev = byKey[next.dedupeKey];
    if (!prev) {
      byKey[next.dedupeKey] = next;
      changedCount += 1;
      continue;
    }

    if (
      prev.fullName !== next.fullName ||
      prev.photoUrl !== next.photoUrl ||
      prev.pledgeAmount !== next.pledgeAmount ||
      prev.timestamp !== next.timestamp
    ) {
      byKey[next.dedupeKey] = { ...prev, ...next };
      changedCount += 1;
    }
  }

  return { byKey, changedCount };
};
