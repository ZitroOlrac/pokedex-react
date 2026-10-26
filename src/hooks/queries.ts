import { useQuery } from '@tanstack/react-query';
import {
  fetchEvolutionChain,
  fetchPokemon,
  fetchPokemonIndex,
  fetchSpecies,
  fetchTypeMembers,
} from '../api/pokeapi';

// Los datos de la PokeAPI casi no cambian: se guardan en caché mucho tiempo.
const DAY = 24 * 60 * 60 * 1000;

export const usePokemonIndex = () =>
  useQuery({ queryKey: ['index'], queryFn: fetchPokemonIndex, staleTime: DAY });

export const usePokemon = (id: number) =>
  useQuery({ queryKey: ['pokemon', id], queryFn: () => fetchPokemon(id), staleTime: DAY, enabled: id > 0 });

export const useSpecies = (id: number) =>
  useQuery({ queryKey: ['species', id], queryFn: () => fetchSpecies(id), staleTime: DAY, enabled: id > 0 });

export const useEvolutionChain = (url?: string) =>
  useQuery({
    queryKey: ['evolution', url],
    queryFn: () => fetchEvolutionChain(url!),
    staleTime: DAY,
    enabled: Boolean(url),
  });

export const useTypeMembers = (type: string) =>
  useQuery({ queryKey: ['type', type], queryFn: () => fetchTypeMembers(type), staleTime: DAY, enabled: Boolean(type) });
