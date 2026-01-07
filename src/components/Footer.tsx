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
          className="bg-white hover:bg-gray-50 text-gray-900 font-medium text-sm px-6 py-3 rounded-full shadow-sm transition-colors"
        >
          {resolvedJoin.text}
        </a>
      </div>

      {/* Footer Links Section */}
      <div className="flex justify-center items-center gap-3 text-xs text-gray-600">
        {resolvedFooterLinks.map((link, index) => (
          <div key={link.text} className="flex items-center gap-3">
            <a
              href={link.url}
              className="hover:text-gray-900 transition-colors"
            >
              {link.text}
            </a>
            {index < resolvedFooterLinks.length - 1 && (
              <span className="text-gray-400">•</span>
            )}
          </div>
        ))}
      </div>
    </footer>
  );
}
