import { useState } from "react";
import styles from "./CodeBlock.module.css";

interface Props {
  code: string;
  filename?: string;
  copyable?: boolean;
}

function highlight(code: string): string {
  return code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/(`[^`]*`)/g, '<span class="hl-str">$1</span>')
    .replace(/('.*?')/g, '<span class="hl-str">$1</span>')
    .replace(/(\/\/.*)/g, '<span class="hl-cmt">$1</span>')
    .replace(
      /\b(import|export|from|default|const|let|var|function|return|async|await|type|interface|extends|new|class|if|else|true|false|null|undefined|void|string|number|boolean)\b/g,
      '<span class="hl-kw">$1</span>'
    )
    .replace(
      /(&lt;\/?)([\w.]+)(\s|&gt;|\/&gt;)/g,
      '<span class="hl-tag">$1</span><span class="hl-comp">$2</span>$3'
    )
    .replace(/\b([a-zA-Z]+)(?==\{|=')/g, '<span class="hl-attr">$1</span>')
    .replace(/\b(\d+)\b/g, '<span class="hl-num">$1</span>');
}

export function CodeBlock({ code, filename, copyable = true }: Props) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className={styles.wrap}>
      {(filename || copyable) && (
        <div className={styles.header}>
          {filename && <span className={styles.filename}>{filename}</span>}
          {copyable && (
            <button className={styles.copy} onClick={handleCopy}>
              {copied ? "✓ Copied" : "⎘ Copy"}
            </button>
          )}
        </div>
      )}
      <pre className={styles.pre} dangerouslySetInnerHTML={{ __html: highlight(code) }} />
    </div>
  );
}
