import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import {z} from "zod"
import { authMiddleware } from "@/http/middlewares/auth"
import { BadRequestError } from "../_errors/bad-request-error"
import { prisma } from "@/lib/prisma"

export async function getProfile(app: FastifyInstance) {
    app
    .withTypeProvider<ZodTypeProvider>()
    .register(authMiddleware)
    .get(
        '/profile',
        {
        schema: {
            tags: ["auth"],
            summary: "Get authenticated user profile",
            security: [{ bearerAuth: [] }],
            response: {
                200: z.object({
                    user: z.object({
                        id: z.uuid(),
                        name: z.string().nullable(),
                        email: z.email(),
                        avatarUrl: z.url().nullable(),
                    }),
                }),
            },
        },
    },
    async (request, reply) => {
        const userId = await request.getCurrentUserId()

        const user = await prisma.user.findUnique({
            select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
            },
            where: {
                id: userId,
            },
        })

        if (!user) {
            throw new BadRequestError("User not found.")
        }

        return reply.status(200).send({ user })
    })
}