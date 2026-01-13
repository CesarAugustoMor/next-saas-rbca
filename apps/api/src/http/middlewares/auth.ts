import type { FastifyInstance } from "fastify";
import { UnauthorizedError } from "../routes/_erros/unauthorized-error";
import fastifyPlugin from "fastify-plugin";

export const authMiddleware= fastifyPlugin(async (app: FastifyInstance)=> {
  app.addHook("preHandler", async (request, reply) => {
    request.getCurrentUserId = async () => {
        try {
            const {sub} = await request.jwtVerify<{ sub: string }>();

            return sub;
        } catch (error) {
            throw new UnauthorizedError('Invalid or missing token');
        }
    };
  });
})