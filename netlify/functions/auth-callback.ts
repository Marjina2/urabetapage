import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import cookie from 'cookie';

export const handler: Handler = async (event, context) => {
  try {
    // Add error checking for environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Handle the OAuth callback
    const { code } = event.queryStringParameters || {};
    if (!code) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No code provided' })
      };
    }

    // Exchange code for session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) throw error;

    // Get the site URL from environment
    const siteUrl = process.env.URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    // Set the cookie using the cookie library
    const cookieString = cookie.serialize('sb-access-token', data.session.access_token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    // Redirect to dashboard with session
    return {
      statusCode: 302,
      headers: {
        Location: `${siteUrl}/dashboard`,
        'Set-Cookie': cookieString,
      } as { [key: string]: string },
      body: ''
    };
  } catch (error) {
    console.error('Auth callback error:', error);
    return {
      statusCode: 302,
      headers: {
        Location: '/?error=auth-failed'
      } as { [key: string]: string },
      body: ''
    };
  }
}; 