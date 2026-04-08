import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from './prisma.js';

const isProd = process.env.NODE_ENV === 'production';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      scope: ['openid', 'email', 'profile'],
    },
  },
  trustedOrigins: [
    process.env.ORIGIN_URL as string,
    'http://localhost:3000',
    'http://localhost:8000',
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
    useSecureCookies: isProd,
    cookies: {
      session_token: {
        name: isProd
          ? '__Secure-better-auth.session_token'
          : 'better-auth.session_token',
        attributes: {
          sameSite: isProd ? 'none' : 'lax',
          secure: isProd,
          httpOnly: true,
          path: '/',
        },
      },
    },
    defaultCookieAttributes: {
      sameSite: isProd ? 'none' : 'lax',
      secure: isProd,
      path: '/',
    },
  },
});
