import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
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

          console.log(result);
          return {
            name: result.data.user.name,
            email: result.data.user.email,
            id: result.data.user.id,
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
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar,
          token: user.token,
        };
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.user.token = token.token;
      session.user.id = token.sub;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.phone = token.phone;
      session.user.avatar = token.avatar;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions as AuthOptions);
export { handler as GET, handler as POST };
