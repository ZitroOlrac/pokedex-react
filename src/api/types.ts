// Tipos de las respuestas de la PokeAPI (solo los campos que usa la app).

export interface NamedResource {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  results: NamedResource[];
}

export interface PokemonResponse {
  id: number;
  name: string;
  height: number; // decímetros
  weight: number; // hectogramos
  types: { slot: number; type: NamedResource }[];
  stats: { base_stat: number; stat: NamedResource }[];
  abilities: { is_hidden: boolean; ability: NamedResource }[];
  species: NamedResource;
}

export interface SpeciesResponse {
  id: number;
  names: { name: string; language: NamedResource }[];
  genera: { genus: string; language: NamedResource }[];
  flavor_text_entries: { flavor_text: string; language: NamedResource }[];
  evolution_chain: { url: string };
}

export interface ChainLink {
  species: NamedResource;
  evolves_to: ChainLink[];
}

export interface EvolutionChainResponse {
  id: number;
  chain: ChainLink;
}

export interface TypeResponse {
  name: string;
  pokemon: { pokemon: NamedResource }[];
}
