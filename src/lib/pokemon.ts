import type { ChainLink } from '../api/types';
import { idFromUrl, type PokemonSummary } from '../api/pokeapi';

export const TYPES: Record<string, { label: string; color: string }> = {
  normal: { label: 'Normal', color: '#9fa19f' },
  fire: { label: 'Fuego', color: '#e62829' },
  water: { label: 'Agua', color: '#2980ef' },
  grass: { label: 'Planta', color: '#3fa129' },
  electric: { label: 'Eléctrico', color: '#e5b000' },
  ice: { label: 'Hielo', color: '#3dcef3' },
  fighting: { label: 'Lucha', color: '#ff8000' },
  poison: { label: 'Veneno', color: '#9141cb' },
  ground: { label: 'Tierra', color: '#915121' },
  flying: { label: 'Volador', color: '#81b9ef' },
  psychic: { label: 'Psíquico', color: '#ef4179' },
  bug: { label: 'Bicho', color: '#91a119' },
  rock: { label: 'Roca', color: '#afa981' },
  ghost: { label: 'Fantasma', color: '#704170' },
  dragon: { label: 'Dragón', color: '#5060e1' },
  dark: { label: 'Siniestro', color: '#624d4e' },
  steel: { label: 'Acero', color: '#60a1b8' },
  fairy: { label: 'Hada', color: '#ef70ef' },
};

export const typeInfo = (type: string) => TYPES[type] ?? { label: type, color: '#888' };

export const STAT_LABELS: Record<string, string> = {
  hp: 'PS',
  attack: 'Ataque',
  defense: 'Defensa',
  'special-attack': 'At. esp.',
  'special-defense': 'Def. esp.',
  speed: 'Velocidad',
};

export const formatNumber = (id: number) => `#${String(id).padStart(4, '0')}`;

/** "mr-mime" → "Mr Mime" */
export const prettyName = (name: string) =>
  name
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

/**
 * Filtra el índice por texto (nombre o número) y, opcionalmente, por los
 * números que pertenecen a un tipo. Es una función pura para poder testearla.
 */
export function filterIndex(index: PokemonSummary[], query: string, typeIds?: Set<number>): PokemonSummary[] {
  const q = query.trim().toLowerCase().replace(/^#/, '');
  const asNumber = /^\d+$/.test(q) ? Number(q) : null;
  return index.filter((p) => {
    if (typeIds && !typeIds.has(p.id)) return false;
    if (!q) return true;
    if (asNumber !== null) return p.id === asNumber || String(p.id).startsWith(q);
    return p.name.includes(q.replace(/\s+/g, '-'));
  });
}

export function paginate<T>(items: T[], page: number, perPage: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const current = Math.min(Math.max(1, page), totalPages);
  return { items: items.slice((current - 1) * perPage, current * perPage), page: current, totalPages };
}

/**
 * Convierte el árbol de evolución en etapas: [[bulbasaur], [ivysaur], [venusaur]].
 * Las ramas (como Eevee) quedan en la misma etapa.
 */
export function flattenEvolution(chain: ChainLink): PokemonSummary[][] {
  const stages: PokemonSummary[][] = [];
  let level: ChainLink[] = [chain];
  while (level.length > 0) {
    stages.push(level.map((l) => ({ id: idFromUrl(l.species.url), name: l.species.name })));
    level = level.flatMap((l) => l.evolves_to);
  }
  return stages;
}

/** Texto de la Pokédex en español sin los saltos de línea del juego. */
export const cleanFlavorText = (text: string) => text.replace(/[\n\f\r­]+/g, ' ').replace(/\s+/g, ' ').trim();
