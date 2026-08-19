"use client";

import { useState, useId, useMemo, useCallback } from "react";
import careData from "@/data/careInstructions.json";
import { AppIconMap } from "@/utils/appIcons";
import { Plus, Minus } from "lucide-react";
import { Sparkles } from "lucide-react";

interface CareInstructionItem {
  id: string | number;
  instructionType: string;
  instruction: string;
  iconKey: string;
}

interface CareInstructionsProps {
  careKey: string;
  className?: string;
}

export default function CareInstructions({
  careKey,
  className = "",
}: CareInstructionsProps) {
  const [open, setOpen] = useState(false);
  const sectionId = useId();
  const headingId = useId();

  const toggleOpen = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  // Filter instructions based on parsed care keys
  const instructions = useMemo(() => {
    if (!careKey) return [];
    const keys = new Set(
      careKey
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean)
    );
    return (careData as CareInstructionItem[]).filter((item) =>
      keys.has(item.instructionType)
    );
  }, [careKey]);

  if (instructions.length === 0) return null;

  return (
    <section
      aria-labelledby={headingId}
      className={`border border-theme/40 rounded-2xl bg-surface shadow-sm overflow-hidden transition-[box-shadow,border-color] duration-150 ease-out will-change-[box-shadow] ${className}`}
    >
      {/* Accordion Trigger Header */}
      <h2>
        <button
          id={headingId}
          type="button"
          onClick={toggleOpen}
          aria-expanded={open}
          aria-controls={sectionId}
          className="w-full flex items-center justify-between px-4 py-3.5 text-left text-foreground hover:bg-theme/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset transition-colors duration-150 cursor-pointer"
        >
          <span className="font-semibold text-base sm:text-lg text-foreground tracking-tight flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
            <span>देखभाल निर्देश (Care Instructions)</span>
          </span>

          <span
            className="p-1 rounded-lg text-primary bg-primary/10 transition-transform duration-150 will-change-transform"
            aria-hidden="true"
          >
            {open ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          </span>
        </button>
      </h2>

      {/* Screen Reader & LLM Machine-Readable Context */}
      <div className="sr-only">
        Jewellery maintenance and care instructions for longevity and shine.
      </div>

      {/* Collapsible Content */}
      <div
        id={sectionId}
        role="region"
        aria-labelledby={headingId}
        aria-hidden={!open}
        className={`
          px-4 transition-[opacity,transform] duration-150 ease-out will-change-[transform,opacity]
          ${
            open
              ? "pb-4 pt-1 opacity-100 scale-100 pointer-events-auto visible"
              : "opacity-0 scale-95 pointer-events-none hidden"
          }
        `}
      >
        <ul className="space-y-3 pt-1">
          {instructions.map((item) => {
            const IconComponent = AppIconMap[item.iconKey];

            return (
              <li key={item.id} className="flex items-start gap-3 text-sm text-foreground/90">
                {IconComponent ? (
                  <IconComponent
                    className="w-5 h-5 text-primary mt-0.5 shrink-0"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                ) : (
                  <div
                    className="w-5 h-5 mt-0.5 shrink-0 bg-muted rounded-full flex items-center justify-center text-[10px] text-muted-foreground"
                    aria-hidden="true"
                  >
                    •
                  </div>
                )}

                <span className="leading-relaxed font-normal">
                  {item.instruction}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}