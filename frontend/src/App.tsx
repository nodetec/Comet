import { $convertToMarkdownString, TRANSFORMERS } from "@lexical/markdown";
import { QueryKey, useQueryClient } from "@tanstack/react-query";
import { Note } from "&/github.com/nodetec/captains-log/db/models";
import { NoteService } from "&/github.com/nodetec/captains-log/service";
import Sidebar from "~/components/sidebar/Sidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable";
import { EditorState } from "lexical";

import Notes from "./components/notes/Notes";
import { Editor } from "./features/editor";
import useNoteMenu from "./hooks/useNoteMenu";
import useNoteTagMenu from "./hooks/useNoteTagMenu";
import useSettingsRefresh from "./hooks/useSettingsRefresh";
import useTagMenu from "./hooks/useTagMenu";
import useTrashNoteMenu from "./hooks/useTrashNoteMenu";
import { parseTitle } from "./lib/markdown";
import { useAppState } from "./store";
import { InfiniteQueryData } from "./types";

// import "./lib/prismstuff";

export default function App() {
  useNoteMenu();
  useTagMenu();
  useNoteTagMenu();
  useTrashNoteMenu();
  useSettingsRefresh();

  const { activeNote, setActiveNote } = useAppState();

  const queryClient = useQueryClient();

  const onChange = (editorState: EditorState) => {
    editorState.read(() => {
      const markdown = $convertToMarkdownString(TRANSFORMERS);
      // const markdown = "";
      // console.log(markdown);
      //       const data = queryClient.getQueriesData(
      // { queryKey: ['notes']}
      //       )[1] as InfiniteQueryData<Note>;
      let data: [QueryKey, InfiniteQueryData<Note>][] = queryClient.getQueriesData({ queryKey: ["notes"] });

      console.log("data 1", data[0][1]);
      console.log( typeof data);
      // data = data[0][1];
      if (!activeNote) return;
      console.log("1");
      setActiveNote({ ...activeNote, Content: markdown });
      if (!data) return;
      console.log("2");
      if (!data[0][1].pages) return;
      console.log("3");
      // get all of the notes from the first page
      const notes = data[0][1].pages[0].data;
      console.log(notes);
      // if there are no notes, return
      if (!notes) return;
      console.log("4");
      // get the first note
      const firstNote = notes[0];
      // if there is no first note, return
      if (!firstNote) return;
      console.log("5");
      // if the first note is the active note, return
      if (firstNote.ID === activeNote.ID) return;
      console.log("6");

      console.log("updating note");

      void NoteService.UpdateNote(
        activeNote.ID,
        parseTitle(markdown),
        markdown,
        activeNote.NotebookID,
        activeNote.StatusID,
        // TODO: rethink published indicator
        false,
        activeNote.EventID,

        activeNote.Pinned,
        activeNote.Notetype,
        activeNote.Filetype,
      );

      void queryClient.invalidateQueries({
        queryKey: ["notes"],
      });
    });
  };

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
        <ResizablePanel className="mt-12" minSize={40}>
          <Editor onChange={onChange} id={activeNote.ID.toString()} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
