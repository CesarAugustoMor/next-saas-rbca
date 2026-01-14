import { z } from "zod"
import { BillingSchema } from "../models/billing"

export const billingSubject = z.tuple([
    z.union([
        z.literal('manage'),
        z.literal('get'),
        z.literal('export'),
    ]),
        z.union([z.literal('Billing'), BillingSchema])
]);

export type BillingSubject = z.infer<typeof billingSubject>