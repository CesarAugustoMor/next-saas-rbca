import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {z} from "zod";
import { BadRequestError } from "../_erros/bad-request-error";
import { prisma } from "@/lib/prisma";
import { env } from "@saas/env";

export async function authenticateWithGithub(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/sessions/github', {
        schema: {
            tags: ["auth"],
            summary: "Authenticate with GitHub",
            body: z.object({
                code: z.string()
            }),
            response: {
                201: z.object({
                    token: z.string(),
                }),
            },
        },
    },
    async (request, reply) => {
        const { code } = request.body;

        const githubOAuthUrl = new URL('https://github.com/login/oauth/access_token',
            );
        githubOAuthUrl.searchParams.append('client_id', env.GITHUB_OAUTH_CLIENT_ID);
        githubOAuthUrl.searchParams.append('client_secret', env.GITHUB_OAUTH_CLIENT_SECRET);
        githubOAuthUrl.searchParams.append('redirect_uri', env.GITHUB_OAUTH_CLIENT_REDIRECT_URI);
        githubOAuthUrl.searchParams.append('code', code);

        const accessTokenResponse = await fetch(githubOAuthUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
        });

        const githubAccessTokenData = await accessTokenResponse.json();

        const {access_token:accessToken} = z.object({
            access_token: z.string(),
            token_type: z.literal('bearer'),
            scope: z.string(),
        }).parse(githubAccessTokenData);

        const githubUserResponse = await fetch('https://api.github.com/user', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const githubUserData = await githubUserResponse.json();

        const {id: githubId, avatar_url, name, email} = z.object({
            id: z.number().transform(String),
            avatar_url: z.url(),
            name: z.string().nullable(),
            email: z.string().nullable(),
        }).parse(githubUserData);

        if (email=== null) {
            throw new BadRequestError('Your GitHub account does not have an email associated. Please add an email to your GitHub account and try again.');
        }

        let user = await prisma.user.findUnique({
            where: {email},
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    name,
                    email,
                    avatarUrl: avatar_url,
                },
            });
        }

        let account = await prisma.account.findUnique({
            where: {
                provider_userId: {
                    provider: 'GITHUB',
                    userId: user.id,
                },
            },
        });

        if (!account) {
            account = await prisma.account.create({
                data: {
                    provider: 'GITHUB',
                    providerAccountId: githubId,
                    userId: user.id,
                },
            });
        }

        const token = await reply.jwtSign({
            sub: user.id,
        },
             {
            sign: {
                expiresIn: "7 days",
            }
        });

        return reply.status(201).send({ token});
    });
}