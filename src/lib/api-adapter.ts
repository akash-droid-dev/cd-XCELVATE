import { buildDedupeKey, cleanName, toDirectDriveUrl } from './utils';
import type { ApiMappedPayload, ApiRawRow, Participant } from './types';

/**
 * Isolated API mapper.
 * TODO(user): Replace row extraction if your real API returns nested payloads.
 */
export const mapApiPayload = (raw: unknown): ApiMappedPayload => {
  const payload = (raw ?? {}) as Record<string, unknown>;

  // Flexible row source support.
  const rows =
    (Array.isArray(payload) ? payload : undefined) ||
    (Array.isArray(payload.rows) ? (payload.rows as ApiRawRow[]) : undefined) ||
    (Array.isArray(payload.data) ? (payload.data as ApiRawRow[]) : undefined) ||
    (Array.isArray(payload.participants) ? (payload.participants as ApiRawRow[]) : []);

  const participants: Participant[] = [];

  for (const row of rows) {
    try {
      const fullName = cleanName(String(row.fullName || ''));
      if (!fullName) continue;

      const pledgeAmount = Number(row.pledgeAmount ?? 0);
      const timestamp = row.timestamp ? String(row.timestamp) : undefined;
      const photoUrl = toDirectDriveUrl(row.photoUrl ? String(row.photoUrl) : undefined);
      const id = row.id ? String(row.id) : undefined;

      participants.push({
        dedupeKey: buildDedupeKey(id, timestamp, fullName, photoUrl),
        id,
        fullName,
        photoUrl,
        pledgeAmount: Number.isFinite(pledgeAmount) ? pledgeAmount : 0,
        timestamp,
        updatedAtMs: Date.now(),
      });
    } catch {
      // malformed row protection
    }
  }

  const aggregateAmount = Number(
    (payload.aggregateAmount as number | string | undefined) ??
      (payload.totalPledgeAmount as number | string | undefined) ??
      NaN,
  );
  const aggregateParticipants = Number(
    (payload.aggregateParticipants as number | string | undefined) ??
      (payload.totalParticipants as number | string | undefined) ??
      NaN,
  );

  return {
    participants,
    aggregateAmount: Number.isFinite(aggregateAmount) ? aggregateAmount : undefined,
    aggregateParticipants: Number.isFinite(aggregateParticipants) ? aggregateParticipants : undefined,
  };
};
