interface FooterLink {
  text: string;
  url: string;
}
interface FooterProps {
  joinButton?: {
    text: string;
    url: string;
  };
  footerLinks?: FooterLink[];
}

export function Footer({ joinButton, footerLinks }: FooterProps) {
  const resolvedJoin =
    joinButton ?? ({ text: "Join this page on Halamanku", url: "#" } as const);
  const resolvedFooterLinks =
    footerLinks ??
    ([
      { text: "Cookie Preferences", url: "#" },
      { text: "Report", url: "#" },
      { text: "Privacy", url: "#" },
    ] as const);

  return (
    <footer className="w-full py-4 px-6">
      {/* Social Media Section */}

      {/* Join Button Section */}
      <div className="flex justify-center mb-8">
        <a
          href={resolvedJoin.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-sm px-6 py-3 shadow-xl bg-white rounded-md text-black"
        >
          {resolvedJoin.text}
        </a>
      </div>

      {/* Footer Links Section */}
      <div className="flex justify-center items-center gap-3 text-xs" style={{ color: "var(--cardText)", opacity: 0.8 }}>
        {resolvedFooterLinks.map((link, index) => (
          <div key={link.text} className="flex items-center gap-3">
            <a
              href={link.url}
              className="transition-colors hover:opacity-80"
              style={{ color: "var(--cardText)" }}
            >
              {link.text}
            </a>
            {index < resolvedFooterLinks.length - 1 && (
              <span style={{ color: "var(--cardText)", opacity: 0.3 }}>•</span>
            )}
          </div>
        ))}
      </div>
    </footer>
  );
}
