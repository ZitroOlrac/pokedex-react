import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="state">
      <h1>Pokémon no encontrado</h1>
      <p>Ese número no existe en la Pokédex.</p>
      <Link to="/" className="btn">
        Volver a la Pokédex
      </Link>
    </div>
  );
}
