import React, { useEffect, useState, useRef, useCallback } from "react";
import { Container } from "./elements";
import * as monaco from "monaco-editor";
import { useAppDispatch, useAppSelector } from "@/reduxStore/hooks";
import {
  toggleFileModifiedStatus,
  updateFile,
} from "@/reduxStore/app/appSlice";
import { useHotkeys } from "react-hotkeys-hook";
import { useUpdateFileContent } from "@/graphql/mutations/app.mutations";

const LanguageMapper: { [key: string]: string } = {
  js: "javascript",
  jsx: "javascript",
  ts: "typescript",
  tsx: "javascript",
  css: "css",
  scss: "scss",
  html: "html",
  xhtml: "html",
  handlebars: "html",
  handlebar: "html",
  hbs: "html",
  json: "json",
  jsonp: "jsonp",
};

const EditorView = () => {
  const [mnEditor, setMnEditor] =
    useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [typingState, setTypingState] = useState<boolean>(false);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const { updateFileContent } = useUpdateFileContent();
  const dispatch = useAppDispatch();
  const { activeOpenedFile } = useAppSelector((state) => state.app);

  useHotkeys("ctrl+s, cmd+s", saveFile, {
    filterPreventDefault: true,
    enableOnTags: ["INPUT", "TEXTAREA"],
    enabled: true,
  });

  function saveFile(): void {
    if (!activeOpenedFile) return;
    const fileContent = mnEditor?.getValue() ?? activeOpenedFile.file_content;
    console.log(mnEditor?.getValue());
    dispatch(
      updateFile({
        fileToUpdate: {
          ...activeOpenedFile,
          file_content: fileContent,
        },
        status: false,
      })
    );
    updateFileContent({
      variables: {
        input: {
          _id: activeOpenedFile._id,
          file_content: fileContent,
        },
      },
    });
  }

  function setEditorModel(): void {
    const editor = monaco.editor.create(editorRef.current!, {
      value: activeOpenedFile?.file_content ?? "",
      language: LanguageMapper[activeOpenedFile?.file_type ?? "js"],
      lineNumbers: "on",
      roundedSelection: false,
      scrollBeyondLastLine: false,
      readOnly: false,
      theme: "vs",
    });
    setMnEditor(editor);
    setFileModifiedStatusOnType(editor);
  }

  function setFileModifiedStatusOnType(
    editor: monaco.editor.IStandaloneCodeEditor
  ): void {
    const disposableKeyDownEvent = editor.onKeyDown((e) => {
      if (!activeOpenedFile) return;
      dispatch(
        updateFile({
          fileToUpdate: activeOpenedFile,
          status: true,
        })
      );
      disposableKeyDownEvent.dispose();
    });
  }

  useEffect(() => {
    if (editorRef && !mnEditor) {
      setEditorModel();
    }
  }, [editorRef.current]);

  useEffect(() => {
    if (mnEditor) {
      mnEditor.dispose();
      setEditorModel();
    }
  }, [activeOpenedFile?.file_content]);

  return <Container ref={editorRef}></Container>;
};

export default EditorView;
