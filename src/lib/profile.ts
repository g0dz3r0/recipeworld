import { useEffect, useState, useCallback } from 'react';

const PROFILE_STORAGE_KEY = 'recipeworld:profile';

export interface MyProfile {
  username: string;
  bio: string;
  avatarUrl: string;
}

const DEFAULT_PROFILE: MyProfile = {
  username: 'Николай Кулинаров',
  bio: '',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
};

const readProfile = (): MyProfile => {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    const parsed = JSON.parse(raw) as Partial<MyProfile>;
    return {
      username: typeof parsed.username === 'string' && parsed.username.trim() ? parsed.username : DEFAULT_PROFILE.username,
      bio: typeof parsed.bio === 'string' ? parsed.bio : DEFAULT_PROFILE.bio,
      avatarUrl: typeof parsed.avatarUrl === 'string' && parsed.avatarUrl ? parsed.avatarUrl : DEFAULT_PROFILE.avatarUrl,
    };
  } catch {
    return DEFAULT_PROFILE;
  }
};

const writeProfile = (profile: MyProfile) => {
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // ignore quota / privacy mode errors — the user keeps the in-memory version
  }
};

export function useProfile(): {
  profile: MyProfile;
  updateProfile: (next: Partial<MyProfile>) => void;
  resetProfile: () => void;
} {
  const [profile, setProfile] = useState<MyProfile>(() => readProfile());

  // Persist every change. Skip the initial render — it would be a no-op write
  // of the same content we just read, but it would also clobber the default
  // if reading failed and we want to keep "no key set yet" semantics.
  useEffect(() => {
    writeProfile(profile);
  }, [profile]);

  const updateProfile = useCallback((next: Partial<MyProfile>) => {
    setProfile((prev) => ({ ...prev, ...next }));
  }, []);

  const resetProfile = useCallback(() => {
    setProfile(DEFAULT_PROFILE);
  }, []);

  return { profile, updateProfile, resetProfile };
}
