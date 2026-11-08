import { useEffect, useState } from 'react';
import {
  INITIAL_MEMBERS,
  INITIAL_TALLIES,
  MemberProfile,
  TallyTransaction,
} from '../data/mockData';

function usePersisted<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? (JSON.parse(saved) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue] as const;
}

const nowHHMM = () =>
  new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

/** Demo data store for Design B (stand-in for Supabase until the real backend exists). */
export function useDemoStore() {
  const [members, setMembers] = usePersisted<MemberProfile[]>('kingsB_members', INITIAL_MEMBERS);
  const [tallies, setTallies] = usePersisted<TallyTransaction[]>('kingsB_tallies', INITIAL_TALLIES);

  const updateMember = (id: string, patch: Partial<MemberProfile>) =>
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));

  const addMember = (m: MemberProfile) => setMembers((prev) => [m, ...prev]);

  const logCut = (id: string, shopId: string) =>
    setMembers((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              totalCutsThisYear: m.totalCutsThisYear + 1,
              lastCutDate: `Today ${nowHHMM()}`,
              lastCutShopId: shopId,
              photoLocked: true,
            }
          : m
      )
    );

  const addTally = (tx: Omit<TallyTransaction, 'id' | 'timestamp'>) =>
    setTallies((prev) => [{ ...tx, id: `t-${Date.now()}`, timestamp: nowHHMM() }, ...prev]);

  const undoTally = (shopId: string) =>
    setTallies((prev) => {
      const i = prev.findIndex((t) => t.shopId === shopId);
      if (i < 0) return prev;
      const copy = [...prev];
      copy.splice(i, 1);
      return copy;
    });

  const resetDemo = () => {
    setMembers(INITIAL_MEMBERS);
    setTallies(INITIAL_TALLIES);
  };

  return { members, tallies, updateMember, addMember, logCut, addTally, undoTally, resetDemo };
}

export type DemoStore = ReturnType<typeof useDemoStore>;
