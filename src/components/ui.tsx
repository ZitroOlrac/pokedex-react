import { typeInfo } from '../lib/pokemon';
import { useFavorites } from '../hooks/useFavorites';

export function TypeBadge({ type }: { type: string }) {
  const { label, color } = typeInfo(type);
  return (
    <span className="type" style={{ background: color }}>
      {label}
    </span>
  );
}

export function FavoriteButton({ id, name }: { id: number; name: string }) {
  const { isFavorite, toggle } = useFavorites();
  const active = isFavorite(id);
  return (
    <button
      type="button"
      className={`fav${active ? ' fav--active' : ''}`}
      aria-pressed={active}
      aria-label={active ? `Quitar a ${name} de favoritos` : `Añadir a ${name} a favoritos`}
      onClick={(e) => {
        // Evita navegar cuando el botón está dentro de un enlace.
        e.preventDefault();
        e.stopPropagation();
        toggle(id);
      }}
    >
      {active ? '♥' : '♡'}
    </button>
  );
}

export function Loading({ label = 'Cargando…' }: { label?: string }) {
  return (
    <div className="state" role="status">
      <span className="spinner" aria-hidden="true" />
      {label}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="state state--error" role="alert">
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="btn" onClick={onRetry}>
          Reintentar
        </button>
      )}
    </div>
  );
}

export function StatBar({ label, value }: { label: string; value: number }) {
  // 255 es el valor máximo posible de una estadística base.
  const pct = Math.min(100, (value / 255) * 100);
  const tone = value >= 100 ? 'high' : value >= 60 ? 'mid' : 'low';
  return (
    <div className="stat">
      <span className="stat__label">{label}</span>
      <span className="stat__value">{value}</span>
      <span className="stat__track" aria-hidden="true">
        <span className={`stat__fill stat__fill--${tone}`} style={{ width: `${pct}%` }} />
      </span>
    </div>
  );
}

export function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <nav className="pagination" aria-label="Paginación">
      <button type="button" className="btn" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        ← Anterior
      </button>
      <span>
        Página <strong>{page}</strong> de {totalPages}
      </span>
      <button type="button" className="btn" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
        Siguiente →
      </button>
    </nav>
  );
}
