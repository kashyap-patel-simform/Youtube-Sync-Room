import { getClientId } from "../lib/client-id";
import { cn } from "../lib/cn";
import { useRoomStore } from "../store/useRoomStore";
import { Avatar } from "./Avatar";
import { Badge } from "./Badge";

interface ParticipantListProps {
  className?: string;
}

export function ParticipantList({ className }: Readonly<ParticipantListProps>) {
  const participants = useRoomStore((state) => state.participants);

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-fg-subtle">
          Participants
        </span>
      </div>

      <div className="flex flex-col gap-0.5">
        {participants?.map((p) => (
          <div
            key={p.id}
            className={cn(
              "flex items-center gap-3 px-2 py-2 rounded-xl transition-colors",
            )}
          >
            <Avatar name={p.userName} size="sm" isHost={p.isHost} />
            <div className="flex-1 min-w-0">
              <p className={cn("text-sm font-medium truncate")}>
                {p.userId === getClientId() ? "You" : p.userName}
              </p>
            </div>
            {p.isHost && <Badge variant="host">Host</Badge>}
          </div>
        ))}
      </div>
    </div>
  );
}
