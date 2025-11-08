import axios from 'axios';
import type { Anime } from '../types/anime';

export interface SearchResponse {
  data: Anime[];
  pagination?: { last_visible_page?: number; has_next_page?: boolean };
}

const BASE = 'https://api.jikan.moe/v4';

export async function searchAnime(query: string, page = 1, signal?: AbortSignal) {
  const url = `${BASE}/anime?q=${encodeURIComponent(query)}&page=${page}&limit=12`;
  const resp = await axios.get(url, { signal });
  return resp.data as SearchResponse;
}

export async function getAnimeById(id: number, signal?: AbortSignal) {
  const url = `${BASE}/anime/${id}/full`;
  const resp = await axios.get(url, { signal });
  return resp.data;
}