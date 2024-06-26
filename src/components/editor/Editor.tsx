import { useQueryClient } from "@tanstack/react-query";
import { updateNote } from "~/api";
import { useCM6Editor } from "~/hooks/useCM6Editor";
import { useAppContext } from "~/store";
import { type InfiniteQueryData, type Note } from "~/types";

export const Editor = () => {
  const { currentNote, setCurrentNote, currentTrashedNote } = useAppContext();

  const queryClient = useQueryClient();
  const data = queryClient.getQueryData([
    "notes",
    { search: false },
  ]) as InfiniteQueryData<Note>;

  const onChange = (doc: string) => {
    if (!currentNote) return;
    setCurrentNote({ ...currentNote, content: doc });
    if (!data) return;
    if (!data.pages) return;
    const notes = data.pages[0].data;
    if (!notes) return;
    const firstNote = notes[0];
    if (!firstNote) return;
    if (firstNote.id === currentNote.id) return;

    void updateNote({ id: currentNote.id, content: doc });

    void queryClient.invalidateQueries({
      queryKey: [
        "notes",
        {
          search: false,
        },
      ],
    });
  };

  const { editorRef } = useCM6Editor({
    initialDoc: currentNote?.content ?? currentTrashedNote?.content ?? "",
    onChange,
  });

  return (
    <div
      className="editor-container h-full w-full overflow-y-auto"
      ref={editorRef}
    />
  );
};

export default Editor;
