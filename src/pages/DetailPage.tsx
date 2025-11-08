import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAnimeById } from '../api/jikanClient';

export default function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const c = new AbortController();
    setLoading(true);
    getAnimeById(Number(id), c.signal)
      .then((r) => {
        setData(r?.data ?? r);
        setLoading(false);
      })
      .catch((e) => {
        if (e?.name === 'CanceledError' || e?.message === 'canceled') return;
        setErr(e.message ?? 'Failed to load');
        setLoading(false);
      });
    return () => c.abort();
  }, [id]);

  if (loading)
    return (
      <div className="max-w-4xl mx-auto p-6 animate-pulse">
        <div className="h-8 bg-gray-200 w-1/3 mb-4 rounded"></div>
        <div className="h-64 bg-gray-200 rounded mb-6"></div>
        <div className="h-4 bg-gray-200 mb-2 rounded"></div>
        <div className="h-4 bg-gray-200 mb-2 rounded"></div>
        <div className="h-4 bg-gray-200 mb-2 rounded"></div>
      </div>
    );

  if (err) return <div className="text-center text-red-500">{err}</div>;
  if (!data) return <div className="text-center text-gray-500">No data</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link to="/" className="text-blue-500 hover:underline">← Back</Link>
      <h1 className="text-3xl font-bold my-4">{data.title}</h1>
      <img src={data.images?.jpg?.image_url} alt={data.title} className="w-full sm:w-1/2 rounded-xl shadow mb-6" />
      <p className="text-gray-700 leading-relaxed mb-4">{data.synopsis}</p>
      <ul className="text-gray-600 space-y-1">
        <li>Episodes: {data.episodes ?? '—'}</li>
        <li>Score: {data.score ?? '—'}</li>
        <li>Rank: {data.rank ?? '—'}</li>
      </ul>
    </div>
  );
}