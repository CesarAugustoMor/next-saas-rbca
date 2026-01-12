import { hash } from "bcryptjs";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "@/lib/prisma";
import z from "zod";

export async function createAccount(app:FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/user', {
        schema: {
            body: z.object({
                name: z.string().min(3),
                email: z.email(),
                password: z.string().min(6),
            })
        }
    }, async (request, reply) => {
        const { name, email, password } = request.body;

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            return reply.status(400).send({ error: "User with same email already exists" });
        }

        const hashedPassword =  await hash(password, 6); // numero varia de acordo com o nivel de seguranca (performance)

        await prisma.user.create({
            data: {
                name,
                email,
                hashedPassword,
            }
        });

        return reply.status(201).send({ message: "User created successfully" });
    });
};