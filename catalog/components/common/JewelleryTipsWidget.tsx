"use client";

import { useEffect, useState } from "react";
import { X, Gem, Search, Scale, Percent, ShieldCheck } from "lucide-react";
import { getWithExpiry, setWithExpiry } from "./TipsKeyStorage";
import { motion } from "framer-motion";

const STORAGE_KEY = "jewellery_tips_dismissed";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onOpen: () => void;
};

export default function JewelleryTipsWidget({
    isOpen,
    onClose,
    onOpen,
}: Props) {
    const [showTeaser, setShowTeaser] = useState(false);
    const [shakeTick, setShakeTick] = useState(0);

    useEffect(() => {
        if (!showTeaser || isOpen) return;

        const interval = setInterval(() => {
            setShakeTick((t) => t + 1);
        }, 10000); // 10 seconds

        return () => clearInterval(interval);
    }, [showTeaser, isOpen]);

    useEffect(() => {
        const dismissed = getWithExpiry<boolean>(STORAGE_KEY);
        if (!dismissed) {
            setShowTeaser(true);
        }
    }, []);

    const dismissTeaser = () => {
        setShowTeaser(false);
        setWithExpiry(STORAGE_KEY, true); // defaults to 24h
    };

    return (
        <>
            {/* Teaser chip */}
            {showTeaser && !isOpen && (
                <motion.div
                    key={shakeTick} // <-- important
                    initial={{ x: 0 }}
                    animate={{ x: [0, -4, 4, -3, 3, 0] }}
                    transition={{
                        duration: 0.5,
                        ease: "easeInOut",
                    }}
                    className="fixed bottom-15 left-4 z-40 bg-accent shadow-lg rounded-full px-4 py-2 flex items-center gap-2"
                >
                    <Gem className="w-4 h-4 text-yellow-500" />
                    <button
                        onClick={onOpen}
                        className="cursor-pointer text-sm font-medium hover:underline"
                    >
                        Jewellery Buying Tips
                    </button>
                    <button onClick={dismissTeaser}>
                        <X className="w-4 h-4" />
                    </button>
                </motion.div>
            )}

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="relative bg-surface rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
                        <button 
                            onClick={onClose}
                            className="ssj-btn absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* ---- CONTENT ---- */}
                        <section className="space-y-6">
                            <h2 className="text-xl md:text-2xl font-bold text-center">
                                सोना खरीदने से पहले इन 3 बातों का विशेष ध्यान रखें
                            </h2>

                            <Tip
                                icon={<Search />}
                                title="1. BIS HUID हॉलमार्किंग है अनिवार्य"
                                text="2 ग्राम या उससे अधिक वजन की ज्वेलरी पर हमेशा BIS मान्यता प्राप्त 6 अंकों वाला HUID कोड जांचें। यह शुद्धता की गारंटी है।"
                            />

                            <Tip
                                icon={<Scale />}
                                title="2. सही कैरेट का सही दाम"
                                text="22 कैरेट आभूषण के लिए सिर्फ 22 कैरेट का भाव चुकाएं। 24 कैरेट (शुद्ध सोना) का रेट अलग होता है।"
                            />

                            <Tip
                                icon={<Percent />}
                                title="3. मेकिंग चार्ज (बनवाई) जानें"
                                text="खरीदारी करते समय हमेशा पूछें कि आभूषण पर कितने प्रतिशत (%) मेकिंग चार्ज लग रहा है। पारदर्शी रहें।"
                            />

                            <Tip
                                icon={<ShieldCheck className="text-green-500" />}
                                title="सपना श्री ज्वेलर्स का वादा: विश्वास और बचत"
                                text="हम इन तीनों पैमानों पर खरे उतरते हैं। HUID हॉलमार्क ज्वेलरी और मेकिंग चार्ज मात्र 3.5% से शुरू।"
                            />
                        </section>
                    </div>
                </div>
            )}
        </>
    );
}

function Tip({
    icon,
    title,
    text,
}: {
    icon: React.ReactNode;
    title: string;
    text: string;
}) {
    return (
        <div className="flex flex-col md:flex-row gap-4 bg-accent p-4 rounded-lg">
            <div className="w-12 h-12 flex items-center justify-center text-yellow-500">
                {icon}
            </div>
            <div>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm mt-1">{text}</p>
            </div>
        </div>
    );
}
