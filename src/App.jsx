// src/App.jsx
import React, { useState } from 'react';
import { DataProvider } from "./context/DataContext";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Category from "./pages/Category";
import ProductDetail from "./pages/ProductDetail";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import QrCodeModal from './components/QrCodeModal'
import Calculator from './pages/Calculator.jsx'
import { FaQrcode, FaWhatsapp } from "react-icons/fa";
export default function App() {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const MY_PHONE_NUMBER = '917999215256';
  const QR_IMAGE_URL = "/images/qr/qr.jpeg";
  const whatsappUrl = `https://wa.me/${MY_PHONE_NUMBER}?text=Hello!%20I%20have%20a%20question%20about%20your%20service.`;

  return (


    <DataProvider>
      <div className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 z-50 flex flex-col items-end space-y-3">
        {/* 1. QR Trigger Button: Uses state manager's click handler */}
        <button
          onClick={() => setIsModalOpen(true)}
          class={`p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 items-center justify-center bg-indigo-500 hover:bg-indigo-600 text-white`}
          title="Open QR Code To Make Payment">
          <FaQrcode size={28} />
        </button>

        <button
          className={`p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 items-center justify-center bg-indigo-500 hover:bg-indigo-600 text-white`}
          title={`Chat on WhatsApp: +${MY_PHONE_NUMBER}`}
          onClick={() => window.open(whatsappUrl, "_blank")} >
          <FaWhatsapp size={30} />
        </button>

        

        {/* Conditionally render the QR Code Modal */}
        {isModalOpen && (
          <QrCodeModal
            qrImageUrl={QR_IMAGE_URL}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>

      <div className="container mx-auto">
        <Navbar />
        <div className="p-4 max-w-6xl mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:category" element={<Category />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/calculator" element={<Calculator />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </DataProvider>
  );
}
