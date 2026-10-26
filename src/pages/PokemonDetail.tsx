import type { CSSProperties } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ApiError, MAX_POKEMON, artworkUrl } from '../api/pokeapi';
import { ErrorState, FavoriteButton, Loading, StatBar, TypeBadge } from '../components/ui';
import { useEvolutionChain, usePokemon, useSpecies } from '../hooks/queries';
import { STAT_LABELS, cleanFlavorText, flattenEvolution, formatNumber, prettyName, typeInfo } from '../lib/pokemon';
import { NotFound } from './NotFound';

export function PokemonDetail() {
  const id = Number(useParams().id);
  const pokemon = usePokemon(id);
  const species = useSpecies(id);
  const evolution = useEvolutionChain(species.data?.evolution_chain.url);

  if (!Number.isInteger(id) || id < 1 || id > MAX_POKEMON) return <NotFound />;
  if (pokemon.error instanceof ApiError && pokemon.error.status === 404) return <NotFound />;
  if (pokemon.error) return <ErrorState message="No se pudo cargar este Pokémon." onRetry={() => void pokemon.refetch()} />;
  if (!pokemon.data) return <Loading />;

  const p = pokemon.data;
  const types = p.types.map((t) => t.type.name);
  const es = species.data;
  const spanishName = es?.names.find((n) => n.language.name === 'es')?.name ?? prettyName(p.name);
  const genus = es?.genera.find((g) => g.language.name === 'es')?.genus;
  const flavor = es?.flavor_text_entries.findLast((f) => f.language.name === 'es')?.flavor_text;
  const total = p.stats.reduce((sum, s) => sum + s.base_stat, 0);
  const stages = evolution.data ? flattenEvolution(evolution.data.chain) : [];

  return (
    <>
      <nav className="detail-nav" aria-label="Navegación entre Pokémon">
        <Link to="/">← Volver</Link>
        <span>
          {id > 1 && <Link to={`/pokemon/${id - 1}`}>{formatNumber(id - 1)}</Link>}
          {id < MAX_POKEMON && <Link to={`/pokemon/${id + 1}`}>{formatNumber(id + 1)}</Link>}
        </span>
      </nav>

      <article className="detail" style={{ '--tint': typeInfo(types[0]).color } as CSSProperties}>
        <div className="detail__hero">
          <FavoriteButton id={p.id} name={spanishName} />
          <img src={artworkUrl(p.id)} alt={spanishName} width="420" height="420" />
        </div>

        <div className="detail__info">
          <p className="card__number">{formatNumber(p.id)}</p>
          <h1>{spanishName}</h1>
          {genus && <p className="genus">{genus}</p>}
          <div className="card__types">
            {types.map((t) => (
              <TypeBadge key={t} type={t} />
            ))}
          </div>
          {flavor && <p className="flavor">{cleanFlavorText(flavor)}</p>}

          <dl className="facts">
            <div>
              <dt>Altura</dt>
              <dd>{(p.height / 10).toLocaleString('es-ES')} m</dd>
            </div>
            <div>
              <dt>Peso</dt>
              <dd>{(p.weight / 10).toLocaleString('es-ES')} kg</dd>
            </div>
            <div>
              <dt>Habilidades</dt>
              <dd>
                {p.abilities
                  .map((a) => prettyName(a.ability.name) + (a.is_hidden ? ' (oculta)' : ''))
                  .join(', ')}
              </dd>
            </div>
          </dl>

          <section aria-labelledby="stats-title">
            <h2 id="stats-title">Estadísticas base</h2>
            <div className="stats">
              {p.stats.map((s) => (
                <StatBar key={s.stat.name} label={STAT_LABELS[s.stat.name] ?? s.stat.name} value={s.base_stat} />
              ))}
              <div className="stat stat--total">
                <span className="stat__label">Total</span>
                <span className="stat__value">{total}</span>
              </div>
            </div>
          </section>
        </div>
      </article>

      {stages.length > 1 && (
        <section className="evolution" aria-labelledby="evo-title">
          <h2 id="evo-title">Cadena de evolución</h2>
          <ol className="evolution__stages">
            {stages.map((stage, i) => (
              <li key={i} className="evolution__stage">
                {stage.map((s) => (
                  <Link
                    key={s.id}
                    to={`/pokemon/${s.id}`}
                    className={`evolution__item${s.id === p.id ? ' evolution__item--current' : ''}`}
                    aria-current={s.id === p.id ? 'page' : undefined}
                  >
                    <img src={artworkUrl(s.id)} alt="" width="96" height="96" loading="lazy" />
                    <span>{prettyName(s.name)}</span>
                  </Link>
                ))}
              </li>
            ))}
          </ol>
        </section>
      )}
    </>
  );
}
