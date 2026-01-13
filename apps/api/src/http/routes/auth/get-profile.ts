import { prisma } from "@/lib/prisma";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {z} from "zod";
import { BadRequestError } from "../_erros/bad-request-error";
import { authMiddleware } from "@/http/middlewares/auth";

export async function getProfile(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().register(authMiddleware).get('/profile', {
        schema: {
            tags: ["auth"],
            summary: "Get authenticated user profile",
            // No body for GET requests
            response: {
                200: z.object({
                    user: z.object({
                        id: z.uuid(),
                        name: z.string().nullable(),
                        email: z.email(),
                        avatarUrl: z.url().nullable(),
                    })
                }),
                404 : z.object({
                    error: z.string(),
                })
            },
        },
    },
    async (request, reply) => {
        const userID = await request.getCurrentUserId()

        const user = await prisma.user.findUnique({
            select: {
                id: true,
                email: true,
                name: true,
                avatarUrl: true,
            },
            where: { id: userID },
        });

        if (!user) {
            throw new BadRequestError("User not found.");
        }

        return reply.status(200).send({ user });
    });
}