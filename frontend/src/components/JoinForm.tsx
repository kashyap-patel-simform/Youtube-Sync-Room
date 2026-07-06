import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { CodeInput } from "../ui/CodeInput";
import { IconUser } from "../ui/icons";
import { useJoinRoom } from "../hooks/useJoinRoom";

export function JoinForm() {
  const {
    joinCode,
    setJoinCode,
    userName,
    setUserName,
    joining,
    canJoin,
    handleJoin,
  } = useJoinRoom();

  return (
    <div className="space-y-4">
      <Input
        label="Your name"
        placeholder="e.g. Sarah Miller"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        icon={<IconUser />}
      />
      <div className="space-y-1.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          Room code
        </span>
        <CodeInput value={joinCode} onChange={setJoinCode} length={6} />
      </div>
      <Button
        variant="teal"
        size="lg"
        loading={joining}
        disabled={!canJoin}
        onClick={handleJoin}
        className="w-full"
      >
        Join room
      </Button>
    </div>
  );
}
