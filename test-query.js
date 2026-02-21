const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
async function test() {
  const { data: member, error: e1 } = await supabase.from('members').select('*, skill_endorsements(*)').limit(1)
  console.log("MEMBER ERR:", e1)
  const { data: post, error: e2 } = await supabase.from('posts').select('*, author:members(id), post_reactions(id), post_comments(id)').limit(1)
  console.log("POST ERR:", e2)
}
test()
