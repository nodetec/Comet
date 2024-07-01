import Sidebar from "~/components/sidebar/Sidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable";

import Editor from "./components/editor/Editor";
import Notes from "./components/notes/Notes";
import useNoteMenu from "./hooks/useNoteMenu";
import useTagMenu from "./hooks/useTagMenu";
import useNoteTagMenu from "./hooks/useNoteTagMenu";
import useTrashNoteMenu from "./hooks/useTrashNoteMenu";

export default function App() {
  useNoteMenu();
  useTagMenu();
  useNoteTagMenu();
  useTrashNoteMenu();

  return (
    <div className="flex h-dvh w-dvw flex-col items-center justify-center">
      <ResizablePanelGroup direction="horizontal" className="h-full w-full">
        <ResizablePanel defaultSize={18} minSize={18}>
          <Sidebar />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={26} minSize={26}>
          <Notes />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel minSize={40}>
          <Editor />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
