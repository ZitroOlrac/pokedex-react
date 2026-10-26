import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PokemonCard } from '../components/PokemonCard';
import { ErrorState, Loading, Pagination } from '../components/ui';
import { usePokemonIndex, useTypeMembers } from '../hooks/queries';
import { TYPES, filterIndex, paginate } from '../lib/pokemon';

const PER_PAGE = 24;

export function Pokedex() {
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  const type = params.get('tipo') ?? '';
  const page = Number(params.get('pagina') ?? '1') || 1;

  const index = usePokemonIndex();
  const typeMembers = useTypeMembers(type);

  const update = (changes: Record<string, string>) => {
    const next = new URLSearchParams(params);
    for (const [k, v] of Object.entries(changes)) {
      if (v) next.set(k, v);
      else next.delete(k);
    }
    setParams(next, { replace: true });
  };

  const filtered = useMemo(
    () => (index.data ? filterIndex(index.data, query, type ? typeMembers.data : undefined) : []),
    [index.data, query, type, typeMembers.data],
  );
  const current = paginate(filtered, page, PER_PAGE);

  const loading = index.isPending || (type && typeMembers.isPending);
  const error = index.error ?? (type ? typeMembers.error : null);

  return (
    <>
      <section className="intro">
        <h1>Pokédex</h1>
        <p>Busca entre los {index.data?.length ?? 1025} Pokémon por nombre, número o tipo.</p>
      </section>

      <div className="filters">
        <label className="search">
          <span className="sr-only">Buscar Pokémon</span>
          <input
            type="search"
            placeholder="Nombre o número, p. ej. pikachu o 25"
            value={query}
            onChange={(e) => update({ q: e.target.value, pagina: '' })}
          />
        </label>
        <label>
          <span className="sr-only">Filtrar por tipo</span>
          <select value={type} onChange={(e) => update({ tipo: e.target.value, pagina: '' })}>
            <option value="">Todos los tipos</option>
            {Object.entries(TYPES).map(([id, t]) => (
              <option key={id} value={id}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error ? (
        <ErrorState
          message="No se pudo conectar con la PokeAPI. Revisa tu conexión."
          onRetry={() => {
            void index.refetch();
            if (type) void typeMembers.refetch();
          }}
        />
      ) : loading ? (
        <Loading label="Cargando Pokédex…" />
      ) : filtered.length === 0 ? (
        <div className="state">
          <p>No hay Pokémon que coincidan con «{query}».</p>
          <button type="button" className="btn" onClick={() => setParams({}, { replace: true })}>
            Quitar filtros
          </button>
        </div>
      ) : (
        <>
          <p className="results" aria-live="polite">
            {filtered.length} resultados
          </p>
          <div className="grid">
            {current.items.map((p) => (
              <PokemonCard key={p.id} id={p.id} name={p.name} />
            ))}
          </div>
          <Pagination
            page={current.page}
            totalPages={current.totalPages}
            onChange={(n) => {
              update({ pagina: n > 1 ? String(n) : '' });
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </>
      )}
    </>
  );
}
