import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useRef, useState, type PropsWithChildren } from 'react';

type Meal = { id: string; date: string; name: string; calories: number };
type Journal = { goal: number | null; meals: Meal[]; workouts: Record<string, string[]> };
type JournalContextValue = {
  journal: Journal;
  ready: boolean;
  error: string;
  reload: () => void;
  update: (change: (current: Journal) => Journal) => void;
};

const key = 'fitness-journal-v1';
const initial: Journal = { goal: null, meals: [], workouts: {} };
const JournalContext = createContext<JournalContextValue | null>(null);

export function dateKey(date = new Date()) {
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-');
}

export function JournalProvider({ children }: PropsWithChildren) {
  const [journal, setJournal] = useState(initial);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const current = useRef(initial);
  const pending = useRef(Promise.resolve());

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(key).then((raw) => {
      if (!active) return;
      current.current = raw ? JSON.parse(raw) as Journal : initial;
      setJournal(current.current);
      setError('');
      setReady(true);
    }).catch(() => {
      if (active) setError('Kayıtlar açılamadı.');
    });
    return () => { active = false; };
  }, [attempt]);

  function update(change: (value: Journal) => Journal) {
    if (!ready) return;
    const next = change(current.current);
    current.current = next;
    setJournal(next);
    pending.current = pending.current.then(async () => {
      try {
        await AsyncStorage.setItem(key, JSON.stringify(next));
        setError('');
      } catch {
        setError('Değişiklikler cihaza kaydedilemedi.');
      }
    });
  }

  function reload() {
    if (ready) {
      update((value) => value);
    } else {
      setAttempt((value) => value + 1);
    }
  }

  return <JournalContext.Provider value={{ journal, ready, error, reload, update }}>{children}</JournalContext.Provider>;
}

export function useJournal() {
  const context = useContext(JournalContext);
  if (!context) throw new Error('JournalProvider is required');
  return context;
}

export function addMeal(journal: Journal, name: string, calories: number): Journal {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return { ...journal, meals: [...journal.meals, { id, date: dateKey(), name, calories }] };
}
