// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zmkohkrlzkpggrsawxho.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpta29oa3JsemtwZ2dyc2F3eGhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3MDIxOTQsImV4cCI6MjA2NTI3ODE5NH0.JZAILwqiU65ZVCDiSwWk0QTCNFXqcYELTebdi0VTzFY";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);