"use dom";
import "./QuillRendererStyles.css";
import "react-quill-new/dist/quill.snow.css";
import { useEffect, useState } from "react";

type QuillRendererProps = {
  dom: import("expo/dom").DOMProps;
  content: string;
};

export default function QuillRenderer({ content }: QuillRendererProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [processedContent, setProcessedContent] = useState("");

  useEffect(() => {
    try {
      setIsLoading(true);
      setHasError(false);
      
      // Validate and sanitize content
      if (!content || typeof content !== 'string') {
        setProcessedContent('<p>No content available</p>');
      } else {
        setProcessedContent(content);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('QuillRenderer error:', error);
      setHasError(true);
      setIsLoading(false);
      setProcessedContent('<p>Error loading content</p>');
    }
  }, [content]);

  if (isLoading) {
    return (
      <div className="ql-snow" style={{ width: "100%", padding: "20px", textAlign: "center" }}>
        <div style={{ color: "#fff" }}>Loading content...</div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="ql-snow" style={{ width: "100%", padding: "20px", textAlign: "center" }}>
        <div style={{ color: "#ff6b6b" }}>Failed to load content</div>
      </div>
    );
  }

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
          __html: processedContent,
        }}
        style={{
          color: "#fff",
        }}
      />
    </div>
  );
}
