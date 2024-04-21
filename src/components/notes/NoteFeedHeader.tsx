import { useQueryClient } from "@tanstack/react-query";
import { createNote } from "~/api";
import { useGetCachedQueryData } from "~/hooks/useGetCachedQueryData";
import { useGlobalState } from "~/store";
import { type CreateNoteRequest, type Note } from "~/types";
import { ArrowDownNarrowWide, PenBoxIcon } from "lucide-react";

import { Button } from "../ui/button";

export default function NoteFeedHeader() {
  const queryClient = useQueryClient();

  const { appContext, setAppContext } = useGlobalState();
  const data = useGetCachedQueryData("notes") as Note[];

  async function handleNewNote(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) {
    e.preventDefault();
    const createNoteRequest: CreateNoteRequest = {
      content: "",
    };

    const response = await createNote(createNoteRequest);

    if (response.error) {
      console.error(response.error);
    }

    const newNote = response.data;

    if (!newNote) {
      console.error("Failed to create note");
    }

    await queryClient.invalidateQueries({ queryKey: ["notes"] });
    setAppContext({
      ...appContext,
      currentNote: newNote,
    });
  }

  const getHeaderTitle = () => {
    if (appContext.activeTag) {
      return appContext.activeTag.name;
    }

    if (appContext.filter === "all") {
      return "All Notes";
    }

    if (appContext.filter === "trashed") {
      return "Trash";
    }
  };

  return (
    <div className="flex justify-between px-3 pt-2">
      <div className="flex items-center justify-center gap-x-1">
        <Button
          disabled={data?.[0] && data[0].id === -1}
          className="text-muted-foreground"
          onClick={handleNewNote}
          variant="ghost"
          size="icon"
        >
          <ArrowDownNarrowWide className="h-[1.2rem] w-[1.2rem]" />
        </Button>
        <h1 className="cursor-default text-lg font-bold">{getHeaderTitle()}</h1>
      </div>
      <div>
        <Button
          disabled={data?.[0] && data[0].id === -1}
          className="text-muted-foreground"
          onClick={handleNewNote}
          variant="ghost"
          size="icon"
        >
          <PenBoxIcon className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </div>
    </div>
  );
}
