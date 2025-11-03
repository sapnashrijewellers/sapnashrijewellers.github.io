import { Outlet } from "react-router-dom";
import LogoHeader from "../components/LogoHeader";
import RatesPanel from "../components/RatesPanel";
import Ticker from "../components/Ticker"
import WhatsAppContact from "../components/WhatsAppContact";
export default function TvLayout() {
  return (
    <div className="flex flex-col p-2 overflow-hidden">
      
      <LogoHeader className="flex-none" />
      <Ticker />
      {/* 2-column layout */}
      <div className="flex-1 grid grid-cols-[2fr_1fr] gap-2 h-full">
        {/* Left: Product slideshow */}
        <div className="flex justify-center items-center">
          <Outlet />
        </div>

        {/* Right: Rates panel */}
        <div className="">
          <RatesPanel />
          {/* WhatsApp Contact */}
        <WhatsAppContact />
        </div>        
      </div>
    </div>
  );
}