export interface Beat {
  id: string;
  title: string;
  bpm: number;
  genre: string;
  audio_url: string;
  audio_wav: string | null;
  audio_stems: string | null;
  cover_url: string | null;
  duration: number | null;
  price_mp3: number;
  price_wav: number;
  price_stems: number;
  price_exclusive: number;
  created_at: string;
}
