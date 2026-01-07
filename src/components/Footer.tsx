import { FaFacebook, FaInstagram, FaTiktok, FaSpotify, FaYoutube, FaApple } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

interface FooterLink {
  text: string;
  url: string;
}

interface FooterProps {
  socialMedia: SocialLink[];
  joinButton: {
    text: string;
    url: string;
  };
  footerLinks: FooterLink[];
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

export function Footer({ socialMedia, joinButton, footerLinks }: FooterProps) {
  return (
    <footer className="bg-gray-100 py-12 px-6">
      {/* Social Media Section */}
      <div className="flex justify-center gap-4 mb-8">
        {socialMedia.map((social) => {
          const Icon = iconMap[social.icon];
          if (!Icon) return null;
          
          return (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-800 hover:text-gray-600 transition-colors"
              aria-label={social.name}
            >
              <Icon className="w-6 h-6" />
            </a>
          );
        })}
      </div>

      {/* Join Button Section */}
      <div className="flex justify-center mb-8">
        <a
          href={joinButton.url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white hover:bg-gray-50 text-gray-900 font-medium text-sm px-6 py-3 rounded-full shadow-sm transition-colors"
        >
          {joinButton.text}
        </a>
      </div>

      {/* Footer Links Section */}
      <div className="flex justify-center items-center gap-3 text-xs text-gray-600">
        {footerLinks.map((link, index) => (
          <div key={link.text} className="flex items-center gap-3">
            <a
              href={link.url}
              className="hover:text-gray-900 transition-colors"
            >
              {link.text}
            </a>
            {index < footerLinks.length - 1 && (
              <span className="text-gray-400">•</span>
            )}
          </div>
        ))}
      </div>
    </footer>
  );
}
