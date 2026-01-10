import { z } from "zod";

import { RoleSubject} from "../roles";


export const UserSchema = z.object({
    role: RoleSubject
});

export type User = z.infer<typeof UserSchema>;