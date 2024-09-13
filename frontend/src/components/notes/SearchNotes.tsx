import { useAppState } from "~/store";

import { Input } from "../ui/input";

export default function SearchNotes() {
  const noteSearch = useAppState((state) => state.noteSearch);
  const setNoteSearch = useAppState((state) => state.setNoteSearch);
  const setSearchActive = useAppState((state) => state.setSearchActive);

  function handleSetSearchNote(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value === "") {
      setNoteSearch("");
      setSearchActive(false);
      return;
    }
    setSearchActive(true);
    setNoteSearch(e.target.value);
  }

  return (
    <div className="flex items-center px-3 pb-4 pt-2">
      <Input
        placeholder="Search..."
        className="h-8 text-muted-foreground/80 placeholder:text-muted-foreground/60 focus-visible:ring-primary"
        onChange={handleSetSearchNote}
        value={noteSearch}
      />
    </div>
  );
}
