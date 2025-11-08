import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as jikan from '../api/jikanClient';
import type { Anime } from '../types/anime';

interface SearchState {
  query: string;
  page: number;
  results: Anime[];
  loading: boolean;
  error?: string | null;
  hasNext: boolean;
}

const initialState: SearchState = {
  query: '',
  page: 1,
  results: [],
  loading: false,
  error: null,
  hasNext: false
};

export const fetchSearch = createAsyncThunk(
  'search/fetch',
  async ({ query, page, signal }: { query: string; page: number; signal?: AbortSignal }, { rejectWithValue }) => {
    try {
      const res = await jikan.searchAnime(query, page, signal);
      return { data: res.data, hasNext: !!res.pagination?.has_next_page };
    } catch (e: any) {
      if (e?.name === 'CanceledError' || e?.message === 'canceled') return rejectWithValue('cancelled');
      return rejectWithValue(e?.message ?? 'Network error');
    }
  }
);

const slice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery: (s, a: PayloadAction<string>) => { s.query = a.payload; s.page = 1; },
    setPage: (s, a: PayloadAction<number>) => { s.page = a.payload; }
  },
  extraReducers: (b) => {
    b.addCase(fetchSearch.pending, (s) => { s.loading = true; s.error = null; });
    b.addCase(fetchSearch.fulfilled, (s, a) => { s.loading = false; s.results = a.payload.data; s.hasNext = a.payload.hasNext; });
    b.addCase(fetchSearch.rejected, (s, a) => { s.loading = false; if (a.payload !== 'cancelled') s.error = a.payload as string; });
  }
});

export const { setQuery, setPage } = slice.actions;
export default slice.reducer;