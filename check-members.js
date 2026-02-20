const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
    const { data, error } = await supabase.from('members').select('id, email, status, role')
    console.log('Error:', error)
    console.log('Members:', data)
}
main()
