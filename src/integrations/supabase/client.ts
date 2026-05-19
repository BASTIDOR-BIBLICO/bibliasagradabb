import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://qoiolrupuidblqrzygoj.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvaW9scnVwdWlkYmxxcnp5Z29qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxMzQ2NzQsImV4cCI6MjA5NDcxMDY3NH0.xcPv-6WmiJraqZ3kZR-FHlRu7Q0umutYnLE4w6ADfOE";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
