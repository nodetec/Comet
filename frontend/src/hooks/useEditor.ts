import { useEffect, useRef, useState } from "react";

import { closeBrackets } from "@codemirror/autocomplete";
import {
  defaultKeymap,
  history,
  indentWithTab,
  insertNewlineAndIndent,
} from "@codemirror/commands";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import {
  bracketMatching,
  indentOnInput,
  syntaxHighlighting,
} from "@codemirror/language";
import { languages } from "@codemirror/language-data";
import { EditorState } from "@codemirror/state";
import {
  crosshairCursor,
  drawSelection,
  dropCursor,
  highlightActiveLine,
  highlightSpecialChars,
  keymap,
  rectangularSelection,
} from "@codemirror/view";
import { vim } from "@replit/codemirror-vim";
import { useQueryClient } from "@tanstack/react-query";
import {
  NoteService,
  Settings,
} from "&/github.com/nodetec/captains-log/service";
import neovimHighlightStyle from "~/lib/codemirror/highlight/neovim";
import darkTheme from "~/lib/codemirror/theme/dark";
import { parseTitle } from "~/lib/markdown";
import { useAppState } from "~/store";
import { EditorView } from "codemirror";

interface Props {
  initialDoc: string;
  onChange: (state: string) => void;
  settings: Settings | undefined;
}

export const useEditor = ({ initialDoc, onChange, settings }: Props) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editorView, setEditorView] = useState<EditorView>();

  const { activeNote, activeTrashNote, feedType } = useAppState();
  const queryClient = useQueryClient();

  let timeoutId: NodeJS.Timeout;

  const saveDocument = async (view: EditorView) => {
    const content = activeNote?.Content;
    const id = activeNote?.ID;
    if (activeNote === undefined || id === undefined || content === undefined) {
      return;
    }
    const note = await NoteService.GetNote(id);
    if (note.Content !== view.state.doc.toString()) {
      void NoteService.UpdateNote(
        id,
        parseTitle(view.state.doc.toString()).title,
        view.state.doc.toString(),
        activeNote.NotebookID,
        activeNote.StatusID,
        // TODO: rethink published indicator
        false,
        activeNote.EventID,
      );
      console.log("SAVING TO DB");
    }
  };

  const blurHandlerExtension = EditorView.domEventHandlers({
    blur: (_, view) => {
      void saveDocument(view);
      void queryClient.invalidateQueries({ queryKey: ["notes"] });
      return false;
    },
  });

  useEffect(() => {
    console.log("useEditor settings ", settings);
    if (!editorRef.current) return;

    const extensions = [
      syntaxHighlighting(neovimHighlightStyle),
      highlightActiveLine(),
      keymap.of(defaultKeymap),
      keymap.of([{ key: "Enter", run: insertNewlineAndIndent }, indentWithTab]),
      darkTheme,
      highlightSpecialChars(),
      history(),
      drawSelection(),
      dropCursor(),
      indentOnInput(),
      bracketMatching(),
      closeBrackets(),
      rectangularSelection(),
      crosshairCursor(),
      EditorState.readOnly.of(feedType === "trash" ? true : false),
      keymap.of([indentWithTab]),
      EditorView.lineWrapping,
      markdown({
        base: markdownLanguage,
        codeLanguages: languages,
      }),
      blurHandlerExtension,
      EditorView.updateListener.of((update) => {
        if (
          update.changes &&
          activeNote?.Content !== update.state.doc.toString()
        ) {
          onChange(update.state.doc.toString());
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => saveDocument(update.view), 500);
        }
      }),
    ];

    if (settings?.Vim === "true") {
      extensions.push(vim());
    }

    const initialState = EditorState.create({
      doc: initialDoc,
      extensions,
    });

    const view = new EditorView({
      state: initialState,
      parent: editorRef.current,
    });

    setEditorView(view);

    return () => {
      view.destroy();
      clearTimeout(timeoutId); // Clear timeout on cleanup
    };
  }, [activeNote?.ID, activeTrashNote?.ID, feedType]);

  return { editorRef, editorView };
};
