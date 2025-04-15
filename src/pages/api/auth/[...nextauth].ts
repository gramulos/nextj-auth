import NextAuth, { Account, AuthOptions, Profile, Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import AzureADB2CProvider, {
  type AzureB2CProfile,
} from 'next-auth/providers/azure-ad-b2c';

interface CustomJWT extends JWT {
  idToken?: string;
  id?: string;
  email?: string | null;
  firstName?: string;
  lastName?: string;
  userType?: string;
  pid?: string;
  oid?: string;
}

interface CustomSession extends Session {
  idToken?: string;
  id?: string;
  email?: string | null;
  firstName?: string;
  lastName?: string;
  userType?: string;
  pid?: string;
  oid?: string;
}

const XML_CLAIMS = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/';
const JCAHO_CLAIMS = 'http://schemas.jcaho.org/2009/06/claims/';

const getProfile = (oauthProfile: AzureB2CProfile) => ({
  id: oauthProfile.sub || oauthProfile.oid,
  name: oauthProfile[XML_CLAIMS + 'displayName'],
  email: oauthProfile[XML_CLAIMS + 'emailaddress'],
  firstName: oauthProfile[XML_CLAIMS + 'givenname'],
  lastName: oauthProfile[XML_CLAIMS + 'surname'],
  userType: oauthProfile[JCAHO_CLAIMS + 'usertype'],
  pid: oauthProfile[JCAHO_CLAIMS + 'pid'],
  oid: oauthProfile[JCAHO_CLAIMS + 'oid'],
});

export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    AzureADB2CProvider({
      tenantId: process.env.AZURE_AD_B2C_TENANT_NAME,
      clientId: String(process.env.AZURE_AD_B2C_CLIENT_ID),
      clientSecret: String(process.env.AZURE_AD_B2C_CLIENT_SECRET),
      primaryUserFlow: String(process.env.AZURE_AD_B2C_PRIMARY_USER_FLOW),
      authorization: { params: { scope: 'openid' } },
      checks: ['pkce'],
      client: {
        token_endpoint_auth_method: 'none',
      },
      profile: getProfile,
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
      token: CustomJWT;
      account: Account | null;
      profile?: Profile;
    }) {
      if (account) {
        token.idToken = account.id_token;
      }
      if (profile) {
        const profileData = getProfile(profile as AzureB2CProfile);
        Object.assign(token, profileData);
      }
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: CustomSession;
      token: CustomJWT;
    }) {
      session.idToken = token.idToken;
      session.id = token.id;
      session.email = token.email;
      session.firstName = token.firstName;
      session.lastName = token.lastName;
      session.userType = token.userType;
      session.pid = token.pid;
      session.oid = token.oid;
      return session;
    },
  },
};
export default NextAuth(authOptions);
