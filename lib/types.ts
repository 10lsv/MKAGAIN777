export interface Beat {
  id: string;
  title: string;
  bpm: number;
  genre: string;
  audio_url: string;
  cover_url: string | null;
  duration: number | null;
  price_mp3: number;
  price_wav: number;
  price_stems: number;
  created_at: string;
}
