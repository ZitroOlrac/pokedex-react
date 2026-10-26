import { useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useFavorites } from '../hooks/useFavorites';

export function Layout() {
  const { ids } = useFavorites();
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="app">
      <header className="header">
        <div className="container header__inner">
          <Link to="/" className="brand">
            <span className="brand__ball" aria-hidden="true" />
            Pokédex
          </Link>
          <nav className="header__nav" aria-label="Principal">
            <NavLink to="/" end>
              Todos
            </NavLink>
            <NavLink to="/favoritos">
              Favoritos <span className="count">{ids.length}</span>
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="container main">
        <Outlet />
      </main>
      <footer className="footer">
        <div className="container">
          Datos de <a href="https://pokeapi.co" target="_blank" rel="noreferrer">PokeAPI</a>. Proyecto
          personal sin fines comerciales; Pokémon es una marca de Nintendo, Game Freak y The Pokémon Company.
        </div>
      </footer>
    </div>
  );
}
