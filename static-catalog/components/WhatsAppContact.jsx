import React from "react";
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppContact({phone = "8234042231" }) {
  

  return (
    <div className="flex items-center gap-3 mt-3 bg-accent border  rounded-xl p-2 transition">
      <FaWhatsapp
        className="text-[4vw] text-green-500 hover:text-green-600 cursor-pointer transition-transform transform hover:scale-110"        
      />
        <span          
          className=" text-3xl text-green-600 font-semibold hover:underline"
        >
          {phone}
        </span>              
    </div>
  );
}
