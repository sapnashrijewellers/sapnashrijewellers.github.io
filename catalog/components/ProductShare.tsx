"use client";
import NativeShare from "@/components/NativeShare";
import { Product } from "@/types/catalog"
import {
  FaWhatsapp,
  FaTelegramPlane,
  FaSnapchatGhost,
  FaInstagram,
} from "react-icons/fa";


export default function ProductShare({ product }: { product: Product }) {
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
    const baseProductUrl = `${baseURL}/product/${product.slug}`;
    const encodedUrl = (baseProductUrl);
    const encodedText = (`Check out this product: ${product.name}`);
    const whatsappShare = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
    const telegramShare = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
    const snapchatShare = `https://www.snapchat.com/scan?attachmentUrl=${encodedUrl}`;
    const instagramShare = `https://www.instagram.com/?url=${encodedUrl}`;

    return (<div className="pt-4 mt-4">
        <h2 className="text-lg  mb-3">Share this product</h2>
        <div className="flex gap-5 items-center flex-wrap">
            <a
                href={whatsappShare}
                target="_blank"
                rel="noopener noreferrer"
                className="text-3xl !text-green-500 hover:scale-110 transition-transform"
            >
                <FaWhatsapp />
            </a>
            <a
                href={telegramShare}
                target="_blank"
                rel="noopener noreferrer"
                className="text-3xl !text-sky-500 hover:scale-110 transition-transform"
            >
                <FaTelegramPlane />
            </a>
            <a
                href={snapchatShare}
                target="_blank"
                rel="noopener noreferrer"
                className="text-3xl !text-yellow-400 hover:scale-110 transition-transform"
            >
                <FaSnapchatGhost />
            </a>
            <a
                href={instagramShare}
                target="_blank"
                rel="noopener noreferrer"
                className="text-3xl !text-pink-500 hover:scale-110 transition-transform"
            >
                <FaInstagram />
            </a>
            <NativeShare
                productName={product.name}
                productUrl={baseProductUrl}
                phone="8234042231" />
        </div>
    </div>
    );
}