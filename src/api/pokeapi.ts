import type {
  EvolutionChainResponse,
  PokemonListResponse,
  PokemonResponse,
  SpeciesResponse,
  TypeResponse,
} from './types';

const BASE_URL = 'https://pokeapi.co/api/v2';

/** Número de Pokémon con ficha completa (hasta la generación 9). */
export const MAX_POKEMON = 1025;

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function get<T>(url: string): Promise<T> {
  const res = await fetch(url.startsWith('http') ? url : `${BASE_URL}${url}`);
  if (!res.ok) {
    throw new ApiError(res.status, res.status === 404 ? 'No encontrado' : `Error ${res.status} al consultar la PokeAPI`);
  }
  return res.json() as Promise<T>;
}

/** Extrae el número de un recurso a partir de su URL (…/pokemon/25/ → 25). */
export function idFromUrl(url: string): number {
  const match = url.match(/\/(\d+)\/?$/);
  return match ? Number(match[1]) : NaN;
}

export const artworkUrl = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

export interface PokemonSummary {
  id: number;
  name: string;
}

/** Índice ligero con nombre y número de todos los Pokémon: una sola petición. */
export async function fetchPokemonIndex(): Promise<PokemonSummary[]> {
  const data = await get<PokemonListResponse>(`/pokemon?limit=${MAX_POKEMON}`);
  return data.results
    .map((r) => ({ id: idFromUrl(r.url), name: r.name }))
    .filter((p) => p.id <= MAX_POKEMON);
}

export const fetchPokemon = (idOrName: number | string) =>
  get<PokemonResponse>(`/pokemon/${String(idOrName).toLowerCase()}`);

export const fetchSpecies = (id: number) => get<SpeciesResponse>(`/pokemon-species/${id}`);

export const fetchEvolutionChain = (url: string) => get<EvolutionChainResponse>(url);

/** Números de los Pokémon de un tipo. */
export async function fetchTypeMembers(type: string): Promise<Set<number>> {
  const data = await get<TypeResponse>(`/type/${type}`);
  return new Set(data.pokemon.map((p) => idFromUrl(p.pokemon.url)).filter((id) => id <= MAX_POKEMON));
}
