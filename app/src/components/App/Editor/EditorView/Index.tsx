import React, { useEffect, useState, useRef } from "react";
import { Container } from "./elements";
import * as monaco from "monaco-editor";
import { useAppSelector } from "@/reduxStore/hooks";

const EditorView = () => {
  const [mnEditor, setMnEditor] =
    useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const { activeOpenedFile } = useAppSelector((state) => state.app);

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

  function setEditorLanguage(language: string) {
    if (!mnEditor) return;
    monaco.editor.setModelLanguage(mnEditor.getModel()!, language);
  }

  useEffect(() => {
    if (editorRef && !mnEditor) {
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
    }

    // return () => mnEditor?.dispose();
  }, [editorRef.current]);

  useEffect(() => {
    if (mnEditor) {
      setEditorLanguage(LanguageMapper[activeOpenedFile?.file_type ?? "js"]);
      mnEditor.setValue(activeOpenedFile?.file_content ?? "");
    }
    // return () => mnEditor?.dispose();
  }, [activeOpenedFile]);
  return <Container ref={editorRef}></Container>;
};

export default EditorView;
