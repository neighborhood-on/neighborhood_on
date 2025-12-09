import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import KakaoProvider from "next-auth/providers/kakao"
import CredentialsProvider from "next-auth/providers/credentials"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb"
import bcrypt from "bcrypt"

export const authOptions: NextAuthOptions = {
    adapter: MongoDBAdapter(clientPromise, {
        databaseName: process.env.MONGODB_DB || 'neighborhood_on'
    }) as any,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        }),
        KakaoProvider({
            clientId: process.env.KAKAO_CLIENT_ID ?? "",
            clientSecret: process.env.KAKAO_CLIENT_SECRET ?? "",
            profile(profile) {
                return {
                    id: String(profile.id),
                    name: profile.kakao_account?.profile?.nickname ?? profile.properties?.nickname ?? "Unknown",
                    email: profile.kakao_account?.email,
                    point: 0 // Initialize point for social login
                }
            },
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('이메일과 비밀번호를 입력해주세요.')
                }

                const client = await clientPromise
                const db = client.db(process.env.MONGODB_DB || 'neighborhood_on')
                const user = await db.collection('users').findOne({ email: credentials.email })

                if (!user || user.provider /* Social user couldn't have password */) {
                    throw new Error('가입되지 않은 이메일이거나, 소셜 계정입니다.')
                }

                const isValid = await bcrypt.compare(credentials.password, user.password)

                if (!isValid) {
                    throw new Error('비밀번호가 일치하지 않습니다.')
                }

                return { id: user._id.toString(), name: user.name, email: user.email, point: user.point || 0 }
            }
        })
    ],
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.point = (user as any).point || 0
            }
            if (trigger === "update" && session?.point) {
                token.point = session.point
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                // @ts-expect-error - id property exists in token
                session.user.id = token.sub
                session.user.point = token.point as number || 0
            }
            return session
        },
    },
}
