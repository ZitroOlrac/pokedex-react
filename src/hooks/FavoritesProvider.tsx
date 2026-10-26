import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { FavoritesContext, type FavoritesValue } from './useFavorites';

const KEY = 'pokedex-react:favoritos';

function load(): number[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter((n): n is number => Number.isInteger(n)) : [];
  } catch {
    return [];
  }
}

/** Favoritos guardados en localStorage y sincronizados entre pestañas. */
export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<number[]>(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(ids));
    } catch {
      /* Sin almacenamiento: los favoritos viven solo en memoria. */
    }
  }, [ids]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setIds(load());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const toggle = useCallback(
    (id: number) =>
      setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id].sort((a, b) => a - b))),
    [],
  );

  const value = useMemo<FavoritesValue>(() => ({ ids, isFavorite: (id) => ids.includes(id), toggle }), [ids, toggle]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}
