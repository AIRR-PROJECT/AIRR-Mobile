"use dom";
import "./QuillRendererStyles.css";
import "react-quill/dist/quill.snow.css";
const mockContent = `
<p>adsada</p><h1>adasdad</h1><ul><li>12313</li></ul><p class="ql-indent-3"><span style="color: rgb(240, 102, 102);">ádasadasda</span></p><pre class="ql-syntax" spellcheck="false">	asdasdsadad
sada
</pre><p>ádasdadab</p>
`;
export default function QuillRenderer({}: {dom: import('expo/dom').DOMProps}) {
  return (
    <div className="ql-snow" style={{ width: "100%"}}>
      <div
        className="ql-editor"  
        contentEditable="false"
        data-placeholder=" "
        role="textbox"
        aria-label="Rich Text Editor, Quill"
        spellCheck="false"
        dangerouslySetInnerHTML={{
          __html: mockContent,
        }}
        style={{
            color:'#fff',
        }}
      ></div>
    </div>
  );
}
