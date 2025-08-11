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
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [initializationAttempted, setInitializationAttempted] = useState(false);
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

  // Enhanced initialization with error handling and retry logic
  const initializeQuill = useCallback(async () => {
    if (initializationAttempted && retryCount >= 3) {
      setLoadingError("Failed to load editor after multiple attempts");
      return;
    }

    try {
      setLoadingError(null);
      setIsRetrying(retryCount > 0);
      setInitializationAttempted(true);

      // Check if Quill is available
      if (typeof Quill === 'undefined') {
        throw new Error("Quill library not loaded");
      }

      // Check if BlotFormatter2 is available
      if (typeof BlotFormatter2 === 'undefined') {
        throw new Error("BlotFormatter2 plugin not loaded");
      }

      // Register the module with error handling
      try {
        Quill.register("modules/blotFormatter2", BlotFormatter2);
      } catch (registerError) {
        console.warn("BlotFormatter2 already registered or registration failed:", registerError);
        // Continue anyway as it might already be registered
      }

      // Small delay to ensure DOM is ready
      await new Promise(resolve => setTimeout(resolve, 100));

      setEditorReady(true);
      setIsRetrying(false);
      setRetryCount(0);
      
    } catch (error) {
      console.error("Quill initialization failed:", error);
      setLoadingError(error instanceof Error ? error.message : "Unknown initialization error");
      setEditorReady(false);
      setIsRetrying(false);
      
      // Retry logic
      if (retryCount < 3) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          initializeQuill();
        }, 1000 * (retryCount + 1)); // Exponential backoff
      }
    }
  }, [retryCount, initializationAttempted]);

  useEffect(() => {
    initializeQuill();
  }, [initializeQuill]);
  const getQuillInstance = () => {
    return reactQuillRef.current ? reactQuillRef.current.getEditor() : null;
  };

  useEffect(() => {
    setValue(defaultValue ?? "");
  }, [defaultValue]);

  // Fix: Get Quill instance from ref

  const applyTemplate = (templateContent: string) => {
    try {
      const quillInstance = getQuillInstance();
      if (quillInstance) {
        quillInstance.setContents(JSON.parse(templateContent));
        setIsTemplateDialogOpen(false);
      }
    } catch (error) {
      console.error("Failed to apply template:", error);
      alert("Failed to apply template. Please try again.");
    }
  };
  const imageHandler = useCallback(() => {
    try {
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
    } catch (error) {
      console.error("Failed to create image input:", error);
      alert("Failed to open image selector. Please try again.");
    }
  }, [VITE_CLOUDINARY_CLOUD_NAME, VITE_CLOUDINARY_PRESET]);

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

  // Retry function for user-triggered retries
  const handleRetry = () => {
    setRetryCount(0);
    setInitializationAttempted(false);
    setLoadingError(null);
    setEditorReady(false);
    initializeQuill();
  };

  // Better loading states and error handling
  if (loadingError) {
    return (
      <div style={{ 
        width: "100%", 
        padding: "20px", 
        textAlign: "center",
        backgroundColor: "#f8f9fa",
        border: "1px solid #dee2e6",
        borderRadius: "4px"
      }}>
        <div style={{ color: "#dc3545", marginBottom: "10px" }}>
          ⚠️ Editor failed to load: {loadingError}
        </div>
        <button 
          onClick={handleRetry}
          style={{
            padding: "8px 16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Retry Loading Editor
        </button>
      </div>
    );
  }

  if (isRetrying) {
    return (
      <div style={{ 
        width: "100%", 
        padding: "20px", 
        textAlign: "center",
        backgroundColor: "#f8f9fa",
        border: "1px solid #dee2e6",
        borderRadius: "4px"
      }}>
        <div>🔄 Retrying editor initialization... (Attempt {retryCount}/3)</div>
      </div>
    );
  }

  if (!editorReady) {
    return (
      <div style={{ 
        width: "100%", 
        padding: "20px", 
        textAlign: "center",
        backgroundColor: "#f8f9fa",
        border: "1px solid #dee2e6",
        borderRadius: "4px"
      }}>
        <div>📝 Loading editor...</div>
      </div>
    );
  }

  return (
    <div className="" style={{ width: "100%" }}>
      {editorReady ? (
        <ReactQuill
          ref={reactQuillRef}
          theme="snow"
          value={value}
          onChange={(val: string) => {
            try {
              setValue(val);
              onValueChange(val);
            } catch (error) {
              console.error("Failed to update editor value:", error);
            }
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
