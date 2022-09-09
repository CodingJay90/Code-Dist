import React, { useEffect, useState, useRef, useCallback } from "react";
import { Container } from "./elements";
import * as monaco from "monaco-editor";
import { useAppDispatch, useAppSelector } from "@/reduxStore/hooks";
import { toggleFileModifiedStatus } from "@/reduxStore/app/appSlice";
import { useHotkeys } from "react-hotkeys-hook";

const EditorView = () => {
  const [mnEditor, setMnEditor] =
    useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [typingState, setTypingState] = useState<boolean>(false);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();
  const { activeOpenedFile } = useAppSelector((state) => state.app);
  useHotkeys(
    "ctrl+s, cmd+s",
    function () {
      dispatch(
        toggleFileModifiedStatus({
          fileId: activeOpenedFile?._id ?? "",
          status: false,
        })
      );
    },
    {
      filterPreventDefault: true,
      enableOnTags: ["INPUT", "TEXTAREA"],
      enabled: true,
    }
  );

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

  function setEditorLanguage(language: string): void {
    if (!mnEditor) return;
    monaco.editor.setModelLanguage(mnEditor.getModel()!, language);
  }

  // const setFileModifiedStatusOnType = useCallback(() => {
  //   if (!mnEditor) return;
  //   console.log("running", typingState);
  //   const disposableKeyDownEvent = mnEditor.onKeyDown((e) => {
  //     setTypingState(true);
  //     dispatch(
  //       toggleFileModifiedStatus({
  //         fileId: activeOpenedFile?._id ?? "",
  //         status: true,
  //       })
  //     );
  //     disposableKeyDownEvent.dispose();
  //   });
  // }, [typingState]);

  function setFileModifiedStatusOnType(
    editor: monaco.editor.IStandaloneCodeEditor
  ): void {
    const disposableKeyDownEvent = editor.onKeyDown((e) => {
      dispatch(
        toggleFileModifiedStatus({
          fileId: activeOpenedFile?._id ?? "",
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
