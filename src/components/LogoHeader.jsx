import { Link } from "react-router-dom";

export default function LogoHeader() {
  return (
    <div className="w-full flex items-center justify-between p-4 bg-black">
      {/* Left: Logo */}
      <Link to="/" className="flex items-center">
        <img
          src="/logo.png"
          alt="Sapna Shri Jewellers Nagda | सपना श्री ज्वैलर्स, नागदा"
          className="h-28 sm:h-36 object-contain"
        />
      </Link>

      {/* Right: Shop Name */}
      <h1
        className="text-5xl sm:text-7xl font-bold text-yellow-400 shimmer-gold text-right"
        style={{
          textShadow: `0 0 0.1rem #4a3400,
                       0.1rem 0.1rem 0.1rem #fff,
                       0 0 0.5rem rgba(255, 237, 74, 0.6)`,
        }}
      >
        सपना श्री ज्वैलर्स
      </h1>
    </div>
  );
}
