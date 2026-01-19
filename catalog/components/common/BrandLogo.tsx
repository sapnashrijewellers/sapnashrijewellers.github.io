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
    <div className={`flex items-center leading-none ${className}`}>
      <Link
        href="/"
        title="Go to Home Page of Sapna Shri Jewellers"
        className="inline-flex items-center"        
      >
        <span className={pulse ? "brand-pulse inline-block" : "inline-block"}>
          <Image
            src="/icons/logo-wide.png"
            alt="Sapna Shri Jewellers Nagda | Wide Logo"
            width={320}
            height={120}
            priority
            className="h-14 w-auto rounded-xl"
          />
        </span>
      </Link>
    </div>
  );
}
