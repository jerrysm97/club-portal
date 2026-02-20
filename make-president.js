const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8').split('\n').forEach(line => {
  if (line = line.trim()) {
    const [k, ...v] = line.split('=');
    process.env[k] = v.join('=').replace(/^"|"$/g, '');
  }
});
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data, error } = await supabase
    .from('members')
    .update({ role: 'admin', club_post: 'President' })
    .eq('email', 'sujalmainali11@gmail.com');
  console.log('Update result:', { error });
}
run();
