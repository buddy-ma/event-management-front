import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },

              body: JSON.stringify({
                email: credentials?.email,
                password: credentials?.password,
              }),
            }
          );

          // Check if response is HTML instead of JSON (which could indicate an error page)
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("text/html")) {
            throw new Error("Invalid server response");
          }

          const result = await res.json();

          if (!res.ok) {
            throw new Error(result.message || "Authentication failed");
          }

          return {
            id: result.data.user.id,
            name: result.data.user.name,
            email: result.data.user.email,
            phone: result.data.user.phone,
            avatar: result.data.user.avatar,
            token: result.data.token,
          };
        } catch (error: any) {
          throw new Error(error.message || "Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          ...user,
        };
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        name: token.name,
        email: token.email,
        phone: token.phone,
        avatar: token.avatar,
        token: token.token
      };
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
