import { CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { $convertFromMarkdownString, TRANSFORMERS } from "@lexical/markdown";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { useAppState } from "~/store";
import { EditorState } from "lexical";

// import { getTheme } from "../lib/theme";
import { LexicalAutoLinkPlugin } from "../plugins/AutoLinkPlugin";
import { ClickableLinkPlugin } from "../plugins/ClickableLink";
import { LinkPlugin } from "../plugins/LinkPlugin";
// import TreeViewPlugin from "../plugins/TreeViewPlugin";

function onError(error: any) {
  console.error(error);
}

type Props = {
  onChange: (editorState: EditorState) => void;
  id?: string;
};

export function Editor({ onChange, id }: Props) {
  const { activeNote } = useAppState();

  const initialConfig: InitialConfigType = {
    namespace: "MyEditor",
    // theme: getTheme("dark"),
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

  return (
    <LexicalComposer key={id} initialConfig={initialConfig}>
      <LexicalAutoLinkPlugin />
      <LinkPlugin />

      {/* <div className="flex flex-col"> */}
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="h-full max-w-none prose dark:prose-invert caret-blue-400 selection:bg-blue-300/25 w-full overflow-auto px-12 pb-80 focus:outline-none" />
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        {/* <div className="overflow-auto"> */}
        {/*   <TreeViewPlugin /> */}
        {/* </div> */}
      {/* </div> */}
      <OnChangePlugin onChange={onChange} />

      <ClickableLinkPlugin />
      <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
      <HistoryPlugin />
      <AutoFocusPlugin />
    </LexicalComposer>
  );
}
