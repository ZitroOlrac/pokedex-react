import { Link } from 'react-router-dom';
import { PokemonCard } from '../components/PokemonCard';
import { Loading } from '../components/ui';
import { usePokemonIndex } from '../hooks/queries';
import { useFavorites } from '../hooks/useFavorites';

export function Favorites() {
  const { ids } = useFavorites();
  const index = usePokemonIndex();

  if (ids.length === 0) {
    return (
      <div className="state">
        <h1>Aún no tienes favoritos</h1>
        <p>Pulsa el corazón de cualquier Pokémon para guardarlo aquí.</p>
        <Link to="/" className="btn">
          Ir a la Pokédex
        </Link>
      </div>
    );
  }
  if (index.isPending) return <Loading />;

  const names = new Map(index.data?.map((p) => [p.id, p.name]));

  return (
    <>
      <section className="intro">
        <h1>Tus favoritos</h1>
        <p>{ids.length} Pokémon guardados en este navegador.</p>
      </section>
      <div className="grid">
        {ids.map((id) => (
          <PokemonCard key={id} id={id} name={names.get(id) ?? String(id)} />
        ))}
      </div>
    </>
  );
}
