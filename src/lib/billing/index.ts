import {
  isXenditConfigured,
  createXenditCheckoutSession,
  verifyXenditWebhook,
  extractTenantIdFromExternalId,
  getXenditInvoice,
  findXenditInvoiceByExternalId,
  simulateXenditInvoicePayment,
  XenditInvoiceStatus,
  type XenditCheckoutInput,
  type XenditCheckoutResult,
  type XenditWebhookEvent,
  type XenditInvoice,
} from "@/lib/billing/providers/xendit";

export {
  isXenditConfigured,
  createXenditCheckoutSession,
  verifyXenditWebhook,
  extractTenantIdFromExternalId,
  getXenditInvoice,
  findXenditInvoiceByExternalId,
  simulateXenditInvoicePayment,
  XenditInvoiceStatus,
  type XenditCheckoutInput,
  type XenditCheckoutResult,
  type XenditWebhookEvent,
  type XenditInvoice,
};

export interface CheckoutInput {
  tenantId: string;
  externalId: string;
  tenantName: string;
  customerEmail: string;
  successUrl: string;
  failureUrl: string;
}

export interface CheckoutResult {
  url: string;
  externalId?: string;
  sessionId?: string;
}

export type WebhookEvent = XenditWebhookEvent;

export function isBillingConfigured(): boolean {
  return isXenditConfigured();
}

export async function createCheckoutSession(input: CheckoutInput): Promise<CheckoutResult> {
  const result = await createXenditCheckoutSession(input);
  return { url: result.url, externalId: result.externalId };
}

export function verifyWebhook(
  rawBody: string,
  _signature: string,
  callbackToken?: string,
): WebhookEvent {
  if (!callbackToken) {
    throw new Error("Xendit webhook requires callback token in x-callback-token header");
  }
  return verifyXenditWebhook(rawBody, callbackToken);
}

export async function cancelSubscription(_externalId: string): Promise<void> {
  // Xendit has no cancel API; the cancel route just marks our local DB.
}
