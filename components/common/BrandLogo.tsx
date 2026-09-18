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
        className="inline-flex items-center rounded-xl"
      >
        <Image
          src="/logo.png"
          alt="Sapna Shri Jewellers Nagda Official Logo"
          width={100}
          height={100}
          priority
          sizes="(max-width: 200px) 100px, 100px"
          className="h-auto w-24 rounded-xl object-contain sm:w-24"
        />
      </Link>
    </div>
  );
}
