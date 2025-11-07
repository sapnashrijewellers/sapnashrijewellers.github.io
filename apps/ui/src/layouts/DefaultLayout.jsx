import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FooterTrust from "../components/FooterTrust";
import { useState } from "react";
import { FaQrcode, FaWhatsapp } from "react-icons/fa";
import Ticker from "../components/Ticker"
export default function DefaultLayout() {
  
  const MY_PHONE_NUMBER = "918234042231";  
  const whatsappUrl = `https://wa.me/${MY_PHONE_NUMBER}?text=Hello!%20I%20have%20a%20question%20about%20your%20service.`;

  return (
    <>
      {/* Floating Buttons */}
      <div className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 z-50 flex flex-col items-end space-y-3">
        <button
          className="p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 bg-green-500 hover:bg-green-600 text-white"
          title={`Chat on WhatsApp: +${MY_PHONE_NUMBER}`}
          onClick={() => window.open(whatsappUrl, "_blank")}
        >
          <FaWhatsapp size={30} />
        </button>

        
      </div>

      {/* Main Content */}
      <div className="container mx-auto">
        <Navbar />
        <Ticker />
        <div className="p-4 max-w-6xl mx-auto">
          <Outlet />
        </div>        
        <FooterTrust />
        <Footer />
      </div>
    </>
  );
}
