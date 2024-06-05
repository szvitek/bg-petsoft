// The `JWT` interface can be found in the `next-auth/jwt` submodule
import {} from 'next-auth/jwt';

declare module 'next-auth/jwt' {
  interface JWT {
    userId: string;
  }
}
