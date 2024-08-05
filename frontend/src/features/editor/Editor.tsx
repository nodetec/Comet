import { CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import {
  $convertFromMarkdownString,
  //   // $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS,
} from "@lexical/markdown";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
// import { ClickableLinkPlugin } from "@lexical/react/LexicalClickableLinkPlugin";
import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { useQueryClient } from "@tanstack/react-query";
import { Note } from "&/github.com/nodetec/captains-log/db/models";
import { NoteService } from "&/github.com/nodetec/captains-log/service";
import { parseTitle } from "~/lib/markdown";
import { useAppState } from "~/store";
import { InfiniteQueryData } from "~/types";
import { EditorState } from "lexical";

import { getTheme } from "./lib/theme";
import { LexicalAutoLinkPlugin } from "./plugins/AutoLinkPlugin";
import ClickableLinkPlugin from "./plugins/ClickableLink";
import { LinkPlugin } from "./plugins/LinkPlugin";
import TreeViewPlugin from "./plugins/TreeViewPlugin";

function onError(error: any) {
  console.error(error);
}

export function Editor() {
  // const { activeNote, activeTrashNote, feedType } = useAppState();

  const { activeNote, setActiveNote } = useAppState();

  const initialConfig: InitialConfigType = {
    namespace: "MyEditor",
    theme: getTheme("dark"),
    editorState: () =>
      $convertFromMarkdownString(activeNote.Content ?? "", TRANSFORMERS),
    nodes: [
      HorizontalRuleNode,
      //   // BannerNode,
      HeadingNode,
        // ImageNode,
      QuoteNode,
      CodeNode,
      ListNode,
      ListItemNode,
      LinkNode,
      AutoLinkNode,
    ],
    onError,
  };

  const queryClient = useQueryClient();

  const onChange = (editorState: EditorState) => {

    console.log("onChange");
    console.log(editorState);

    const doc = $convertToMarkdownString(TRANSFORMERS);
    console.log(doc);
    const data = queryClient.getQueryData(["notes"]) as InfiniteQueryData<Note>;
    if (!activeNote) return;
    setActiveNote({ ...activeNote, Content: doc });
    if (!data) return;
    if (!data.pages) return;
    // get all of the notes from the first page
    const notes = data.pages[0].data;
    // if there are no notes, return
    if (!notes) return;
    // get the first note
    const firstNote = notes[0];
    // if there is no first note, return
    if (!firstNote) return;
    // if the first note is the active note, return
    if (firstNote.ID === activeNote.ID) return;

    void NoteService.UpdateNote(
      activeNote.ID,
      parseTitle(doc),
      doc,
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
  };

  return (
    <LexicalComposer key={activeNote.ID} initialConfig={initialConfig}>
      <LexicalAutoLinkPlugin />
      <LinkPlugin />

      <div className="flex flex-col">
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="mt-32 h-full min-h-80 w-full overflow-auto border border-red-500 px-4 focus:outline-none" />
          }
          // placeholder={<div>Enter some text...</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <TreeViewPlugin />
      </div>
      <OnChangePlugin onChange={onChange} />

      <ClickableLinkPlugin />
      <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
      <HistoryPlugin />
      <AutoFocusPlugin />
    </LexicalComposer>
  );
}
