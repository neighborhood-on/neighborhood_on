import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            /** The user's postal address. */
            id: string
            point: number
        } & DefaultSession["user"]
    }

    interface User {
        point: number
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        point: number
    }
}
