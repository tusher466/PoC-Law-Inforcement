import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Role } from '../types';
import { ROLE_CONFIGS } from '../lib/rbac';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  nidFake: string;
  stationId: string;
  badgeNumber?: string;
  designation?: string;
  trustedContacts: { name: string; phone: string; relation: string }[];
}

interface AuthState {
  isAuthenticated: boolean;
  currentRole: Role;
  language: 'bn' | 'en';
  useBanglaNumerals: boolean;
  isHighContrast: boolean;
  isLargeText: boolean;
  simulatedOtp: string;
  user: UserProfile;

  setRole: (role: Role) => void;
  setLanguage: (lang: 'bn' | 'en') => void;
  setUseBanglaNumerals: (val: boolean) => void;
  setHighContrast: (val: boolean) => void;
  setLargeText: (val: boolean) => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  login: (role?: Role, profile?: Partial<UserProfile>) => void;
  register: (profile: Partial<UserProfile>, role?: Role) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: true,
      currentRole: 'citizen',
      language: 'bn',
      useBanglaNumerals: false,
      isHighContrast: false,
      isLargeText: false,
      simulatedOtp: '123456',
      user: {
        id: 'cit-001',
        name: 'রহিমা খাতুন',
        phone: '01712-345678',
        nidFake: '১৯৮৮২৬৯২৬১২৩৪৫৬৭৮',
        stationId: 'dhanmondi',
        trustedContacts: [
          { name: 'আব্দুল করিম (স্বামী)', phone: '01711-998877', relation: 'স্বামী' },
          { name: 'সালমা খাতুন (বোন)', phone: '01819-334455', relation: 'বোন' },
          { name: 'মুরাদ হোসেন (ভাই)', phone: '01912-556677', relation: 'ভাই' },
        ],
      },

      setRole: (role) => set({ currentRole: role, isAuthenticated: true }),
      setLanguage: (lang) => set({ language: lang }),
      setUseBanglaNumerals: (val) => set({ useBanglaNumerals: val }),
      setHighContrast: (val) => set({ isHighContrast: val }),
      setLargeText: (val) => set({ isLargeText: val }),
      updateUser: (updates) =>
        set((state) => ({ user: { ...state.user, ...updates } })),
      login: (role = 'citizen', profileUpdates) =>
        set((state) => ({
          isAuthenticated: true,
          currentRole: role,
          user: profileUpdates ? { ...state.user, ...profileUpdates } : state.user,
        })),
      register: (newProfile, role = 'citizen') =>
        set((state) => ({
          isAuthenticated: true,
          currentRole: role,
          user: { ...state.user, ...newProfile },
        })),
      logout: () => set({ isAuthenticated: false }),
    }),
    {
      name: 'nyayasetu_auth_storage',
    }
  )
);
