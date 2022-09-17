import React, { useEffect, useState, useRef, useCallback } from "react";
import { Container } from "./elements";
import * as monaco from "monaco-editor";
import { useAppDispatch, useAppSelector } from "@/reduxStore/hooks";
import {
  removeFileFromOpenedFiles,
  toggleFileModifiedStatus,
  updateFile,
  updateFileOnEditorLeave,
} from "@/reduxStore/app/appSlice";
import { useHotkeys } from "react-hotkeys-hook";
import { useUpdateFileContent } from "@/graphql/mutations/app.mutations";
import CloseEditedFileModal from "@/components/Modal/CloseEditedFileModal/Index";
import { useInteractionContext } from "@/contexts/interactions/InteractionContextProvider";
import { IFile } from "@/graphql/models/app.interface";

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
  map: "json",
  jsonp: "jsonp",
};

const EditorView = () => {
  const [mnEditor, setMnEditor] =
    useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [typingState, setTypingState] = useState<boolean>(false);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();
  const { editorInteractions, setEditorInteractionsState } =
    useInteractionContext();
  const { updateFileContent } = useUpdateFileContent();
  const { activeOpenedFile } = useAppSelector((state) => state.app);
  const [prevOpenedFile, setPrevOpenedFile] = useState<IFile | null>(null);
  useHotkeys(
    "ctrl+s, cmd+s",
    function () {
      if (!activeOpenedFile) return;
      const fileContent = mnEditor?.getValue() ?? activeOpenedFile.file_content;
      const file = {
        ...activeOpenedFile,
        file_content: fileContent,
      };
      saveFile(file);
    },
    {
      filterPreventDefault: true,
      enableOnTags: ["INPUT", "TEXTAREA"],
      enabled: true,
    }
  );

  function saveFile(file: IFile): void {
    dispatch(
      updateFile({
        fileToUpdate: {
          ...file,
          file_content: file.file_content,
        },
        status: false,
      })
    );
    updateFileContent({
      variables: {
        input: {
          _id: file._id,
          file_content: file.file_content,
        },
      },
    });
  }

  function closeFile(): void {
    if (!editorInteractions.fileToClose) return;
    dispatch(removeFileFromOpenedFiles(editorInteractions.fileToClose._id));
    setEditorInteractionsState({
      ...editorInteractions,
      showCloseFileDialogModal: false,
    });
  }

  function setEditorModel(): void {
    if (!editorRef.current) return;
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

    editor.onDidBlurEditorText(() => {
      // editor.focus();
      console.log(activeOpenedFile);
      console.log(editor?.getValue());
      saveFileContentOnDispose(editor.getValue());
    });
    // setPrevOpenedFile(mnEditor?.getValue() ?? "");
    // editor.onMouseLeave(() => {
    //   console.log(activeOpenedFile?.file_name);
    //   console.log(mnEditor?.getValue());
    // });
    // editor.onDidDispose(() => {
    //   saveFileContentOnDispose();
    // });
  }

  function saveFileContentOnDispose(fileContent: string): void {
    if (activeOpenedFile) {
      // console.log(prevOpenedFile);
      dispatch(
        updateFileOnEditorLeave({
          fileToUpdate: {
            ...activeOpenedFile,
            file_content: fileContent, //prevOpenedFile?.file_content ?? activeOpenedFile.file_content, //mnEditor?.getValue() ?? activeOpenedFile.file_content,
          },
          status: true,
        })
      );
    }
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
      // disposableKeyDownEvent.dispose();
    });
  }

  useEffect(() => {
    if (editorRef && !mnEditor) {
      setEditorModel();
    }
  }, [editorRef.current]);

  useEffect(() => {
    if (mnEditor) {
      activeOpenedFile &&
        setPrevOpenedFile({
          ...activeOpenedFile,
          file_content: mnEditor?.getValue() ?? "",
        }); //use this to update the fileContent on file change(editor dispose)
      mnEditor.dispose();
      setEditorModel();
    }
    // console.log(activeOpenedFile);
    // console.log(prevOpenedFile?.file_content);
    // console.log(mnEditor?.getValue() ?? "");
  }, [activeOpenedFile?._id]);

  return (
    <>
      <Container ref={editorRef}></Container>;
      <CloseEditedFileModal
        showModal={editorInteractions.showCloseFileDialogModal}
        setShowModal={(state: boolean) => {
          setEditorInteractionsState({
            ...editorInteractions,
            showCloseFileDialogModal: state,
          });
        }}
        onDontSaveClick={closeFile}
        onSaveClick={() => {
          if (!editorInteractions.fileToClose) return;
          saveFile(editorInteractions.fileToClose);
          closeFile();
        }}
        message={`Do you want to make changes made to ${editorInteractions.fileToClose?.file_name}?`}
        subMessage="Your changes will be lost if you don't save them."
      />
    </>
  );
};

export default EditorView;
