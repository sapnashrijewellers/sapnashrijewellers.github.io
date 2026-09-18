import Link from 'next/link';
import Image from 'next/image';

type BrandLogoProps = {
  className?: string;
};

export default function BrandLogo({ className = '' }: BrandLogoProps) {
  return (
    <div className={`flex shrink-0 items-center leading-none ${className}`}>
      <Link
        href="/"
        title="Sapna Shri Jewellers - Homepage"
        aria-label="Sapna Shri Jewellers - Homepage"
        className="inline-flex items-center rounded-lg"
      >
        <Image
          src="/logo.webp"
          alt="Sapna Shri Jewellers Nagda Official Logo"
          width={80}
          height={80}
          priority
          sizes="80px"
          className="h-14 w-14 rounded-lg object-contain min-[400px]:h-16 min-[400px]:w-16 sm:h-20 sm:w-20"
        />
      </Link>
    </div>
  );
}
