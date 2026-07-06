import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { IconLink, IconUser, IconArrowRight } from "../ui/icons";
import { useCreateRoom } from "../hooks/useCreateRoom";

export function HostForm() {
  const {
    videoUrl,
    roomName,
    userName,
    urlError,
    userNameError,
    creating,
    handleVideoUrlChange,
    handleUserNameChange,
    setRoomName,
    handleCreate,
  } = useCreateRoom();

  return (
    <div className="space-y-4">
      <Input
        label="Your name"
        placeholder="e.g. Alex Chen"
        value={userName}
        onChange={(e) => handleUserNameChange(e.target.value)}
        icon={<IconUser />}
        error={userNameError}
      />
      <Input
        label="YouTube URL"
        placeholder="https://youtube.com/watch?v=…"
        value={videoUrl}
        onChange={(e) => handleVideoUrlChange(e.target.value)}
        icon={<IconLink />}
        error={urlError}
      />
      <Input
        label="Room name (optional)"
        placeholder="e.g. React Hooks Deep Dive"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
      />
      <Button
        variant="primary"
        size="lg"
        loading={creating}
        onClick={handleCreate}
        className="w-full"
        iconRight={!creating && <IconArrowRight />}
      >
        Start room
      </Button>
    </div>
  );
}
