import { Link } from "react-router-dom";
import { useData } from "../context/DataContext";

export default function Navbar() {  
const {  rates } = useData();

  if (!rates) return null;

  return (
    <nav className="text-white p-3 shadow-md w-full bg-black">
      <div className="mx-auto max-w-7xl flex justify-between items-start">

        {/* Left: Logo */}
        <div className="flex-shrink-0 flex items-center">
          <Link to="/" className="flex items-center">
            <img
              src="/logo.png"
              alt="Sapna Shri Jewellers Nagda | सपना श्री ज्वैलर्स, नागदा"
              className="h-24 w-auto"
            />
          </Link>
        </div>

        {/* Right: Menu + Rates */}
        <div className="flex flex-col justify-between w-full sm:w-auto ml-4">
          {/* Top row: Menu links */}
          <div className="flex flex-wrap justify-end gap-4 mb-1">
            <Link className="hover:underline" to="/">होम</Link>
            <Link className="hover:underline" to="/category/gold">सोना</Link>
            <Link className="hover:underline" to="/category/silver">चाँदी</Link>            
          </div>

          {/* Bottom row: Live rates */}
          <div className="flex justify-end gap-4">
            <span className="flex items-center gap-1">
              <span className="animate-pulse w-3 h-3 bg-red-500 rounded-full inline-block"></span>
              <span>
                सोना (24K): <span className="text-green-500">₹{rates.gold24K}</span>
              </span>
            </span>
            <span>
              चाँदी (99.9): <span className="text-green-500">₹{rates.silver*1000}</span>
            </span>
          </div>
          <div className="flex justify-end gap-4">
            <span className="flex items-center gap-1">
              <span className="animate-pulse w-3 h-3 bg-red-500 rounded-full inline-block"></span>
              <span>
                सोना (22K): <span className="text-green-500">₹{rates.gold22K}</span>
              </span>
            </span>
            <span>
              चाँदी(जेवर): <span className="text-green-500">₹{(rates.silver*1000)*(0.75)}</span>
            </span>
          </div>
        </div>

      </div>
    </nav>
  );
}
