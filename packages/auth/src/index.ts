import type {CreateAbility, MongoAbility } from '@casl/ability';
import { AbilityBuilder,createMongoAbility} from "@casl/ability";
import { z } from 'zod';
import { permissions } from './permissions';
import { projectSubject } from './subjects/project';
import { organizationSubject } from './subjects/organization';
import { inviteSubject } from './subjects/invite';
import { billingSubject } from './subjects/billing';
import { userSubject } from './subjects/user';
import type { User } from './models/user';

// type AppAbilities = UserSubject | ProjectSubject | ['manage', 'all'];

const appAbilitiesSchema = z.union([
    projectSubject,
    userSubject,
    organizationSubject,
    inviteSubject,
    billingSubject,
    z.tuple([z.literal('manage'), z.literal('all')])
]);

type AppAbilities = z.infer<typeof appAbilitiesSchema>;

export type AppAbility = MongoAbility<AppAbilities>;
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>;

export function defineAbility(user:User) {
    const builder = new AbilityBuilder<AppAbility>(createAppAbility);

    if (typeof permissions[user.role] !== 'function') {
        throw new Error(`Permissions for role ${user.role} not found.`);
        
    }
    permissions[user.role](user, builder);

    const ability = builder.build();

    return ability;
}