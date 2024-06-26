import { GearIcon } from "@radix-ui/react-icons";
import { useAppContext } from "~/store";

export default function Login() {
  const { setActivePage, settings } = useAppContext();

  const handleOpenSettings = () => {
    setActivePage("settings");
  };

  return (
    <div className="flex items-center gap-4 border-t bg-black/10 p-4">
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col gap-y-1">
          {settings.npub ? (
            <p className="text-xs font-medium leading-none text-muted-foreground">
              {settings.npub.slice(0, 8)}...
            </p>
          ) : (
            <p className="text-xs font-medium leading-none text-muted-foreground">
              Login
            </p>
          )}
          <p className="text-xs text-muted-foreground/90">logged in</p>
        </div>
        <GearIcon
          onClick={handleOpenSettings}
          className="h-5 w-5 cursor-pointer text-muted-foreground hover:text-foreground"
        />
      </div>
    </div>
  );
}
