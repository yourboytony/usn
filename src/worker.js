// Constants
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

// Database helper
class Database {
  constructor(env) {
    if (!env.DB) {
      throw new Error('Database binding not found');
    }
    console.log('Database binding found:', env.DB); // Debug log
    this.db = env.DB;
  }

  async query(sql, params = []) {
    try {
      console.log('Executing query:', sql, 'with params:', params); // Debug log
      const stmt = this.db.prepare(sql);
      return params.length > 0 ? await stmt.bind(...params).all() : await stmt.all();
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }
}

// Main worker
export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      const url = new URL(request.url);
      
      // Add a test endpoint
      if (url.pathname === '/api/test-db') {
        const db = new Database(env);
        const result = await db.query('SELECT name FROM sqlite_master WHERE type="table"');
        return new Response(
          JSON.stringify({ 
            tables: result,
            dbInfo: {
              binding: !!env.DB,
              name: env.DB ? 'usn_db' : null
            }
          }),
          { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }

      // Add a health check endpoint
      if (url.pathname === '/api/health') {
        console.log('Environment:', env); // Debug log
        return new Response(
          JSON.stringify({ 
            status: 'ok',
            hasDB: !!env.DB,
            timestamp: new Date().toISOString()
          }),
          { 
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          }
        );
      }

      // Handle login
      if (url.pathname === '/api/auth/login' && request.method === 'POST') {
        console.log('DB binding:', !!env.DB); // Debug log
        
        const db = new Database(env);
        const { username, password } = await request.json();
        
        console.log('Login attempt for:', username);

        // Query user
        const users = await db.query(
          'SELECT * FROM users WHERE username = ?',
          [username]
        );
        
        console.log('Query result:', users);

        if (users.length === 0) {
          return new Response(
            JSON.stringify({ error: 'Invalid credentials' }),
            { 
              status: 401,
              headers: { 'Content-Type': 'application/json', ...corsHeaders }
            }
          );
        }

        const user = users[0];
        
        return new Response(
          JSON.stringify({ 
            token: 'dummy_token',
            user: {
              id: user.id,
              username: user.username,
              role: user.role
            }
          }),
          { 
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          }
        );
      }

      return new Response('Not Found', { 
        status: 404,
        headers: corsHeaders 
      });

    } catch (error) {
      console.error('Worker error:', error);
      
      return new Response(
        JSON.stringify({ 
          error: 'Internal server error', 
          details: error.message,
          stack: error.stack
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }
  }
};