import { useRef } from "react";
import type { KeyboardEvent, ClipboardEvent, ChangeEvent } from "react";
import { cn } from "../lib/cn";

interface CodeInputProps {
  value: string;
  onChange: (code: string) => void;
  length?: number;
}

export function CodeInput({ value, onChange, length = 6 }: CodeInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const chars = value.padEnd(length, "").split("").slice(0, length);

  const handleChange =
    (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^A-Z0-9]/gi, "");
      const char = raw.slice(-1);
      if (char === "" && e.target.value !== "") return;

      const next = [...chars];
      next[index] = char;
      onChange(next.join("").replace(/\s+$/, ""));

      if (char && index < length - 1) {
        refs.current[index + 1]?.focus();
      }
    };

  const handleKeyDown =
    (index: number) => (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !chars[index] && index > 0) {
        const next = [...chars];
        next[index - 1] = "";
        onChange(next.join("").replace(/\s+$/, ""));
        refs.current[index - 1]?.focus();
      }
    };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/[^A-Z0-9]/gi, "")
      .slice(0, length);
    onChange(pasted);
    const focusIdx = Math.min(pasted.length, length - 1);
    refs.current[focusIdx]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="text"
          inputMode="text"
          maxLength={1}
          value={chars[i]?.trim() || ""}
          onChange={handleChange(i)}
          onKeyDown={handleKeyDown(i)}
          onPaste={handlePaste}
          aria-label={`Room code character ${i + 1}`}
          className={cn(
            "w-11 h-14 text-center text-xl rounded-xl border-2 bg-surface transition-all duration-150",
            "focus:outline-none select-none",
            "font-mono font-semibold",
            chars[i]?.trim()
              ? "border-teal text-teal shadow-[0_0_14px_rgba(45,212,191,0.2)]"
              : "border-border text-fg focus:border-teal/50 focus:shadow-[0_0_14px_rgba(45,212,191,0.1)]",
          )}
        />
      ))}
    </div>
  );
}
