import { defineAbility, ProjectSchema } from '@saas/auth';

const ability = defineAbility({ role: 'MEMBER', id: '123e4567-e89b-12d3-a456-426614174000', __typename: 'User' });

const project =ProjectSchema.parse({
    id: '223e4567-e89b-12d3-a456-426614174000',
    ownerId: '123e4567-e89b-12d3-a456-426614174000'
});

const userCanInviteSomeoneElse = ability.can("get", "User");
console.log("User can invite someone else:", userCanInviteSomeoneElse);

const userCanDeleteOthersUser = ability.can("get", "Billing");
console.log("User can delete a user:", userCanDeleteOthersUser);

const userCannotDeleteUsers = ability.can('create', 'Invite');
console.log("User cannot delete users:", userCannotDeleteUsers);

const userCanDeleteOwnProject = ability.can('delete', project);
console.log("User can delete own project:", userCanDeleteOwnProject);