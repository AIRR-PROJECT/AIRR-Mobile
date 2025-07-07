"use dom";

import { useCallback, useEffect, useRef, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import "@enzedonline/quill-blot-formatter2";
import BlotFormatter2 from "@enzedonline/quill-blot-formatter2";
import "./QuillEditorStyles.css";

export default function QuillEditor({ defaultValue, onValueChange }: { dom: import("expo/dom").DOMProps, defaultValue?: string, onValueChange: (val: string) => void }) {
  const [value, setValue] = useState("");
  const reactQuillRef = useRef<ReactQuill>(null);
  const [editorReady, setEditorReady] = useState(false);
  
  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    input.onchange = async () => {
      if (input !== null && input.files !== null) {
        const file = input.files[0];
        // const url = await uploadToCloudinary(file); // Assuming you have a function to upload to Cloudinary
        const quill = reactQuillRef.current;
        if (quill) {
          const range = quill.getEditorSelection();
          // range && quill.getEditor().insertEmbed(range.index, 'image', url);
        }
      }
    };
  }, []);

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: [] }],
        [{ size: [] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ script: "sub" }, { script: "super" }],
        [{ align: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        ["link", "image", "video"],
        ["code-block"],
        ["clean"],
      ],
      handlers: {
        image: imageHandler,
      },
    },
    clipboard: {
      matchVisual: true,
    },
    blotFormatter2: {
      align: {
        allowAligning: true,
      },
      resize: {
        allowResizing: true,
      },
      delete: {
        allowKeyboardDelete: true,
      },
      image: {
        allowAltTitleEdit: true,
        allowCompressor: true,
      },
    },
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "color",
    "background",
    "script",
    "align",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
    "code-block",
  ];

  useEffect(() => {
    Quill.register("modules/blotFormatter2", BlotFormatter2);
    setEditorReady(true);
  }, []);

  useEffect(() => {
    setValue(defaultValue ?? "")
  }, [defaultValue])

  return (
    <div className="quill-editor-container" style={{ width: "95%",  }}>
      {editorReady ? (
        <ReactQuill
          ref={reactQuillRef}
          theme="snow"
          value={value}
          onChange={(val: string) => {
            setValue(val)
            onValueChange(val)
          }}
          modules={modules}
          formats={formats}
          placeholder="Write something amazing..."
          
        />
      ) : (
        <div>Loading...</div>
      )}
      
    </div>
  );
}
