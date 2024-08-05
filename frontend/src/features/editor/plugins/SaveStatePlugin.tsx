import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

export default function SaveStatePlugin() {
  const [editor] = useLexicalComposerContext();

  return <div>SaveStatePlugin</div>;
}
