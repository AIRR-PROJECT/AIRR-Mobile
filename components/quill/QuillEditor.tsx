import { useRef } from "react";
import {WebView, WebViewMessageEvent} from "react-native-webview";
interface QuillEditorProps {
    onContentChange: (content: string) => void;
}
export default function QuillEditor({ onContentChange }: QuillEditorProps) {
  const webViewRef = useRef(null);
  const htmlContent = `<!DOCTYPE html>
<html>

<head>
    <script src="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.js"></script>
    <link href="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.snow.css" rel="stylesheet">
</head>

<body>
    <div id="editor" style="height: 100vh;"></div>
    <script>
        var quill = new Quill('#editor', {
            theme: 'snow',
            modules: {
                syntax: true, // Enable syntax highlighting for code blocks
                toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    ['blockquote', 'code-block'], // Add code block button
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    ['link', 'image'], // Add image button
                    ['clean']
                ]
            }
        });

        // Listen for changes in the editor
        quill.on('text-change', function (delta, oldDelta, source) {
            const content = quill.root.innerHTML;
            window.ReactNativeWebView.postMessage(content);
        });

        // Handle image uploads
        quill.getModule('toolbar').addHandler('image', function () {
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');
            input.click();

            input.onchange = function () {
                const file = input.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        const range = quill.getSelection(true);
                        quill.insertEmbed(range.index, 'image', e.target.result);
                    };
                    reader.readAsDataURL(file);
                }
            };
        });
    </script>
</body>

</html>
  `;
  const handleMessage = (event: WebViewMessageEvent) => {
    const content = event.nativeEvent.data;
    console.log("Editor content:", content);
    // Pass the content to the parent component
    if (onContentChange) {
      onContentChange(content);
    }
  };

  return (
    <WebView
      ref={webViewRef}
      originWhitelist={["*"]}
      source={{html: htmlContent}}
      onMessage={handleMessage}
    />
  );
}
