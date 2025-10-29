import { Link } from "react-router-dom";
import { useData } from "../context/DataContext";
import IndianRupeeRate from './IndianRupeeRate';
export default function Navbar() {
  const { rates } = useData();

  if (!rates) return null;

  return (
    <nav className="text-white p-2 shadow-md w-full bg-black">
      <div className="mx-auto max-w-7xl flex justify-between items-start">

        {/* Left: Logo */}
        <div className="flex-shrink-0 flex items-center">
          <Link to="/" className="flex items-center">
            <img
              src="/logo.png"
              alt="Sapna Shri Jewellers Nagda | सपना श्री ज्वैलर्स, नागदा"
              className="h-24 w-auto logo"
            />
          </Link>
        </div>

        {/* Right: Menu + Rates */}
        <div className="flex flex-col justify-between w-full sm:w-auto ml-4">
          {/* Top row: Menu links */}
          <div className="flex flex-wrap justify-end gap-4 mb-1">
            <Link className="hover:underline" to="/">होम</Link>            
            <Link className="hover:underline" to="/calculator">कैलकुलेटर</Link>
          </div>
          <div className="flex justify-start gap-4">
            <span>
              <span className="animate-pulse w-3 h-3 bg-red-500 rounded-full inline-block p-1"></span>&nbsp;
              लाइव रेट *  {new Date(rates.asOn).toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
                timeZone: "Asia/Kolkata"
              })}
            </span>
          </div>
          {/* Bottom row: Live rates */}
          {rates.gold24K > 0 && (
            <div className="flex justify-start gap-4">
              <span className="flex items-center gap-1">

                <span>सोना (24K):<IndianRupeeRate rate={rates.gold24K * 10} className="text-green-500" />
                </span>
              </span>
              <span>सोना (22K):<IndianRupeeRate rate={rates.gold22K * 10} className="text-green-500" />              </span>
            </div>
          )}
          {rates.silver > 0 && (<div className="flex justify-start gap-4">
            <span className="flex items-center gap-1">              
              <span>चाँदी (99.9): <IndianRupeeRate rate={rates.silver * 1000} className="text-green-500" />            </span>
            </span>
            <span>चाँदी(जेवर): <IndianRupeeRate rate={(rates.silver * 1000) * (0.92)} className="text-green-500" />
            </span>
          </div>)}

        </div>
      </div>
    </nav>
  );
}