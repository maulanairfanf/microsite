import { NextRequest, NextResponse } from "next/server";
import { verifyWebhook, extractTenantIdFromExternalId } from "@/lib/billing";
import { activatePremiumSubscription, recordFailedPayment } from "@/lib/billing/activation";

type XenditObject = Record<string, unknown>;

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const callbackToken = request.headers.get("x-callback-token") ?? "";

  let event;
  try {
    event = verifyWebhook(rawBody, "", callbackToken);
  } catch (err) {
    console.error("Xendit webhook verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  console.log("Xendit webhook event:", event.type, {
    external_id: (event.data.object as XenditObject).external_id,
    status: (event.data.object as XenditObject).status,
  });

  try {
    await handleXenditEvent(event.type, event.data.object);
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(`Xendit webhook handler error (${event.type}):`, error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}

async function handleXenditEvent(type: string, payload: XenditObject) {
  const externalId = typeof payload.external_id === "string" ? payload.external_id : null;
  const tenantId = extractTenantIdFromExternalId(externalId);
  if (!tenantId) {
    console.warn(`xendit ${type}: could not parse tenantId from external_id ${externalId}`);
    return;
  }

  const amount = typeof payload.amount === "number" ? payload.amount : 30000;
  const currency =
    typeof payload.currency === "string" ? payload.currency.toUpperCase() : "IDR";
  const paymentMethod =
    typeof payload.payment_method === "string" ? payload.payment_method : null;
  const paymentChannel =
    typeof payload.payment_channel === "string" ? payload.payment_channel : null;
  const xenditInvoiceId = typeof payload.id === "string" ? payload.id : null;
  if (!xenditInvoiceId) {
    console.warn(`xendit ${type}: missing invoice id in payload`);
    return;
  }

  switch (type) {
    case "invoice.paid": {
      await activatePremiumSubscription({
        tenantId,
        xenditInvoiceId,
        amount,
        currency,
        paymentMethod,
        paymentChannel,
        transactionId: xenditInvoiceId,
      });
      break;
    }
    case "invoice.expired":
    case "invoice.failed": {
      await recordFailedPayment({
        tenantId,
        xenditInvoiceId,
        amount,
        currency,
        paymentMethod,
        transactionId: xenditInvoiceId,
        reason: "Invoice expired or payment failed",
      });
      break;
    }
    default:
      break;
  }
}
