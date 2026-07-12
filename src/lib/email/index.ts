export { isEmailConfigured } from "@/lib/email/providers/emailjs";
export { sendVerificationEmail } from "@/lib/email/providers/emailjs";
export type { SendVerificationEmailInput, SendEmailResult } from "@/lib/email/providers/emailjs";
export {
  generateEmailVerificationToken,
  getEmailVerificationTokenExpiry,
} from "@/lib/email/utils/generate-token";
