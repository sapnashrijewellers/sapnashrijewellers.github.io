import { Outlet } from "react-router-dom";
import LogoHeader from "../components/LogoHeader";
import RatesPanel from "../components/RatesPanel";
import Ticker from "../components/Ticker"
import WhatsAppContact from "../components/WhatsAppContact";
export default function TvLayout() {
  return (
    <div className="w-screen h-screen bg-black text-white flex flex-col p-2 overflow-hidden">
      {/* Top bar */}
      <LogoHeader className="flex-none" />
      <Ticker />
      {/* 2-column layout */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-2 h-full">
        {/* Left: Product slideshow */}
        <div className="w-full h-full overflow-hidden flex justify-center items-center">
          <Outlet />
        </div>

        {/* Right: Rates panel */}
        <div className="w-full h-full bg-black overflow-hidden">
          <RatesPanel />
          {/* WhatsApp Contact */}
        <WhatsAppContact />
        </div>
        
      </div>
    </div>
  );
}