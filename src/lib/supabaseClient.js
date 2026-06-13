import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dubvfaqhozvvogjovyqc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1YnZmYXFob3p2dm9nam92eXFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNjQzNDYsImV4cCI6MjA5Njg0MDM0Nn0.kpslrVomxzHOnkSMy4rk3DMB-cS-TLNcAcNECW91Iw8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);