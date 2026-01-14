import { z } from "zod"
import { InviteSchema } from "../models/invite"

export const inviteSubject = z.tuple([
    z.union([
        z.literal('manage'),
        z.literal('get'),
        z.literal('create'),
        z.literal('delete'),
    ]),
        z.union([z.literal('Invite'), InviteSchema])
]);

export type InviteSubject = z.infer<typeof inviteSubject>