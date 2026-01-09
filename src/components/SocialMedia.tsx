import { FaFacebook, FaInstagram, FaTiktok, FaSpotify, FaYoutube, FaApple } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

interface SocialMediaProps {
  links: SocialLink[];

}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  facebook: FaFacebook,
  instagram: FaInstagram,
  tiktok: FaTiktok,
  spotify: FaSpotify,
  youtube: FaYoutube,
  apple: FaApple,
  x: FaXTwitter,
};

export function SocialMedia({ links }: SocialMediaProps) {

  return (
    <section className="w-full py-4 px-6">
      <div className="flex justify-center gap-4">
        {links.map((social) => {
          const Icon = iconMap[social.icon];
          if (!Icon) return null;
          return (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:opacity-80"
              style={{ color: "var(--cardText)" }}
              aria-label={social.name}
            >
              <Icon className="w-6 h-6 hover:scale-125 transition-all" />
            </a>
          );
        })}
      </div>

    </section>
  );
}
