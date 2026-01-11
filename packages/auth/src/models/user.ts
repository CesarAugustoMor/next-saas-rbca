import { z } from "zod";

import { RoleSubject} from "../roles";

export const UserSchema = z.object({
    __typename: z.literal('User').default('User'),
    id: z.string(),
    role: RoleSubject
});

export type User = z.infer<typeof UserSchema>;