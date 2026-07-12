const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY;
const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID;
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY;

export function isEmailConfigured(): boolean {
  return Boolean(EMAILJS_PUBLIC_KEY && EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID);
}

export interface SendVerificationEmailInput {
  to: string;
  name: string;
  verificationUrl: string;
}

export interface SendEmailResult {
  id: string;
}

export async function sendVerificationEmail(
  input: SendVerificationEmailInput,
): Promise<SendEmailResult> {
  if (!EMAILJS_PUBLIC_KEY || !EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID) {
    throw new Error("EmailJS configuration is incomplete");
  }

  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY,
      accessToken: EMAILJS_PRIVATE_KEY,
      template_params: {
        user_name: input.name,
        to_email: input.to,
        verification_url: input.verificationUrl,
        expires_in: "1440",
        year: new Date().getFullYear().toString(),
        reply_to: "noreply@halamanku.com",
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text().catch(() => "Unknown error");
    throw new Error(`Failed to send email: ${response.status} ${error}`);
  }

  const text = await response.text();
  return { id: text || "unknown" };
}
