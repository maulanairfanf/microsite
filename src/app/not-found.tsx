import Link from "next/link";
import { BrandLogo } from "@/components/auth/BrandLogo";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center">
        <div className="flex justify-center mb-5">
          <BrandLogo />
        </div>

        <p className="text-6xl font-semibold tracking-[-0.06em] text-foreground">404</p>
        <h1 className="mt-4 text-2xl font-semibold text-foreground">Page not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Back to home
          </Link>
          <Link
            href="/sign-up"
            className="rounded-xl border border-border px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Create your page
          </Link>
        </div>
      </div>
    </main>
  );
}
