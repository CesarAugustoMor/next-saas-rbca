import { defineAbility } from '@saas/auth';

const ability = defineAbility({ role: 'MEMBER' });

const userCanInviteSomeoneElse = ability.can("invite", "User");
console.log("User can invite someone else:", userCanInviteSomeoneElse);

const userCanDeleteOthersUser = ability.can("delete", "User");
console.log("User can delete a user:", userCanDeleteOthersUser);

const userCannotDeleteUsers = ability.cannot("delete", "User");
console.log("User cannot delete users:", userCannotDeleteUsers);