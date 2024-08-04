// import { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { TagService } from "&/github.com/nodetec/captains-log/service";
// import { Button } from "~/components/ui/button";
import { useAppState } from "~/store";
// import { Eye } from "lucide-react";

// import Editor from "./Editor";
import { EditorHeader } from "./EditorHeader";
import { LexEditor } from "./LexEditor";
// import { PostButton } from "./PostButton";
// import Preview from "./Preview";
import ReadOnlyTagList from "./ReadOnlyTagList";
import TagInput from "./TagInput";
// import Editor from "./Editor";

export const EditorWrapper = () => {
  const { activeNote, activeTrashNote, feedType } = useAppState();
  // const [showPreview, setShowPreview] = useState(false);

  // TODO
  // Where should the errors and loading be taken care of?
  async function fetchTags() {
    const tags = await TagService.ListTags();
    return tags;
  }

  const { data } = useQuery({
    queryKey: ["tags"],
    queryFn: () => fetchTags(),
  });

  if (
    activeNote === undefined &&
    (feedType === "all" || feedType === "notebook")
  ) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-lg text-muted-foreground">
          Something about notes...
        </p>
      </div>
    );
  }

  if (activeTrashNote === undefined && feedType === "trash") {
    return null;
  }

  return (
    <div className="flex h-full flex-col">
      <EditorHeader />
      <LexEditor />
      <div className="flex items-center justify-between mt-1">
        {feedType === "trash"
          ? activeTrashNote && <ReadOnlyTagList trashNote={activeTrashNote} />
          : data && activeNote && <TagInput note={activeNote} tags={data} />}
      </div>
    </div>
  );
};

export default EditorWrapper;
