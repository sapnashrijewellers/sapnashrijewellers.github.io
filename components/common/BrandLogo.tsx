import Link from "next/link";
import Image from "next/image";

type BrandLogoProps = {
  pulse?: boolean;
  className?: string;
};

export default function BrandLogo({
  pulse = true,
  className = "",
}: BrandLogoProps) {
  return (
    <div className={`flex items-center shrink-0 leading-none ${className}`}>
      <Link
        href="/"
        title="Sapna Shri Jewellers - Homepage"
        aria-label="Sapna Shri Jewellers - Homepage"
        className="inline-flex items-center rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <span
          className={`inline-block ${
            pulse ? "brand-pulse motion-reduce:animate-none" : ""
          }`}
        >
          <Image
            src="/icons/logo-wide.webp"
            alt="Sapna Shri Jewellers Nagda Official Logo"
            width={200}
            height={63}
            priority
            sizes="(max-width: 640px) 160px, 200px"
            className="w-40 sm:w-50 h-auto object-contain rounded-xl"
          />
        </span>
      </Link>
    </div>
  );
}
