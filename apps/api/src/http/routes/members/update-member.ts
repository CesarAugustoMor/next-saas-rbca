import { roleSchema } from '@saas/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { authMiddleware } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function updateMember(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authMiddleware)
    .put(
      '/organizations/:slug/members/:memberId',
      {
        schema: {
          tags: ['Members'],
          summary: 'Update a member.',
          security: [{ bearerAuth: [] }],
          body: z.object({
            role: roleSchema,
          }),
          params: z.object({
            slug: z.string(),
            memberId: z.string(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug, memberId } = request.params
        const userId = await request.getCurrentUserId()
        const { organization, membership } =
          await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('update', 'User')) {
          throw new UnauthorizedError(
            `You're not allowed to update this member.`,
          )
        }

        const { role } = request.body

        const members = await prisma.member.findUnique({
          where: {
            id: memberId,
            organizationId: organization.id,
          },
        })

        if (!members) {
          throw new BadRequestError('Member not found.')
        }

        await prisma.member.update({
          where: {
            id: memberId,
            organizationId: organization.id,
          },
          data: { role },
        })

        return reply.status(204).send()
      },
    )
}
