import { useEffect, useState, useCallback } from 'react';

const LIKES_STORAGE_KEY = 'recipeworld:likedRecipes';
const COMMENTS_STORAGE_KEY = 'recipeworld:comments';
const RATINGS_STORAGE_KEY = 'recipeworld:ratings';

export interface RecipeComment {
  id: string;
  recipeId: string;
  author: string;
  avatarUrl: string;
  text: string;
  createdAt: number;
}

const safeReadJson = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
};

const safeWriteJson = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota / privacy mode — drop silently
  }
};

/**
 * Tracks which recipe ids the current user has liked. Persistent across
 * reloads so the heart stays filled and the count stays bumped.
 */
export function useLikes(): {
  likedIds: Set<string>;
  isLiked: (recipeId: string | number) => boolean;
  toggleLike: (recipeId: string | number) => void;
} {
  const [likedIds, setLikedIds] = useState<Set<string>>(() => {
    const arr = safeReadJson<string[]>(LIKES_STORAGE_KEY, []);
    return new Set(Array.isArray(arr) ? arr.filter((v): v is string => typeof v === 'string') : []);
  });

  useEffect(() => {
    safeWriteJson(LIKES_STORAGE_KEY, Array.from(likedIds));
  }, [likedIds]);

  const isLiked = useCallback(
    (recipeId: string | number) => likedIds.has(String(recipeId)),
    [likedIds],
  );

  const toggleLike = useCallback((recipeId: string | number) => {
    const key = String(recipeId);
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  return { likedIds, isLiked, toggleLike };
}

/**
 * Per-recipe comment threads. Stored as `{ [recipeId]: RecipeComment[] }`
 * so we don't have to scan a flat list to render a thread.
 */
export function useComments(): {
  getComments: (recipeId: string | number) => RecipeComment[];
  addComment: (recipeId: string | number, comment: Omit<RecipeComment, 'id' | 'createdAt' | 'recipeId'>) => RecipeComment;
  removeComment: (recipeId: string | number, commentId: string) => void;
} {
  const [byRecipe, setByRecipe] = useState<Record<string, RecipeComment[]>>(() =>
    safeReadJson<Record<string, RecipeComment[]>>(COMMENTS_STORAGE_KEY, {}),
  );

  useEffect(() => {
    safeWriteJson(COMMENTS_STORAGE_KEY, byRecipe);
  }, [byRecipe]);

  const getComments = useCallback(
    (recipeId: string | number) => byRecipe[String(recipeId)] ?? [],
    [byRecipe],
  );

  const addComment = useCallback(
    (recipeId: string | number, draft: Omit<RecipeComment, 'id' | 'createdAt' | 'recipeId'>) => {
      const key = String(recipeId);
      const comment: RecipeComment = {
        id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        recipeId: key,
        createdAt: Date.now(),
        ...draft,
      };
      setByRecipe((prev) => ({
        ...prev,
        [key]: [...(prev[key] ?? []), comment],
      }));
      return comment;
    },
    [],
  );

  const removeComment = useCallback((recipeId: string | number, commentId: string) => {
    const key = String(recipeId);
    setByRecipe((prev) => ({
      ...prev,
      [key]: (prev[key] ?? []).filter((c) => c.id !== commentId),
    }));
  }, []);

  return { getComments, addComment, removeComment };
}

/**
 * Per-recipe star rating (1–5). Stored as a flat `{ [recipeId]: number }`.
 * There's only one user, so "my rating" is also "the rating".
 */
export function useRatings(): {
  getRating: (recipeId: string | number) => number;
  setRating: (recipeId: string | number, rating: number) => void;
  clearRating: (recipeId: string | number) => void;
} {
  const [ratings, setRatings] = useState<Record<string, number>>(() =>
    safeReadJson<Record<string, number>>(RATINGS_STORAGE_KEY, {}),
  );

  useEffect(() => {
    safeWriteJson(RATINGS_STORAGE_KEY, ratings);
  }, [ratings]);

  const getRating = useCallback(
    (recipeId: string | number) => ratings[String(recipeId)] ?? 0,
    [ratings],
  );

  const setRating = useCallback((recipeId: string | number, rating: number) => {
    const clamped = Math.max(1, Math.min(5, Math.round(rating)));
    const key = String(recipeId);
    setRatings((prev) => ({ ...prev, [key]: clamped }));
  }, []);

  const clearRating = useCallback((recipeId: string | number) => {
    const key = String(recipeId);
    setRatings((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  return { getRating, setRating, clearRating };
}
