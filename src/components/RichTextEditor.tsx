import { useEffect, useState, useRef } from "react";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "@aloushek/react-draft-wysiwyg-next";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "@aloushek/react-draft-wysiwyg-next/dist/react-draft-wysiwyg.css";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const RichTextEditor = ({
  value,
  onChange,
  placeholder,
}: RichTextEditorProps) => {
  // Use a ref to track the last HTML we sent up to avoid infinite update loops
  const lastHtmlRef = useRef(value);

  const safeHtmlToDraft = (html: string) => {
    const fn = typeof htmlToDraft === "function" ? htmlToDraft : (htmlToDraft as { default: typeof htmlToDraft }).default;
    return fn ? fn(html) : null;
  };

  const [editorState, setEditorState] = useState(() => {
    if (value) {
      const blocksFromHtml = safeHtmlToDraft(value);
      if (blocksFromHtml) {
        const { contentBlocks, entityMap } = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(
          contentBlocks,
          entityMap
        );
        return EditorState.createWithContent(contentState);
      }
    }
    return EditorState.createEmpty();
  });

  // Sync editorState if value prop changes externally (e.g. reset/delete edits)
  useEffect(() => {
    if (value !== lastHtmlRef.current) {
      lastHtmlRef.current = value;
      if (!value) {
        setEditorState(EditorState.createEmpty());
        return;
      }
      const blocksFromHtml = safeHtmlToDraft(value);
      if (blocksFromHtml) {
        const { contentBlocks, entityMap } = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(
          contentBlocks,
          entityMap
        );
        setEditorState(EditorState.createWithContent(contentState));
      }
    }
  }, [value]);

  const onEditorStateChange = (newEditorState: EditorState) => {
    setEditorState(newEditorState);
    const rawContentState = convertToRaw(newEditorState.getCurrentContent());
    const html = draftToHtml(rawContentState);
    
    // Only trigger onChange if the HTML content has actually changed
    if (html !== lastHtmlRef.current) {
      lastHtmlRef.current = html;
      onChange(html);
    }
  };

  return (
    <div className="rich-text-editor border border-gray-200 rounded-xl overflow-hidden bg-white relative">
      <Editor
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        placeholder={placeholder || "Type here"}
        toolbarClassName="rdw-editor-toolbar"
        editorClassName="rdw-editor-main"
        toolbar={{
          options: ["inline", "list", "link", "emoji", "image", "history"],
          inline: {
            options: ["bold", "italic", "underline", "strikethrough"],
          },
          list: {
            options: ["unordered", "ordered"],
          },
          image: {
            alt: { present: true, mandatory: false },
            previewImage: true,
          },
        }}
      />
    </div>
  );
};

export default RichTextEditor;
