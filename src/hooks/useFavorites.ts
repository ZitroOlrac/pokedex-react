import { createContext, useContext } from 'react';

export interface FavoritesValue {
  ids: number[];
  isFavorite: (id: number) => boolean;
  toggle: (id: number) => void;
}

export const FavoritesContext = createContext<FavoritesValue | null>(null);

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites debe usarse dentro de <FavoritesProvider>');
  return ctx;
}
