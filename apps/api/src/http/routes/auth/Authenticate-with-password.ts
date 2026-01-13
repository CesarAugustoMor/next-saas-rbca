import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

export async function authenticateWithPassword(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/sessions/password', {
        schema: {
            tags: ["auth"],
            summary: "Authenticate with email and password",
            body: z.object({
                email: z.email(),
                password: z.string().min(6),
            }),
            response: {
                201: z.object({
                    token: z.string(),
                }),
                400: z.object({
                    error: z.string(),
                }),
            },
        },
    },
    async (request, reply) => {
        const { email, password } = request.body;

        const userFromEmail = await prisma.user.findUnique({
            where: { email }
        });

        if (!userFromEmail) {
            return reply.status(400).send({ error: "Invalid credentials." });
        }

        if (userFromEmail.passwordHash == null) {
            return reply.status(400).send({ error: "User does not have a password, use social login." });
        }

        const isPasswordValid = await compare(password, userFromEmail.passwordHash);

        if (!isPasswordValid) {
            return reply.status(400).send({ error: "Invalid credentials." });
        }

        const token = await reply.jwtSign({
            sub: userFromEmail.id,
        },
             {
            sign: {
                expiresIn: "7 days",
            }
        });

        return reply.status(201).send({ token });
    });
}