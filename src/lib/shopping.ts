import { useEffect, useState, useCallback } from 'react';

const SHOPPING_STATE_KEY = 'recipeworld:shoppingState';
const SHOPPING_EXTRAS_KEY = 'recipeworld:shoppingExtras';

export interface ShoppingItem {
  /** Stable key derived from ingredient text + source so toggling persists. */
  key: string;
  text: string;
  /** Source recipe id; null/undefined for manually-added items. */
  recipeId?: string;
  recipeTitle?: string;
  checked: boolean;
}

const safeRead = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) ?? fallback;
  } catch {
    return fallback;
  }
};

const safeWrite = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
};

const makeKey = (recipeId: string | undefined, text: string): string =>
  `${recipeId ?? 'extra'}::${text.toLowerCase().trim()}`;

interface ShoppingSource {
  id: string | number;
  title: string;
  ingredients?: string[];
}

/**
 * Builds a unified shopping list from a set of source recipes (typically the
 * user's saved recipes) plus user-added extras. Checked state persists, so
 * users can keep ticking items off across sessions.
 */
export function useShoppingList(sources: ShoppingSource[]): {
  items: ShoppingItem[];
  toggleItem: (key: string) => void;
  addExtra: (text: string) => void;
  removeExtra: (key: string) => void;
  clearChecked: () => void;
  clearAll: () => void;
} {
  // checked: { [key]: boolean }
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>(() =>
    safeRead<Record<string, boolean>>(SHOPPING_STATE_KEY, {}),
  );
  // extras: free-form items not tied to a recipe
  const [extras, setExtras] = useState<Array<{ key: string; text: string }>>(() =>
    safeRead<Array<{ key: string; text: string }>>(SHOPPING_EXTRAS_KEY, []),
  );

  useEffect(() => {
    safeWrite(SHOPPING_STATE_KEY, checkedMap);
  }, [checkedMap]);
  useEffect(() => {
    safeWrite(SHOPPING_EXTRAS_KEY, extras);
  }, [extras]);

  const items: ShoppingItem[] = [];
  const seenKeys = new Set<string>();
  for (const recipe of sources) {
    const ingredients = recipe.ingredients ?? [];
    for (const ingredient of ingredients) {
      const text = ingredient.trim();
      if (!text) continue;
      const key = makeKey(String(recipe.id), text);
      if (seenKeys.has(key)) continue;
      seenKeys.add(key);
      items.push({
        key,
        text,
        recipeId: String(recipe.id),
        recipeTitle: recipe.title,
        checked: checkedMap[key] === true,
      });
    }
  }
  for (const extra of extras) {
    if (seenKeys.has(extra.key)) continue;
    seenKeys.add(extra.key);
    items.push({
      key: extra.key,
      text: extra.text,
      checked: checkedMap[extra.key] === true,
    });
  }

  const toggleItem = useCallback((key: string) => {
    setCheckedMap((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const addExtra = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const key = makeKey(undefined, trimmed);
    setExtras((prev) => (prev.some((e) => e.key === key) ? prev : [...prev, { key, text: trimmed }]));
  }, []);

  const removeExtra = useCallback((key: string) => {
    setExtras((prev) => prev.filter((e) => e.key !== key));
    setCheckedMap((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const clearChecked = useCallback(() => {
    setCheckedMap({});
  }, []);

  const clearAll = useCallback(() => {
    setCheckedMap({});
    setExtras([]);
  }, []);

  return { items, toggleItem, addExtra, removeExtra, clearChecked, clearAll };
}
