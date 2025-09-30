import { Outlet } from "react-router-dom";
import LogoHeader from "../components/LogoHeader";
import RatesPanel from "../components/RatesPanel";

export default function TvLayout() {
  return (
    <div className="w-screen h-screen bg-black text-white flex flex-col p-3">
      {/* Top bar */}
      <LogoHeader />

      {/* 2-column layout */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-[80%_20%] ">
        {/* Left: Product slideshow (70%) */}
        <div className="w-full h-full overflow-hidden">
          <Outlet />
        </div>

        {/* Right: Rates (30%) */}
        <div className="w-full h-full bg-black ">
          <RatesPanel />
        </div>
      </div>
    </div>
  );
}
