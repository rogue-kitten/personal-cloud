import NextAuth from 'next-auth';
import passkey from 'next-auth/providers/passkey';
import { drizzleAdapter } from './drizzle/adapter';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: drizzleAdapter,
  providers: [passkey],
  experimental: { enableWebAuthn: true },
  basePath: '/api/auth',
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      return session;
    },

    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl + '/';
    },
  },
});
