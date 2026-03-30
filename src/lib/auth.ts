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
  trustedOrigins: [process.env.ORIGIN_URL || 'http://localhost:3000'],
  user: {
    additionalFields: {
      role: {
        type: 'string',
      },
    },
  },
  advanced: {
    // Disable secure cookie in development for HTTP
    useSecureCookies: isProd,
    // Set cookie domain for proper forwarding through proxy
    crossSubDomainCookies: {
      enabled: !isProd,
      domain: 'localhost',
    },
    // Custom cookie configuration
    cookies: {
      session_token: {
        name: 'better-auth.session_token',
        attributes: {
          // In production (cross-origin), use SameSite=None with Secure
          // In development (same origin localhost), use SameSite=Lax without Secure
          sameSite: isProd ? 'none' : 'lax',
          secure: isProd,
          httpOnly: true,
        },
      },
    },
    // Allow cross-origin cookies for development
    defaultCookieAttributes: {
      sameSite: 'lax',
      path: '/',
    },
  },
});
