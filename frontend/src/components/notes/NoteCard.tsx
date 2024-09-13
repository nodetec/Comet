import { Note } from "&/github.com/nodetec/captains-log/db/models";
import { cn, fromNow } from "~/lib/utils";
import { useAppState } from "~/store";

import { Separator } from "../ui/separator";
import NoteCardPreview from "./NoteCardPreview";

type Props = {
  note: Note;
};

export default function NoteCard({ note }: Props) {
  const activeNote = useAppState((state) => state.activeNote);
  const setActiveNote = useAppState((state) => state.setActiveNote);

  function handleSetActiveNote(event: React.MouseEvent<HTMLDivElement>) {
    event.preventDefault();
    setActiveNote(note);
  }

  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    console.log("Right Clicked");
  };

  return (
    <div className="mx-3 flex w-full flex-col items-center">
      <button
        className={cn(
          "flex w-full cursor-default flex-col items-start gap-2 rounded-md p-2.5 text-left text-sm transition-all",
          activeNote?.ID === note.ID && "bg-muted/70",
        )}
      >
        <div
          className="flex w-full flex-col gap-1"
          onContextMenu={handleContextMenu}
          onClick={handleSetActiveNote}
          style={
            {
              "--custom-contextmenu": "noteMenu",
              "--custom-contextmenu-data": `${note.ID}`,
            } as React.CSSProperties
          }
        >
          <div className="flex w-full flex-col gap-1.5">
            <h2 className="line-clamp-1 select-none truncate text-ellipsis whitespace-break-spaces break-all font-semibold text-primary">
              {note.Title}
            </h2>
            <div className="mt-0 line-clamp-2 text-ellipsis whitespace-break-spaces break-all pt-0 text-muted-foreground">
              <NoteCardPreview note={note} />
            </div>
            <span className="select-none text-xs text-muted-foreground/80">
              {note.ModifiedAt && fromNow(note.ModifiedAt)}
            </span>
          </div>
        </div>
      </button>
      <div className="flex w-full flex-col items-center px-[0.30rem]">
        <Separator decorative className="bg-border/30" />
      </div>
    </div>
  );
}
