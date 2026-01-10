import { z } from "zod";

export const InviteSchema = z.object({
    __typename: z.literal('Invite').default('Invite'),
    id: z.uuid(),
    ownerId: z.uuid()
});

export type Invite = z.infer<typeof InviteSchema>;