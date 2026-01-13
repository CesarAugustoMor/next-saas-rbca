import { hash } from "bcryptjs";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "@/lib/prisma";
import z from "zod";
import { BadRequestError } from "../_erros/bad-request-error";

export async function createAccount(app:FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/user', {
        schema: {
            tags: ["Auth"],
            summary: "Create a new user account",
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
            throw new BadRequestError("User with same email already exists");
        }

        const [,domain] = email.split('@');

        const autoJoinOrganization = await prisma.organization.findFirst({
            where: { domain, shouldAttachUsersByDomain: true }
        });

        const hashedPassword =  await hash(password, 6); // número varia de acordo com o nivel de segurança (performance)

        await prisma.user.create({
            data: {
                name,
                email,
                hashedPassword,
                member_on: autoJoinOrganization ? {
                    create:{
                        organizationId: autoJoinOrganization.id,
                    }
                }: undefined,
            }
        });

        return reply.status(201).send({ message: "User created successfully" });
    });
};