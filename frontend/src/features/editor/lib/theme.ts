import { EditorThemeClasses } from "lexical";

const darkTheme: EditorThemeClasses = {
  code: "font-monospace text-sm bg-neutral-800 p-1 rounded",
  heading: {
    h1: "scroll-m-20 text-3xl font-bold tracking-normal mb-7",
    h2: "text-3xl font-bold",
    h3: "text-2xl font-bold",
    h4: "text-xl font-bold",
    h5: "text-lg font-bold",
    h6: "font-bold",
  },
  image: "editor-image",
  link: "text-blue-500 underline cursor-pointer",
  list: {
    listitem: "editor-listitem",
    nested: {
      listitem: "editor-nested-listitem",
    },
    ol: "editor-list-ol",
    ul: "editor-list-ul",
  },
  blockCursor: "bg-blue-500",
  ltr: "text-left",
  paragraph: "mb-3 leading-7 tracking-normal",
  placeholder: "editor-placeholder",
  quote: "editor-quote",
  rtl: "text-right",
  text: {
    bold: "font-bold",
    code: "font-monospace text-sm bg-neutral-800 p-1 rounded",
    hashtag: "text-blue-500",
    italic: "font-italic",
    overflowed: "overlfow-auto",
    strikethrough: "strikethrough",
    underline: "underline",
    underlineStrikethrough: "strikethrough underline",
  },
};

export function getTheme(theme: string) {
  switch (theme) {
    case "dark":
      return darkTheme;
    default:
      return darkTheme;
  }
}
