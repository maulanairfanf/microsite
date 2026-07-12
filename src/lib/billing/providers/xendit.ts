import { Xendit } from "xendit-node";

const XENDIT_SECRET_KEY = process.env.XENDIT_SECRET_KEY;
const XENDIT_CALLBACK_TOKEN = process.env.XENDIT_CALLBACK_TOKEN;

export function isXenditConfigured(): boolean {
  return Boolean(XENDIT_SECRET_KEY && XENDIT_CALLBACK_TOKEN);
}

let _xendit: Xendit | null = null;

function getXendit(): Xendit {
  if (_xendit) return _xendit;
  if (!XENDIT_SECRET_KEY) {
    throw new Error(
      "XENDIT_SECRET_KEY is not set. Get sandbox keys at https://dashboard.xendit.co/settings/developers/api-keys",
    );
  }
  _xendit = new Xendit({ secretKey: XENDIT_SECRET_KEY });
  return _xendit;
}

export interface XenditCheckoutInput {
  tenantId: string;
  externalId: string;
  tenantName: string;
  customerEmail: string;
  successUrl: string;
  failureUrl: string;
}

export interface XenditCheckoutResult {
  url: string;
  externalId: string;
}

export async function createXenditCheckoutSession(
  input: XenditCheckoutInput,
): Promise<XenditCheckoutResult> {
  const xendit = getXendit();
  const externalId = input.externalId;

  const invoice = await xendit.Invoice.createInvoice({
    data: {
      externalId,
      amount: 30000,
      payerEmail: input.customerEmail,
      description: "Halamanku Premium — monthly subscription",
      customer: { givenNames: input.tenantName },
      successRedirectUrl: input.successUrl,
      failureRedirectUrl: input.failureUrl,
      shouldSendEmail: false,
      paymentMethods: ["GO_PAY", "OVO", "DANA", "SHOPEEPAY", "LINKAJA", "QRIS", "VIRTUAL_ACCOUNT"],
    },
  });

  if (!invoice.invoiceUrl) {
    throw new Error("Xendit did not return an invoice URL");
  }

  return { url: invoice.invoiceUrl, externalId };
}

export interface XenditWebhookEvent {
  type: string;
  data: { object: Record<string, unknown> };
  raw: Record<string, unknown>;
}

export function verifyXenditWebhook(rawBody: string, callbackToken: string): XenditWebhookEvent {
  if (!XENDIT_CALLBACK_TOKEN) {
    throw new Error("XENDIT_CALLBACK_TOKEN is not set");
  }
  if (callbackToken !== XENDIT_CALLBACK_TOKEN) {
    throw new Error("Invalid Xendit webhook signature");
  }
  const event = JSON.parse(rawBody) as Record<string, unknown>;
  return {
    type: String(event.event ?? ""),
    data: { object: (event.data as Record<string, unknown> | undefined) ?? {} },
    raw: event,
  };
}

export function extractTenantIdFromExternalId(
  externalId: string | null | undefined,
): string | null {
  if (!externalId) return null;
  const parts = externalId.split("-");
  if (parts.length < 3 || parts[0] !== "halamanku") return null;
  return parts[1] ?? null;
}

export const XenditInvoiceStatus = {
  Paid: "PAID",
  Pending: "PENDING",
  Expired: "EXPIRED",
  Unknown: "UNKNOWN",
} as const;
export type XenditInvoiceStatus = (typeof XenditInvoiceStatus)[keyof typeof XenditInvoiceStatus];

export interface XenditInvoice {
  id: string;
  externalId: string;
  status: XenditInvoiceStatus;
  amount: number;
  currency: string;
  paymentMethod: string | null;
  paymentChannel: string | null;
  paidAt: Date | null;
}

function normalizeStatus(raw: string | undefined): XenditInvoiceStatus {
  const s = String(raw ?? "").toUpperCase();
  if (s === XenditInvoiceStatus.Paid || s === "SETTLED") return XenditInvoiceStatus.Paid;
  if (s === XenditInvoiceStatus.Expired) return XenditInvoiceStatus.Expired;
  if (s === XenditInvoiceStatus.Pending || s === "UNPAID") return XenditInvoiceStatus.Pending;
  return XenditInvoiceStatus.Unknown;
}

export async function getXenditInvoice(externalId: string): Promise<XenditInvoice | null> {
  const xendit = getXendit();
  const list = (await xendit.Invoice.getInvoices({ externalId })) as unknown;
  const arr = Array.isArray(list)
    ? (list as Record<string, unknown>[])
    : ((list as { data?: Record<string, unknown>[] })?.data ?? []);
  const invoice = arr[0];
  if (!invoice) return null;

  const id = typeof invoice.id === "string" ? invoice.id : "";
  return {
    id,
    externalId: typeof invoice.external_id === "string" ? invoice.external_id : externalId,
    status: normalizeStatus(invoice.status as string | undefined),
    amount: typeof invoice.amount === "number" ? invoice.amount : 0,
    currency: typeof invoice.currency === "string" ? invoice.currency.toUpperCase() : "IDR",
    paymentMethod: typeof invoice.payment_method === "string" ? invoice.payment_method : null,
    paymentChannel: typeof invoice.payment_channel === "string" ? invoice.payment_channel : null,
    paidAt: typeof invoice.paid_at === "string" ? new Date(invoice.paid_at) : null,
  };
}

export async function findXenditInvoiceByExternalId(
  externalId: string,
): Promise<XenditInvoice | null> {
  return getXenditInvoice(externalId);
}

/**
 * Sandbox-only: ask Xendit to mark the invoice as PAID. Only works with
 * Xendit test/sandbox credentials. Throws on any failure.
 */
export async function simulateXenditInvoicePayment(externalId: string): Promise<XenditInvoice> {
  if (!XENDIT_SECRET_KEY) {
    throw new Error("XENDIT_SECRET_KEY is not set");
  }
  const existing = await getXenditInvoice(externalId);
  if (!existing) {
    throw new Error(`Invoice not found for externalId ${externalId}`);
  }
  if (!existing.id) {
    throw new Error("Invoice is missing an id");
  }

  const auth = Buffer.from(`${XENDIT_SECRET_KEY}:`).toString("base64");
  const res = await fetch(`https://api.xendit.co/v2/invoices/${existing.id}/simulate_payment`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Xendit simulate_payment failed: ${res.status} ${res.statusText}${body ? ` — ${body}` : ""}`,
    );
  }

  const refreshed = await getXenditInvoice(externalId);
  if (!refreshed) {
    throw new Error("Invoice disappeared after simulate_payment");
  }
  return refreshed;
}
