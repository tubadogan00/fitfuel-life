import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useRef, useState, type PropsWithChildren } from 'react';

import { sessionHeaders } from '@/components/auth-session';
import { emptyJournal as initial, isJournal, mergeJournal, type Journal, type MealNutrition } from '@/utils/journal-sync';

type JournalContextValue = {
  journal: Journal;
  ready: boolean;
  error: string;
  reload: () => void;
  update: (change: (current: Journal) => Journal) => void;
};

const legacyKey = 'fitness-journal-v1';
const legacyOwnerKey = 'fitness-journal-v1-owner';
const JournalContext = createContext<JournalContextValue | null>(null);
const guestJournal: JournalContextValue = { journal: initial, ready: true, error: '', update() {}, reload() {} };

export function GuestJournalProvider({ children }: PropsWithChildren) {
  return <JournalContext.Provider value={guestJournal}>{children}</JournalContext.Provider>;
}

let pendingMigration = Promise.resolve();

function loadJournal(key: string, accountId: string) {
  const read = pendingMigration.then(async () => {
    const saved = await AsyncStorage.getItem(key);
    if (saved !== null) return saved;

    const [legacy, owner] = await Promise.all([
      AsyncStorage.getItem(legacyKey),
      AsyncStorage.getItem(legacyOwnerKey),
    ]);
    if (legacy === null || (owner !== null && owner !== accountId)) return null;

    await AsyncStorage.setItem(legacyOwnerKey, accountId);
    await AsyncStorage.setItem(key, legacy);
    return legacy;
  });
  pendingMigration = read.then(() => {}, () => {});
  return read;
}

export function dateKey(date = new Date()) {
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-');
}

export function JournalProvider({ children, accountId }: PropsWithChildren<{ accountId: string }>) {
  const key = `fitness-journal-v2:${accountId}`;
  const [journal, setJournal] = useState(initial);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState('');
  const [syncError, setSyncError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const current = useRef(initial);
  const base = useRef(initial);
  const pending = useRef(Promise.resolve());
  const requestSync = useRef<(() => void) | null>(null);

  const persist = useCallback((next: Journal) => {
    const encoded = JSON.stringify({ ...next, syncBase: base.current });
    pending.current = pending.current.then(async () => {
      try {
        await AsyncStorage.setItem(key, encoded);
        setStorageError('');
      } catch {
        setStorageError('Değişiklikler cihaza kaydedilemedi.');
      }
    });
    return pending.current;
  }, [key]);

  useEffect(() => {
    let active = true;
    loadJournal(key, accountId).then((raw) => {
      if (!active) return;
      const stored: Journal & { syncBase?: Journal } = raw ? JSON.parse(raw) : initial;
      const { syncBase, ...saved } = stored;
      if (!isJournal(saved)) throw new Error('Invalid journal');
      current.current = saved;
      base.current = isJournal(syncBase) ? syncBase : initial;
      setJournal(current.current);
      setStorageError('');
      setReady(true);
    }).catch(() => {
      if (active) setStorageError('Kayıtlar açılamadı.');
    });
    return () => { active = false; };
  }, [accountId, attempt, key]);

  useEffect(() => {
    if (!ready) return;
    let active = true;
    let disabled = false;
    let busy = false;
    let queued = false;
    let controller: AbortController | undefined;

    async function sync() {
      if (!active || disabled) return;
      if (busy) {
        queued = true;
        return;
      }
      busy = true;
      const sent = current.current;
      controller = new AbortController();
      const timeout = setTimeout(() => controller?.abort(), 20_000);
      try {
        const headers = await sessionHeaders();
        if (!active) return;
        const response = await fetch('/journal-sync', {
          method: 'POST',
          headers: { ...headers, 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          signal: controller.signal,
          body: JSON.stringify({ accountId, base: base.current, local: sent }),
        });
        if (!response.ok) throw new Error();
        const result = await response.json() as { enabled?: boolean; journal?: unknown };
        if (!active) return;
        if (result.enabled === false) {
          disabled = true;
          return;
        }
        if (!isJournal(result.journal)) throw new Error();

        const next = mergeJournal(sent, current.current, result.journal);
        const changed = JSON.stringify(next) !== JSON.stringify(current.current);
        const baseChanged = JSON.stringify(base.current) !== JSON.stringify(result.journal);
        base.current = result.journal;
        if (changed) {
          current.current = next;
          setJournal(next);
        }
        if (changed || baseChanged) void persist(next);
        setSyncError('');
      } catch {
        if (active) setSyncError('Bulutla eşitlenemedi. Cihazdaki kayıtların korunuyor.');
      } finally {
        clearTimeout(timeout);
        busy = false;
        if (queued) {
          queued = false;
          void sync();
        }
      }
    }

    requestSync.current = () => { void sync(); };
    void sync();
    const timer = setInterval(() => { void sync(); }, 20_000);
    return () => {
      active = false;
      controller?.abort();
      clearInterval(timer);
      requestSync.current = null;
    };
  }, [accountId, persist, ready]);

  function update(change: (value: Journal) => Journal) {
    if (!ready) return;
    const next = change(current.current);
    current.current = next;
    setJournal(next);
    void persist(next).then(() => requestSync.current?.());
  }

  function reload() {
    if (ready) {
      update((value) => value);
    } else {
      setAttempt((value) => value + 1);
    }
  }

  return <JournalContext.Provider value={{ journal, ready, error: storageError || syncError, reload, update }}>{children}</JournalContext.Provider>;
}

export function useJournal() {
  const context = useContext(JournalContext);
  if (!context) throw new Error('JournalProvider is required');
  return context;
}

export function addMeal(journal: Journal, name: string, calories: number, nutrition?: MealNutrition): Journal {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return { ...journal, meals: [...journal.meals, { id, date: dateKey(), name, calories, ...nutrition }] };
}
