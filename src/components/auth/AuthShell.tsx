import { BrandLogo } from "@/components/auth/BrandLogo";

interface AuthShellProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function AuthShell({ title, description, children }: AuthShellProps) {
  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:py-12">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(360px,440px)]">
        <section className="hidden max-w-xl lg:block">
          <p className="mb-5 text-sm font-medium text-primary">One link for everything you share</p>
          <h1 className="text-5xl font-semibold tracking-[-0.04em] text-foreground">
            A calm home for your links, products, and updates.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-muted-foreground">
            Build a page that feels like your own. Edit blocks, choose a theme, and share a single
            link.
          </p>
          <div className="mt-10 max-w-sm rounded-2xl border border-border bg-card p-5">
            <div className="mx-auto size-12 rounded-full bg-primary/10" />
            <p className="mt-4 text-center text-sm font-semibold text-foreground">
              Your page, your way
            </p>
            <div className="mt-5 space-y-2">
              {["Latest collection", "Follow on Instagram", "Contact me"].map((label) => (
                <div
                  key={label}
                  className="rounded-xl border border-border px-4 py-3 text-center text-sm font-medium text-foreground"
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className="mb-9 flex justify-center lg:justify-start">
            <BrandLogo />
          </div>
          <div className="mb-7">
            <h2 className="text-2xl font-semibold tracking-[-0.02em] text-foreground">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
          </div>
          {children}
        </section>
      </div>
    </main>
  );
}
