import { createClient } from "@supabase/supabase-js";

// Using service role key for full Realtime access (private admin app)
const SUPABASE_URL = "https://bbpoecfwqjcmmvtwiwed.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicG9lY2Z3cWpjbW12dHdpd2VkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODc4Mjc4NiwiZXhwIjoyMTA0MzU4Nzg2fQ.EgKBNt9SxnGywlNpaO6uZ9PsOFdf2epkgiPtsXjpzxY";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  realtime: { params: { eventsPerSecond: 10 } }
});
