import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://bhkjcztkwkkkdmyvvssl.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoa2pjenRrd2tra2RteXZ2c3NsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTE5MTAzNzQsImV4cCI6MjAyNzQ4NjM3NH0.1K0E2-hzyNz_rbtnUuvNKwXXt6rqYezQwZ1sUDgtruc"
);
