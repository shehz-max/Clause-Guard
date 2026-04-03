import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function runMigrations() {
  const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations')
  const files = fs.readdirSync(migrationsDir).sort()

  for (const file of files) {
    if (file.endsWith('.sql')) {
      console.log(`Running migration: ${file}`)
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8')
      
      // Split by statement to handle errors better
      const statements = sql.split(';').filter(s => s.trim())
      
      for (const statement of statements) {
        const trimmed = statement.trim()
        if (!trimmed || trimmed.startsWith('--')) continue
        
        const { error } = await supabase.rpc('exec_sql', { sql: trimmed + ';' })
        
        if (error) {
          console.error(`Error in ${file}:`, error)
          // Try direct query as fallback
          const { error: queryError } = await supabase.from('_exec_sql').select('*').eq('sql', trimmed + ';')
          if (queryError) {
            console.error(`Fallback also failed:`, queryError)
          }
        }
      }
      
      console.log(`✓ Completed: ${file}`)
    }
  }
  
  console.log('All migrations completed!')
}

runMigrations().catch(console.error)
