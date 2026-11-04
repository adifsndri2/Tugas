import { defineMiddleware } from 'astro:middleware';
import { ADMIN_TOKEN } from './lib/auth';

export const onRequest = defineMiddleware((ctx, next) => {
  const p = ctx.url.pathname;
  const isProtected = p.startsWith('/admin') && p !== '/admin/login';

  if (isProtected && (!ADMIN_TOKEN || ctx.cookies.get('session')?.value !== ADMIN_TOKEN)) {
    return ctx.redirect('/admin/login');
  }
  return next();
});