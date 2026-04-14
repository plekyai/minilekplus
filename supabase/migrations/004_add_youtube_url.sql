-- supabase/migrations/004_add_youtube_url.sql
-- Add youtube_url column to parcours table

alter table parcours add column if not exists youtube_url text default null;
