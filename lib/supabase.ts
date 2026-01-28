import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://puqhpgsbyvthttfhbmru.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1cWhwZ3NieXZ0aHR0ZmhibXJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4NjQ4MjAsImV4cCI6MjA3MDQ0MDgyMH0.6vatjsBk3ZkvoYRvAwbm8Ogb3ZacJm9bL6dqTX_cckY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
