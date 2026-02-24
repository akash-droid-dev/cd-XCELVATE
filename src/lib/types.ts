export type ApiRawRow = {
  id?: string;
  fullName?: string;
  photoUrl?: string;
  pledgeAmount?: number | string;
  timestamp?: string;
  [key: string]: unknown;
};

export type Participant = {
  dedupeKey: string;
  id?: string;
  fullName: string;
  photoUrl?: string;
  pledgeAmount: number;
  timestamp?: string;
  updatedAtMs: number;
};

export type ApiMappedPayload = {
  participants: Participant[];
  aggregateAmount?: number;
  aggregateParticipants?: number;
};

export type PollStatus = 'idle' | 'loading' | 'ok' | 'error';
