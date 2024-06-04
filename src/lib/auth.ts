import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
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
        const { email, password } = credentials;
        // runs on login
        const user = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });

        console.log('user');

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

      if (isLoggedIn && isTryingToAccessApp) {
        return true;
      }

      if (!isTryingToAccessApp) {
        return true;
      }
    },
  },
});
