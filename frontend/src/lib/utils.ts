import { clsx, type ClassValue } from "clsx";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const assignRef = (
  lastNoteRef: (node?: Element | null) => void,
  pageIndex: number,
  noteIndex: number,
  data: any,
) => {
  const isLastNote = (pageIndex: number, noteIndex: number, data: any) =>
    pageIndex === data.pages.length - 1 &&
    noteIndex === data.pages[pageIndex].data.length - 1;

  if (isLastNote(pageIndex, noteIndex, data)) {
    return lastNoteRef;
  }

  return undefined;
};

export function fromNow(createdAt: string | undefined) {
  if (!createdAt) {
    return undefined;
  }
  dayjs.extend(relativeTime);
  const time = dayjs(createdAt).fromNow();
  return time;
}
