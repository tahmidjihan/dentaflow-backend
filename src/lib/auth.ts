import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
// If your Prisma file is located elsewhere, you can change the path
import { prisma } from './prisma.js';

const isProd = process.env.NODE_ENV === 'production';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql', // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [
    process.env.ORIGIN_URL as string,
    'http://localhost:3000',
    ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
  ],
  user: {
    additionalFields: {
      role: {
        type: 'string',
      },
    },
  },
  advanced: {
    // Always use secure cookies in production
    useSecureCookies: isProd,
    // Custom cookie configuration for cross-origin requests
    cookies: {
      session_token: {
        name: isProd
          ? '__Secure-better-auth.session_token'
          : 'better-auth.session_token',
        attributes: {
          // In production (cross-origin), use SameSite=None with Secure
          // In development (same origin localhost), use SameSite=Lax without Secure
          sameSite: isProd ? 'none' : 'lax',
          secure: isProd,
          httpOnly: true,
          path: '/',
        },
      },
    },
    // Default cookie attributes
    defaultCookieAttributes: {
      sameSite: isProd ? 'none' : 'lax',
      secure: isProd,
      path: '/',
    },
  },
});
