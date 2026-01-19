"use client";

import { useState } from "react";
import careData from "@/data/careInstructions.json";
import { AppIconMap } from "@/utils/appIcons";
import { FaPlus, FaMinus } from "react-icons/fa";

type Props = {
    careKey: string;
};

export default function CareInstructions({ careKey }: Props) {
    const [open, setOpen] = useState(false);
    const careKeys = careKey.split(",").map(key => key.trim());

    const instructions = careData.filter(item =>
        careKeys.includes(item.instructionType)
    );

    if (instructions.length === 0) return null;

    return (
        <div className="mt-6 border border-theme rounded-lg bg-surface">
            {/* Header */}
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-4 py-3"
                aria-expanded={open}
            >
                <span className="font-semibold text-lg text-primary-dark">
                    Care Instructions
                </span>


                <span className="">
                    {open ? <FaMinus /> : <FaPlus />}
                </span>

            </button>

            {/* Content */}
            {open && (
                <ul className="px-4 pb-4 space-y-3">
                    {instructions.map((item) => {
                        // 1. Lookup the component from the map
                        const IconComponent = AppIconMap[item.iconKey];

                        return (
                            <li key={item.id} className="flex items-start gap-3">
                                {/* 2. Render the component only if it exists */}
                                {IconComponent ? (
                                    <IconComponent
                                        className="w-5 h-5 text-primary mt-0.5 shrink-0"
                                        strokeWidth={1.5} // Optional: Adjust for a more premium jewelry feel
                                    />
                                ) : (
                                    /* 3. Fallback: Render a default icon or a spacer so the text doesn't shift */
                                    <div className="w-5 h-5 mt-0.5 shrink-0 bg-muted rounded-full" />
                                )}

                                <span className="text-sm text-normal leading-relaxed">
                                    {item.instruction}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
