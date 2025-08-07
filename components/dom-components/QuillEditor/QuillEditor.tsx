"use dom";

import { useCallback, useEffect, useRef, useState } from "react";
import ReactQuill, { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "@enzedonline/quill-blot-formatter2";
import BlotFormatter2 from "@enzedonline/quill-blot-formatter2";
import "./QuillEditorStyles.css";
import imageCompression from "browser-image-compression";

// const VITE_CLOUDINARY_CLOUD_NAME = process.env.VITE_CLOUDINARY_CLOUD_NAME;
// const VITE_CLOUDINARY_PRESET = process.env.VITE_CLOUDINARY_PRESET;
export default function QuillEditor({
  defaultValue,
  onValueChange,
  VITE_CLOUDINARY_CLOUD_NAME,
  VITE_CLOUDINARY_PRESET,
}: {
  defaultValue?: string;
  onValueChange: (val: string) => void;
  VITE_CLOUDINARY_CLOUD_NAME?: string;
  VITE_CLOUDINARY_PRESET?: string;
  dom: import("expo/dom").DOMProps;
}) {
  const [value, setValue] = useState("");
  const reactQuillRef = useRef<ReactQuill>(null);
  const [editorReady, setEditorReady] = useState(false);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const uploadToCloudinary = async (file: File): Promise<string> => {
    try {
      const cloudinaryPreset = VITE_CLOUDINARY_PRESET;
      const cloudinaryCloudName = VITE_CLOUDINARY_CLOUD_NAME;
      console.log("Uploading to Cloudinary with preset:", cloudinaryPreset);
      console.log("Cloudinary cloud name:", cloudinaryCloudName);
      if (!cloudinaryPreset || !cloudinaryCloudName) {
        throw new Error("Cloudinary configuration is missing.");
      }

      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);

      const formData = new FormData();
      formData.append("file", compressedFile);
      formData.append("upload_preset", cloudinaryPreset);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          `Upload failed: ${errorData.error?.message || "Unknown error"}`
        );
      }

      const data = await res.json();
      if (!data.secure_url)
        throw new Error("Upload failed: No secure URL returned");

      const optimizedUrl = data.secure_url.replace(
        "/upload/",
        "/upload/q_auto,f_auto/"
      );

      return optimizedUrl;
    } catch (error) {
      console.error("Image upload failed:", error);
      alert(
        `Image upload failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      throw error;
    }
  };
  useEffect(() => {
    Quill.register("modules/blotFormatter2", BlotFormatter2);
    setEditorReady(true);
  }, []);
  const getQuillInstance = () => {
    return reactQuillRef.current ? reactQuillRef.current.getEditor() : null;
  };

  useEffect(() => {
    setValue(defaultValue ?? "");
  }, [defaultValue]);

  // Fix: Get Quill instance from ref

  const applyTemplate = (templateContent: string) => {
    const quillInstance = getQuillInstance();
    if (quillInstance) {
      quillInstance.setContents(JSON.parse(templateContent));
      setIsTemplateDialogOpen(false);
    }
  };
  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    input.onchange = async () => {
      if (input.files && input.files[0]) {
        try {
          const url = await uploadToCloudinary(input.files[0]);
          const quillInstance = getQuillInstance();
          if (quillInstance) {
            const range = quillInstance.getSelection();
            if (range) {
              quillInstance.insertEmbed(range.index, "image", url);
            }
          }
        } catch (error) {
          console.error("Failed to upload image:", error);
        }
      }
    };
  }, []);

  const modules = {
    toolbar: {
      container: [
        ["bold", "italic", "underline", "strike"],
        ["blockquote", "code-block"],
        [{ header: 1 }, { header: 2 }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ script: "sub" }, { script: "super" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ direction: "rtl" }],
        [{ size: ["small", false, "large", "huge"] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] }, { background: [] }],
        [{ font: [] }],
        [{ align: [] }],
        ["clean"],
        ["link", "image"],
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
        // Optionally add className mapping if you want custom CSS classes
        className: {
          left: "ql-image-align-left",
          center: "ql-image-align-center",
          right: "ql-image-align-right",
        },
      },
      resize: { allowResizing: true },
      delete: { allowKeyboardDelete: true },
      image: { allowAltTitleEdit: true, allowCompressor: true },
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
    "clean",
  ];

  return (
    <div className="" style={{ width: "100%" }}>
      {editorReady ? (
        <ReactQuill
          ref={reactQuillRef}
          theme="snow"
          value={value}
          onChange={(val: string) => {
            setValue(val);
            onValueChange(val);
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
