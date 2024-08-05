import { CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
// import {
//   //   // $convertFromMarkdownString,
//   //   // $convertToMarkdownString,
//   TRANSFORMERS,
// } from "@lexical/markdown";
// import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
// import { ClickableLinkPlugin } from "@lexical/react/LexicalClickableLinkPlugin";
import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
// import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
// import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
// import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";

import { getTheme } from "./lib/theme";
import { LexicalAutoLinkPlugin } from "./plugins/AutoLinkPlugin";
import { LinkPlugin } from "./plugins/LinkPlugin";
import TreeViewPlugin from "./plugins/TreeViewPlugin";
import ClickableLinkPlugin from "./plugins/ClickableLink";

function onError(error: any) {
  console.error(error);
}

// const URL_MATCHER =
//   /((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

// const MATCHERS = [
//   (text) => {
//     const match = URL_MATCHER.exec(text);
//     if (match === null) {
//       return null;
//     }
//     const fullMatch = match[0];
//     return {
//       index: match.index,
//       length: fullMatch.length,
//       text: fullMatch,
//       url: fullMatch.startsWith("http") ? fullMatch : `https://${fullMatch}`,
//       attributes: { rel: "noreferrer", target: "_blank" }, // Optional link attributes
//     };
//   },
// ];

export function Editor() {
  // const [editor] = useLexicalComposerContext();
  //
  // const linkAttributes = {
  //   target: "_blank",
  //   rel: "noopener noreferrer",
  // };
  //
  // editor.dispatchCommand(TOGGLE_LINK_COMMAND, {
  //   url: "https://",
  //   ...linkAttributes,
  // });

  const initialConfig: InitialConfigType = {
    namespace: "MyEditor",
    theme: getTheme("dark"),
    nodes: [
      HorizontalRuleNode,
      //   // BannerNode,
      HeadingNode,
      //   // ImageNode,
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
    <LexicalComposer initialConfig={initialConfig}>
      <LexicalAutoLinkPlugin />
      <LinkPlugin />
      <div className="flex">
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="h-full w-full overflow-auto border border-red-500 px-4 focus:outline-none" />
          }
          // placeholder={<div>Enter some text...</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <TreeViewPlugin />
      </div>

      <ClickableLinkPlugin />
      {/* <MarkdownShortcutPlugin transformers={TRANSFORMERS} /> */}
      {/* <HistoryPlugin /> */}
      {/* <AutoFocusPlugin /> */}
    </LexicalComposer>
  );
}
