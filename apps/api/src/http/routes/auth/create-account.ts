import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
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
        return { message: "User created successfully" };
    });
};