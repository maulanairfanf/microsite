-- ReplaceStripeWithXenditInSubscription
-- Rename Stripe columns to Xendit equivalents; drop unused stripeCustomerId

DROP INDEX IF EXISTS "subscriptions_stripeSubscriptionId_key";

ALTER TABLE "subscriptions" DROP COLUMN IF EXISTS "stripeCustomerId";

ALTER TABLE "subscriptions" RENAME COLUMN "stripeSubscriptionId" TO "xenditInvoiceId";

CREATE UNIQUE INDEX "subscriptions_xenditInvoiceId_key" ON "subscriptions"("xenditInvoiceId");
