// src/App.jsx
import React, { useState } from 'react';
import { DataProvider } from "./context/DataContext";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Category from "./pages/Category";
import ProductDetail from "./pages/ProductDetail";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FloatingWhatsAppChatButton from './components/FloatingWhatsAppButton';
import FloatingQrCodeTriggerButton from './components/FloatingQRButton'
import QrCodeModal from './components/QrCodeModal'
import Calculator from './pages/Calculator.jsx'
export default function App() {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const MY_PHONE_NUMBER = '917999215256';
  const QR_IMAGE_URL = "/images/qr/qr.jpeg";


  return (


    <DataProvider>
      <div className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 z-50 flex flex-col items-end space-y-3">
        {/* 1. QR Trigger Button: Uses state manager's click handler */}
        <FloatingQrCodeTriggerButton
          onClick={() => setIsModalOpen(true)}
        />

        {/* 2. Chat Link Button: Self-contained link logic */}
        <FloatingWhatsAppChatButton
          phoneNumber={MY_PHONE_NUMBER}
        />

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
