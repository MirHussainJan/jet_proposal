import { next } from '@vercel/functions';

export const config = {
  matcher: ['/((?!favicon.ico|robots.txt|sitemap.xml).*)'],
};

export default function middleware(request) {
  const password = process.env.SITE_PASSWORD;
  const username = process.env.SITE_USERNAME || 'admin';

  if (!password) {
    return new Response('SITE_PASSWORD is not configured.', { status: 500 });
  }

  const authHeader = request.headers.get('authorization') || '';
  const expected = `Basic ${btoa(`${username}:${password}`)}`;

  if (authHeader === expected) {
    return next();
  }

  return new Response('Password required.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Protected Site", charset="UTF-8"',
      'Cache-Control': 'no-store',
    },
  });
}
