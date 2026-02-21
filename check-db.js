const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

async function check() {
    const { data, error } = await supabase.from('posts').select('*').limit(1)
    if (error) {
        console.error("DB Error:", error)
    } else {
        console.log("Columns:", data && data[0] ? Object.keys(data[0]) : "No data")
    }
}
check()
