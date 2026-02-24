import { create } from 'zustand';
import type { Participant, PollStatus } from '../lib/types';
import { mergeIncrementalParticipants } from '../lib/utils';

type LiveState = {
  byKey: Record<string, Participant>;
  sortedKeys: string[];
  status: PollStatus;
  lastSuccessAt: number | null;
  lastAttemptAt: number | null;
  stale: boolean;
  errorMessage: string | null;
  aggregateAmount?: number;
  aggregateParticipants?: number;
  upsertBatch: (participants: Participant[], aggregateAmount?: number, aggregateParticipants?: number) => void;
  setStatus: (status: PollStatus) => void;
  setError: (message: string | null) => void;
  markStale: (stale: boolean) => void;
  markAttempt: () => void;
};

export const useLiveStore = create<LiveState>((set, get) => ({
  byKey: {},
  sortedKeys: [],
  status: 'idle',
  lastSuccessAt: null,
  lastAttemptAt: null,
  stale: false,
  errorMessage: null,
  aggregateAmount: undefined,
  aggregateParticipants: undefined,
  upsertBatch: (participants, aggregateAmount, aggregateParticipants) => {
    const { byKey: prev } = get();
    const { byKey } = mergeIncrementalParticipants(prev, participants);
    const sortedKeys = Object.keys(byKey).sort((a, b) => {
      const aT = byKey[a].timestamp || '';
      const bT = byKey[b].timestamp || '';
      return bT.localeCompare(aT);
    });

    set({
      byKey,
      sortedKeys,
      status: 'ok',
      stale: false,
      errorMessage: null,
      lastSuccessAt: Date.now(),
      aggregateAmount,
      aggregateParticipants,
    });
  },
  setStatus: (status) => set({ status }),
  setError: (errorMessage) => set({ errorMessage, status: 'error' }),
  markStale: (stale) => set({ stale }),
  markAttempt: () => set({ lastAttemptAt: Date.now() }),
}));

export const useParticipants = (): Participant[] =>
  useLiveStore((s) => s.sortedKeys.map((key) => s.byKey[key]));

export const useTotals = (): { totalAmount: number; totalParticipants: number } =>
  useLiveStore((s) => {
    const values = s.sortedKeys.map((key) => s.byKey[key]);
    const derivedAmount = values.reduce((acc, p) => acc + p.pledgeAmount, 0);
    return {
      totalAmount: s.aggregateAmount ?? derivedAmount,
      totalParticipants: s.aggregateParticipants ?? values.length,
    };
  });
