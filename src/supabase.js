import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xzmtjxrgjcorslyfxxvm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6bXRqeHJnamNvcnNseWZ4eHZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUyMTgwODksImV4cCI6MjA1MDc5NDA4OX0.HjRk2pJ514do9wQMlhcXIibrjjyAPVTien1O59dB9BA'

export const supabase = createClient(supabaseUrl, supabaseKey)
