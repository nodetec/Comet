// Cynhyrchwyd y ffeil hon yn awtomatig. PEIDIWCH Â MODIWL
// This file is automatically generated. DO NOT EDIT

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: Unused imports
import {Call as $Call, Create as $Create} from "@wailsio/runtime";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: Unused imports
import * as db$0 from "../db/models.js";

export function CreateNotebook(name: string): Promise<db$0.Notebook> & { cancel(): void } {
    let $resultPromise = $Call.ByID(1869216282, name) as any;
    let $typingPromise = $resultPromise.then(($result) => {
        return $$createType0($result);
    }) as any;
    $typingPromise.cancel = $resultPromise.cancel.bind($resultPromise);
    return $typingPromise;
}

export function DeleteNotebook(id: number): Promise<void> & { cancel(): void } {
    let $resultPromise = $Call.ByID(2925036805, id) as any;
    return $resultPromise;
}

export function GetNotebook(id: number): Promise<db$0.Notebook> & { cancel(): void } {
    let $resultPromise = $Call.ByID(542902412, id) as any;
    let $typingPromise = $resultPromise.then(($result) => {
        return $$createType0($result);
    }) as any;
    $typingPromise.cancel = $resultPromise.cancel.bind($resultPromise);
    return $typingPromise;
}

export function ListNotebooks(): Promise<db$0.Notebook[]> & { cancel(): void } {
    let $resultPromise = $Call.ByID(3041603755) as any;
    let $typingPromise = $resultPromise.then(($result) => {
        return $$createType1($result);
    }) as any;
    $typingPromise.cancel = $resultPromise.cancel.bind($resultPromise);
    return $typingPromise;
}

export function UpdateNotebook(id: number, name: string, createdAt: string): Promise<void> & { cancel(): void } {
    let $resultPromise = $Call.ByID(1472371799, id, name, createdAt) as any;
    return $resultPromise;
}

// Private type creation functions
const $$createType0 = db$0.Notebook.createFrom;
const $$createType1 = $Create.Array($$createType0);
