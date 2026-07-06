import { cn } from "../lib/cn";
import { AVATAR_GRADIENTS } from "../constants";

interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  isHost?: boolean;
  isOnline?: boolean;
  className?: string;
}

const sizeMap = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
};

function getGradient(name: string): [string, string] {
  const idx =
    ((name.codePointAt(0) ?? 0) + (name.codePointAt(1) ?? 0)) %
    AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[idx];
}

export function Avatar({
  name,
  size = "md",
  isHost,
  isOnline,
  className,
}: Readonly<AvatarProps>) {
  const initials = name.slice(0, 2);
  const [from, to] = getGradient(name);

  return (
    <div className={cn("relative shrink-0", className)}>
      <div
        className={cn(
          "rounded-full flex items-center justify-center font-bold text-white",
          sizeMap[size],
        )}
        style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      >
        {initials}
      </div>

      {isOnline !== undefined && (
        <span
          className={cn(
            "absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-canvas",
            isOnline ? "bg-online" : "bg-fg-subtle",
          )}
        />
      )}

      {isHost && (
        <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center rounded-full bg-amber border-2 border-canvas">
          <svg
            className="w-2 h-2 text-canvas"
            fill="currentColor"
            viewBox="0 0 8 8"
          >
            <path d="M4 0L5.2 2.6H8L5.8 4.2L6.6 7L4 5.5L1.4 7L2.2 4.2L0 2.6H2.8L4 0Z" />
          </svg>
        </span>
      )}
    </div>
  );
}
