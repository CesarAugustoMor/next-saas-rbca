import { z } from "zod";

export const BillingSchema = z.object({
    __typename: z.literal('Billing').default('Billing'),
    id: z.uuid(),
    ownerId: z.uuid()
});

export type Billing = z.infer<typeof BillingSchema>;