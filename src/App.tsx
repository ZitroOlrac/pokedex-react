import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { FavoritesProvider } from './hooks/FavoritesProvider';
import { Favorites } from './pages/Favorites';
import { NotFound } from './pages/NotFound';
import { PokemonDetail } from './pages/PokemonDetail';
import { Pokedex } from './pages/Pokedex';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FavoritesProvider>
        <HashRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Pokedex />} />
              <Route path="pokemon/:id" element={<PokemonDetail />} />
              <Route path="favoritos" element={<Favorites />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </HashRouter>
      </FavoritesProvider>
    </QueryClientProvider>
  );
}
