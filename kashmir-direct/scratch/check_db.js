import { supabase } from '../frontend/src/lib/supabase.js';

async function checkTables() {
  console.log('--- Checking Identity Vault Tables ---');
  
  const { data: profiles, error: pError } = await supabase.from('profiles').select('*').limit(1);
  if (pError) console.error('Profiles Table Error:', pError.message);
  else console.log('Profiles Table: EXIST (Found record:', profiles.length > 0 ? 'YES' : 'EMPTY', ')');

  const { data: users, error: uError } = await supabase.from('users').select('*').limit(1);
  if (uError) console.error('Users Table Error:', uError.message);
  else console.log('Users Table: EXIST (Found record:', users.length > 0 ? 'YES' : 'EMPTY', ')');
}

checkTables();
