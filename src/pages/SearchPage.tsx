import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setQuery, setPage, fetchSearch } from '../store/searchSlice';
import { useDebouncedValue, useAbortController } from '../hooks/useDebouncedCancelable';

export default function SearchPage() {
  const dispatch = useAppDispatch();
  const { query, results, loading, error, page, hasNext } = useAppSelector((s) => s.search);
  const [localQuery, setLocalQuery] = useState(query);
  const debounced = useDebouncedValue(localQuery, 250);
  const { replaceController } = useAbortController();

  useEffect(() => {
    dispatch(setQuery(debounced));
    if (debounced.trim() === '') return;
    const c = replaceController();
    dispatch(fetchSearch({ query: debounced, page: 1, signal: c.signal }));
    return () => c.abort();
  }, [debounced, dispatch]);

  useEffect(() => {
    if (!query) return;
    const c = replaceController();
    dispatch(fetchSearch({ query, page, signal: c.signal }));
    return () => c.abort();
  }, [page, query, dispatch]);

  const Skeleton = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-6 animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-gray-200 h-64 rounded-lg" />
      ))}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Anime Search</h1>
      <div className="flex justify-center mb-6">
        <input
          type="search"
          className="w-full sm:w-2/3 md:w-1/2 p-3 rounded-lg border shadow focus:outline-none"
          placeholder="Search anime..."
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
        />
      </div>

      {loading && <Skeleton />}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && results.length === 0 && query && (
        <p className="text-center text-gray-500 mt-10">😅 No anime found. Try another keyword!</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-6">
        {results.map((a) => (
          <Link key={a.mal_id} to={`/anime/${a.mal_id}`}>
            <div className="card">
              <img src={a.images?.jpg?.image_url} alt={a.title} className="w-full h-64 object-cover" />
              <div className="p-3">
                <h3 className="text-sm font-semibold line-clamp-2">{a.title}</h3>
                <p className="text-xs text-gray-500 mt-1">Score: {a.score ?? '—'}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {results.length > 0 && (
        <div className="flex justify-center gap-4 mt-8 items-center">
          <button className="btn" onClick={() => dispatch(setPage(Math.max(1, page - 1)))} disabled={page <= 1}>
            Prev
          </button>
          <span>Page {page}</span>
          <button className="btn" onClick={() => dispatch(setPage(page + 1))} disabled={!hasNext}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}