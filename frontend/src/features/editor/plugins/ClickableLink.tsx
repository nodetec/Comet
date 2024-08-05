/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect } from "react";

import { $isLinkNode } from "@lexical/link";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $findMatchingParent, isHTMLAnchorElement } from "@lexical/utils";
import { Browser } from "@wailsio/runtime";
import {
  $getNearestNodeFromDOMNode,
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  getNearestEditorFromDOMNode,
} from "lexical";

function findMatchingDOM<T extends Node>(
  startNode: Node,
  predicate: (node: Node) => node is T,
): T | null {
  let node: Node | null = startNode;
  while (node != null) {
    if (predicate(node)) {
      return node;
    }
    node = node.parentNode;
  }
  return null;
}

export function ClickableLinkPlugin({
  newTab = true,
  disabled = false,
}: {
  newTab?: boolean;
  disabled?: boolean;
}): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      console.log("ClickableLinkPlugin onClick");
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }
      const nearestEditor = getNearestEditorFromDOMNode(target);

      if (nearestEditor === null) {
        return;
      }

      let url = null;
      let urlTarget = null;

      console.log("ClickableLinkPlugin onClick update");
      nearestEditor.update(() => {
        const clickedNode = $getNearestNodeFromDOMNode(target);
        if (clickedNode !== null) {
          const maybeLinkNode = $findMatchingParent(
            clickedNode,
            $isElementNode,
          );
          if (!disabled) {
            if ($isLinkNode(maybeLinkNode)) {
              url = maybeLinkNode.sanitizeUrl(maybeLinkNode.getURL());
              if (url === null) {
                return;
              }
              Browser.OpenURL(url);

              urlTarget = maybeLinkNode.getTarget();
            } else {
              const a = findMatchingDOM(target, isHTMLAnchorElement);
              if (a !== null) {
                url = a.href;
                urlTarget = a.target;
              }
            }
          }
        }
      });

      if (url === null || url === "") {
        return;
      }

      // Allow user to select link text without follwing url
      const selection = editor.getEditorState().read($getSelection);
      if ($isRangeSelection(selection) && !selection.isCollapsed()) {
        event.preventDefault();
        return;
      }

      const isMiddle = event.type === "auxclick" && event.button === 1;
      window.open(
        url,
        newTab ||
          isMiddle ||
          event.metaKey ||
          event.ctrlKey ||
          urlTarget === "_blank"
          ? "_blank"
          : "_self",
      );
      event.preventDefault();
    };

    const onMouseUp = (event: MouseEvent) => {
      if (event.button === 1) {
        onClick(event);
      }
    };

    return editor.registerRootListener((rootElement, prevRootElement) => {
      if (prevRootElement !== null) {
        prevRootElement.removeEventListener("click", onClick);
        prevRootElement.removeEventListener("mouseup", onMouseUp);
      }
      if (rootElement !== null) {
        rootElement.addEventListener("click", onClick);
        rootElement.addEventListener("mouseup", onMouseUp);
      }
    });
  }, [editor, newTab, disabled]);

  return null;
}

/** @deprecated use the named export {@link ClickableLinkPlugin} */
// eslint-disable-next-line no-restricted-exports
export default ClickableLinkPlugin;
