import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import cookie from 'cookie';

interface HandlerResponse {
  statusCode: number;
  headers: { [key: string]: string };
  body: string;
}

export const handler: Handler = async (event): Promise<HandlerResponse> => {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return {
        statusCode: 302,
        headers: {
          Location: '/?error=missing-env',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify({ error: 'Missing environment variables' })
      };
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { code } = event.queryStringParameters || {};
    
    if (!code) {
      return {
        statusCode: 302,
        headers: {
          Location: '/?error=no-code',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify({ error: 'No code provided' })
      };
    }

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) throw error;

    const siteUrl = process.env.URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    
    // Check if user exists in profiles
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_completed')
      .eq('id', data.session.user.id)
      .single();

    const redirectPath = profile?.onboarding_completed ? '/dashboard' : '/onboarding';

    const cookieStr = cookie.serialize('sb-access-token', data.session.access_token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    return {
      statusCode: 302,
      headers: {
        Location: `${siteUrl}${redirectPath}`,
        'Set-Cookie': cookieStr,
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify({ redirecting: true })
    };
  } catch (error) {
    console.error('Auth callback error:', error);
    return {
      statusCode: 302,
      headers: {
        Location: '/?error=auth-failed',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify({ error: 'Authentication failed' })
    };
  }
}; 