"use dom";
import "./QuillRendererStyles.css";
import "react-quill/dist/quill.snow.css";

type QuillRendererProps = {
  dom: import("expo/dom").DOMProps;
  content: string;
};

export default function QuillRenderer({ content }: QuillRendererProps) {
  return (
    <div className="ql-snow" style={{ width: "100%" }}>
      <div
        className="ql-editor"
        contentEditable="false"
        data-placeholder=" "
        role="textbox"
        aria-label="Rich Text Editor, Quill"
        spellCheck="false"
        dangerouslySetInnerHTML={{
          __html: content,
        }}
        style={{
          color: "#fff",
        }}
      />
    </div>
  );
}
