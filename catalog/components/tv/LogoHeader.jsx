import Link from 'next/link'
import Image from "next/image";
export default function LogoHeader() {
  return (
    <header className="w-full flex items-center justify-between p-2 bg-highlight" role="banner">
      {/* Left: Logo */}
      <Link href="/" className="flex items-center" aria-label="Go to homepage">
        <Image
          src="/icons/android-chrome-192x192.png"
          alt="Sapna Shri Jewellers Nagda | सपना श्री ज्वैलर्स, नागदा"
          className="h-24 object-contain"
          itemProp="logo"
          width="192"
          height="192"
        />
      </Link>

      {/* Right: Shop Name */}
      <h1
        className="text-5xl sm:text-7xl text-primary shimmer-gold text-right"
        style={{
          textShadow: `0 0 0.1rem #4a3400,
                       0.1rem 0.1rem 0.1rem #fff,
                       0 0 0.5rem rgba(255, 237, 74, 0.6)`,
        }}
        itemProp="name"
      >
        सपना श्री ज्वैलर्स
      </h1>
    </header>
  );
}
