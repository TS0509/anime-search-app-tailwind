export interface Anime {
  mal_id: number;
  title: string;
  synopsis?: string | null;
  images?: { jpg?: { image_url?: string } };
  score?: number | null;
  episodes?: number | null;
  rank?: number | null;
}