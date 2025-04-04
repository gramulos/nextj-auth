import NextAuth, { Account, AuthOptions, Profile, Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import AzureADB2CProvider, {
  type AzureB2CProfile,
} from 'next-auth/providers/azure-ad-b2c';

// Add this type declaration
interface CustomSession extends Session {
  idToken?: string;
  id?: string;
}

export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    AzureADB2CProvider({
      tenantId: process.env.AZURE_AD_B2C_TENANT_NAME,
      clientId: String(process.env.AZURE_AD_B2C_CLIENT_ID),
      clientSecret: String(process.env.AZURE_AD_B2C_CLIENT_SECRET),
      primaryUserFlow: String(process.env.AZURE_AD_B2C_PRIMARY_USER_FLOW),
      authorization: { params: { scope: 'offline_access openid' } },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/auth/new-user',
  },
  callbacks: {
    async jwt({
      token,
      account,
      profile,
    }: {
      token: JWT;
      account: Account | null;
      profile?: Profile;
    }) {
      if (account) {
        token.idToken = account.id_token;
      }
      if (profile) {
        token.id = (profile as AzureB2CProfile).oid;
      }
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: CustomSession;
      token: JWT & { idToken?: string; id?: string };
    }) {
      // Remove user parameter since we don't need it
      session.idToken = token.idToken;
      session.id = token.id;
      return session;
    },
  },
};
export default NextAuth(authOptions);
