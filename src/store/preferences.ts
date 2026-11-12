import { create } from 'zustand';

export type SchemePreference = 'system' | 'light' | 'dark';

interface PreferencesState {
  /** Appearance override. Persisted in Phase 3. */
  scheme: SchemePreference;
  setScheme: (scheme: SchemePreference) => void;
}

export const usePreferencesStore = create<PreferencesState>((set) => ({
  scheme: 'system',
  setScheme: (scheme) => set({ scheme }),
}));
