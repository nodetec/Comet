import { useEffect, useState } from "react";

import * as wails from "@wailsio/runtime";
import { Events } from "@wailsio/runtime";
import { WailsEvent } from "@wailsio/runtime/types/events";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Settings2 } from "lucide-react";

import AllNotes from "./AllNotes";
import { NotebookComboBox } from "./NotebookComboBox";
import Tags from "./Tags";
import Trash from "./Trash";

export default function Sidebar() {
  const [settingsWindowClosed, setSettingsWindowClosed] = useState(true);

  useEffect(() => {
    const handleSettingsWindowClose = (_: WailsEvent) => {
      setSettingsWindowClosed(true);
    };

    Events.On("settingsWindowClosed", handleSettingsWindowClose);

    return () => {
      Events.Off("settingsWindowClosed");
    };
  }, []);

  const handleOpenSettings = () => {
    wails.Events.Emit({ name: "openSettingsWindow", data: "" });
    setSettingsWindowClosed(false);
  };

  return (
    <div className="flex h-full flex-col justify-between pt-4">
      <div className="flex justify-end gap-x-4 pb-4 pr-4">
        <div className="flex justify-end">
          {/* <CloudOffIcon */}
          {/*   // onClick={handleCreateNotebook} */}
          {/*   className="h-5 w-5 cursor-pointer text-muted-foreground hover:text-foreground" */}
          {/* /> */}
        </div>
        <div className="flex justify-end">
          <Settings2
            onClick={handleOpenSettings}
            className={`h-5 w-5 cursor-pointer text-muted-foreground hover:text-foreground ${settingsWindowClosed ? "" : "pointer-events-none opacity-50"}`}
          />
        </div>
      </div>
      <ScrollArea className="flex h-full flex-col gap-y-2">
        <div className="flex flex-col gap-y-2 px-3">
          <AllNotes />
          <NotebookComboBox />
          <Trash />
          <Tags />
        </div>
      </ScrollArea>
      {/* <Login /> */}
    </div>
  );
}
