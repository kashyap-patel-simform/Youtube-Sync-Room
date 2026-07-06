import { useState } from "react";
import { cn } from "../lib/cn";
import { IconPlay, IconUsers } from "../ui/icons";
import { HostForm } from "./HostForm";
import { JoinForm } from "./JoinForm";

type Tab = "host" | "join";

export function RoomEntryCard() {
  const [tab, setTab] = useState<Tab>("host");

  return (
    <div className="bg-surface rounded-2xl border border-border overflow-hidden">
      <div className="flex border-b border-border" role="tablist" aria-label="Room options">
        <button
          role="tab"
          id="tab-host"
          aria-selected={tab === "host"}
          aria-controls="panel-host"
          onClick={() => setTab("host")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-semibold transition-all border-b-2 -mb-px",
            tab === "host"
              ? "text-amber border-amber bg-amber/5"
              : "text-fg-muted border-transparent hover:text-fg hover:bg-surface-raised",
          )}
        >
          <IconPlay className="w-4 h-4 ml-0" aria-hidden="true" />
          <span>Host a room</span>
        </button>
        <button
          role="tab"
          id="tab-join"
          aria-selected={tab === "join"}
          aria-controls="panel-join"
          onClick={() => setTab("join")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-semibold transition-all border-b-2 -mb-px",
            tab === "join"
              ? "text-teal border-teal bg-teal/5"
              : "text-fg-muted border-transparent hover:text-fg hover:bg-surface-raised",
          )}
        >
          <IconUsers className="w-4 h-4" aria-hidden="true" />
          <span>Join a room</span>
        </button>
      </div>

      <div
        role="tabpanel"
        id={tab === "host" ? "panel-host" : "panel-join"}
        aria-labelledby={tab === "host" ? "tab-host" : "tab-join"}
        className="p-5 sm:p-6"
      >
        {tab === "host" ? <HostForm /> : <JoinForm />}
      </div>
    </div>
  );
}
