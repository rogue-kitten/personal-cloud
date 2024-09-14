import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { and, eq } from 'drizzle-orm';
import {
  Adapter,
  AdapterAccount,
  AdapterAuthenticator,
} from 'next-auth/adapters';
import { db } from '.';
import {
  accounts,
  Authenticator,
  NewAuthenticator,
  sessions,
  users,
  verificationTokens,
} from './schema';

export const drizzleAdapter = {
  ...DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),

  getAccount: async (providerAccountId: string, provider: string) => {
    const [account] = await db
      .select()
      .from(accounts)
      .where(
        and(
          eq(accounts.provider, provider),
          eq(accounts.providerAccountId, providerAccountId)
        )
      );

    return (account as AdapterAccount) ?? null;
  },

  createAuthenticator: async (data: Omit<NewAuthenticator, 'id'>) => {
    const id = crypto.randomUUID();
    await db.insert(Authenticator).values({
      id,
      ...data,
    });

    const [authenticator] = await db
      .select()
      .from(Authenticator)
      .where(eq(Authenticator.id, id));
    const { transports, id: _, ...rest } = authenticator;
    return { ...rest, transports: transports ?? undefined };
  },

  getAuthenticator: async (credentialId: string) => {
    const [authenticator] = await db
      .select()
      .from(Authenticator)
      .where(eq(Authenticator.credentialID, credentialId));
    return (authenticator as AdapterAuthenticator) ?? null;
  },

  listAuthenticatorsByUserId: async (userId: string) => {
    const auths = await db
      .select()
      .from(Authenticator)
      .where(eq(Authenticator.userId, userId));
    return auths.map((a) => ({
      ...a,
      transports: a.transports ?? undefined,
    }));
  },

  updateAuthenticatorCounter: async (credentialId: string, counter: number) => {
    await db
      .update(Authenticator)
      .set({ counter })
      .where(eq(Authenticator.credentialID, credentialId));
    const [authenticator] = await db
      .select()
      .from(Authenticator)
      .where(eq(Authenticator.credentialID, credentialId));
    return (authenticator as AdapterAuthenticator) ?? null;
  },
} satisfies Adapter;
