// import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";

import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
// import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";

// import Prism from "prismjs";
import "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-c";
import "prismjs/components/prism-css";
import "prismjs/components/prism-objectivec";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-python";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-swift";

// import { $getRoot, $getSelection } from "lexical";
// import ToolbarPlugin from "./plugins/ToolbarPlugin";
// import TreeViewPlugin from "./plugins/TreeViewPlugin";
import { CodeNode } from "@lexical/code";
import {
  // $convertFromMarkdownString,
  // $convertToMarkdownString,
  TRANSFORMERS,
} from "@lexical/markdown";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import ExampleTheme from "./ExampleTheme";

// import { HeadingNode, QuoteNode } from "@lexical/rich-text";

// const theme = {
//   // Theme styling goes here
//   //...
// };

const theme = ExampleTheme;


// Prism.highlightAll();

// editor.update(() => {
//   const markdown = $convertToMarkdownString(TRANSFORMERS);
//   ...
// });
//
// editor.update(() => {
//   $convertFromMarkdownString(markdown, TRANSFORMERS);
// });

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error) {
  console.error(error);
}

export function LexEditor() {
  const initialConfig: InitialConfigType = {
    namespace: "MyEditor",
    theme,
    onError,
    nodes: [
      HorizontalRuleNode,
      // BannerNode,
      HeadingNode,
      // ImageNode,
      QuoteNode,
      CodeNode,
      ListNode,
      ListItemNode,
      LinkNode,
    ],
    // editorState: () => $convertFromMarkdownString(markdown, TRANSFORMERS)
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      {/* <ToolbarPlugin /> */}
      <RichTextPlugin
        contentEditable={
          <ContentEditable
            // placeholder="Enter some text..."
            className="h-full w-full overflow-auto border-red-500 px-4 focus:outline-none"
          />
        }
        // placeholder={<div>Enter some text...</div>}

        ErrorBoundary={LexicalErrorBoundary}
      />
      <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
      {/* <MarkdownShortcutPlugin /> */}
      {/* <HistoryPlugin /> */}
      {/* <AutoFocusPlugin /> */}
      {/* <TreeViewPlugin /> */}
    </LexicalComposer>
  );
}
