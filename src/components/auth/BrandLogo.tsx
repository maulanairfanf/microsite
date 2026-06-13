import Image from "next/image";
import Link from "next/link";

interface BrandLogoProps {
  className?: string;
}

export function BrandLogo({ className = "" }: BrandLogoProps) {
  return (
    <Link href="/">
      <Image
        src="/logo.svg"
        alt="Halamanku"
        width={140}
        height={36}
        className={`h-10 w-auto drop-shadow-lg ${className}`}
      />
    </Link>
  );
}
