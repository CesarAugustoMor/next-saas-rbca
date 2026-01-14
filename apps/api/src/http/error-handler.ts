import type { FastifyInstance } from "fastify"
import  { z, ZodError } from "zod"
import { BadRequestError } from "./routes/_errors/bad-request-error"
import { UnauthorizedError } from "./routes/_errors/unauthorized-error"

type FastifyErrorHandler = FastifyInstance["errorHandler"]

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
    if (error instanceof ZodError) {
        reply.status(400).send({
            message: "Validation error",
            errors: z.treeifyError(error),
        })
    }

    if (error instanceof BadRequestError) {
        reply.status(400).send({ message: error.message })
    }

    if (error instanceof UnauthorizedError) {
        reply.status(401).send({ message: error.message })
    }

    console.error(error)

    // Todo: send error to monitoring service (e.g., Sentry, DataDog)

    reply.status(500).send({ message: "Internal Server Error" })
}