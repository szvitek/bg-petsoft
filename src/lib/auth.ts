import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { getUserByEmail } from './server-utils';
import { authSchema } from './validations';
import prisma from './db';

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: '/login',
  },
  // these are the default values:
  // session: {
  //   maxAge: 30 * 24 * 60 * 60,
  //   strategy: 'jwt'
  // },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        // authorize runs on every login

        // validation
        const validatedFormData = authSchema.safeParse(credentials);
        if (!validatedFormData.success) {
          return null;
        }

        const { email, password } = validatedFormData.data;
        const user = await getUserByEmail(email);

        if (!user) {
          // No user found, so this is their first attempt to login
          // meaning this is also the place you could do registration
          throw new Error('User not found.');
        }

        const passwordsMatch = await bcrypt.compare(
          password,
          user.hashedPassword
        );
        if (!passwordsMatch) {
          // No user found, so this is their first attempt to login
          // meaning this is also the place you could do registration
          throw new Error('Invalid credentials.');
        }

        // return user object with the their profile data
        return user;
      },
    }),
  ],
  callbacks: {
    authorized: ({ auth, request }) => {
      // runs on every request with middleware
      const isLoggedIn = !!auth?.user;
      const isTryingToAccessApp = request.nextUrl.pathname.includes('/app');

      if (!isLoggedIn && isTryingToAccessApp) {
        return false;
      }

      if (isLoggedIn && isTryingToAccessApp && !auth.user.hasAccess) {
        return Response.redirect(new URL('/payment', request.nextUrl));
      }

      if (isLoggedIn && isTryingToAccessApp && auth.user.hasAccess) {
        return true;
      }

      if (
        isLoggedIn &&
        (request.nextUrl.pathname.includes('/login') ||
          request.nextUrl.pathname.includes('/signup')) &&
        auth.user.hasAccess
      ) {
        return Response.redirect(new URL('/app/dashboard', request.nextUrl));
      }

      if (isLoggedIn && !isTryingToAccessApp && !auth.user.hasAccess) {
        if (
          request.nextUrl.pathname.includes('/login') ||
          request.nextUrl.pathname.includes('/signup')
        ) {
          return Response.redirect(new URL('/payment', request.nextUrl));
        }

        return true;
      }

      if (!isLoggedIn && !isTryingToAccessApp) {
        return true;
      }

      return false;
    },
    jwt: async ({ token, user, trigger }) => {
      // by default id is not included in the payload
      // we have to add it manually
      if (user?.id) {
        // User is available during sign-in
        token.userId = user.id;
        token.email = user.email!;
        token.hasAccess = user.hasAccess;
      }

      if (trigger === 'update') {
        const dbUser = await getUserByEmail(token.email);
        if (dbUser) {
          token.hasAccess = dbUser.hasAccess;
        }
      }

      return token;
    },
    session({ session, token }) {
      // and we have to manually attach the userId to the session
      session.user.id = token.userId;
      session.user.hasAccess = token.hasAccess;

      return session;
    },
  },
});
