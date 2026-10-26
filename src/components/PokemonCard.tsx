import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { artworkUrl } from '../api/pokeapi';
import { usePokemon } from '../hooks/queries';
import { formatNumber, prettyName, typeInfo } from '../lib/pokemon';
import { FavoriteButton, TypeBadge } from './ui';

export function PokemonCard({ id, name }: { id: number; name: string }) {
  // El índice solo trae nombre y número; los tipos se piden por tarjeta y quedan en caché.
  const { data } = usePokemon(id);
  const types = data?.types.map((t) => t.type.name) ?? [];
  const tint = types[0] ? typeInfo(types[0]).color : 'var(--muted)';

  return (
    <Link to={`/pokemon/${id}`} className="card" style={{ '--tint': tint } as CSSProperties}>
      <FavoriteButton id={id} name={prettyName(name)} />
      <div className="card__art">
        <img src={artworkUrl(id)} alt={prettyName(name)} loading="lazy" width="200" height="200" />
      </div>
      <p className="card__number">{formatNumber(id)}</p>
      <h3 className="card__name">{prettyName(name)}</h3>
      <div className="card__types">
        {types.length > 0 ? (
          types.map((t) => <TypeBadge key={t} type={t} />)
        ) : (
          <span className="type type--skeleton" aria-hidden="true" />
        )}
      </div>
    </Link>
  );
}
