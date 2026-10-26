import { describe, expect, it } from 'vitest';
import { cleanFlavorText, filterIndex, flattenEvolution, formatNumber, paginate, prettyName } from './pokemon';
import { idFromUrl } from '../api/pokeapi';

const index = [
  { id: 1, name: 'bulbasaur' },
  { id: 4, name: 'charmander' },
  { id: 25, name: 'pikachu' },
  { id: 122, name: 'mr-mime' },
  { id: 250, name: 'ho-oh' },
];

describe('filterIndex', () => {
  it('devuelve todo sin filtros', () => {
    expect(filterIndex(index, '')).toHaveLength(5);
  });

  it('busca por parte del nombre sin importar mayúsculas', () => {
    expect(filterIndex(index, 'CHAR').map((p) => p.name)).toEqual(['charmander']);
  });

  it('busca por número, con o sin #', () => {
    expect(filterIndex(index, '#25').map((p) => p.id)).toEqual([25, 250]);
    expect(filterIndex(index, '4').map((p) => p.id)).toEqual([4]);
  });

  it('acepta nombres con espacios en lugar de guiones', () => {
    expect(filterIndex(index, 'mr mime').map((p) => p.id)).toEqual([122]);
  });

  it('combina texto y tipo', () => {
    expect(filterIndex(index, '', new Set([1, 25])).map((p) => p.id)).toEqual([1, 25]);
    expect(filterIndex(index, 'pika', new Set([1])).length).toBe(0);
  });
});

describe('paginate', () => {
  const items = Array.from({ length: 50 }, (_, i) => i);
  it('calcula páginas y corta los elementos', () => {
    const r = paginate(items, 3, 24);
    expect(r.totalPages).toBe(3);
    expect(r.items).toEqual([48, 49]);
  });
  it('corrige páginas fuera de rango', () => {
    expect(paginate(items, 99, 24).page).toBe(3);
    expect(paginate(items, -2, 24).page).toBe(1);
  });
});

describe('flattenEvolution', () => {
  it('separa la cadena en etapas, incluidas las ramas', () => {
    const species = (name: string, id: number) => ({ name, url: `https://pokeapi.co/api/v2/pokemon-species/${id}/` });
    const chain = {
      species: species('eevee', 133),
      evolves_to: [
        { species: species('vaporeon', 134), evolves_to: [] },
        { species: species('jolteon', 135), evolves_to: [] },
      ],
    };
    expect(flattenEvolution(chain)).toEqual([
      [{ id: 133, name: 'eevee' }],
      [
        { id: 134, name: 'vaporeon' },
        { id: 135, name: 'jolteon' },
      ],
    ]);
  });
});

describe('utilidades', () => {
  it('formatea números y nombres', () => {
    expect(formatNumber(25)).toBe('#0025');
    expect(prettyName('mr-mime')).toBe('Mr Mime');
    expect(idFromUrl('https://pokeapi.co/api/v2/pokemon/25/')).toBe(25);
  });

  it('limpia el texto de la Pokédex', () => {
    expect(cleanFlavorText('Cuando se\nenfada,\fdescarga')).toBe('Cuando se enfada, descarga');
  });
});
