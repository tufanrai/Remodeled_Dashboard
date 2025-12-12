import React, { useRef } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
} from "lucide-react";

export default function TextEditor() {
  const editorRef = useRef<HTMLDivElement>(null);

  const executeCommand = (command: string, value: string = "") => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const ToolbarButton = ({
    onClick,
    icon: Icon,
    title,
  }: {
    onClick: () => void;
    icon: any;
    title: string;
  }) => (
    <button
      onClick={onClick}
      className="p-2 hover:bg-gray-200 rounded transition-colors"
      title={title}
      type="button"
    >
      <Icon size={18} />
    </button>
  );

  return (
    <div className="w-full h-screen flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-300 p-2 flex flex-wrap items-center gap-1 shadow-sm">
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          <ToolbarButton
            onClick={() => executeCommand("formatBlock", "<h1>")}
            icon={Heading1}
            title="Heading 1"
          />
          <ToolbarButton
            onClick={() => executeCommand("formatBlock", "<h2>")}
            icon={Heading2}
            title="Heading 2"
          />
          <ToolbarButton
            onClick={() => executeCommand("formatBlock", "<h3>")}
            icon={Heading3}
            title="Heading 3"
          />
        </div>

        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          <ToolbarButton
            onClick={() => executeCommand("bold")}
            icon={Bold}
            title="Bold"
          />
          <ToolbarButton
            onClick={() => executeCommand("italic")}
            icon={Italic}
            title="Italic"
          />
          <ToolbarButton
            onClick={() => executeCommand("underline")}
            icon={Underline}
            title="Underline"
          />
        </div>

        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => executeCommand("insertUnorderedList")}
            icon={List}
            title="Bullet List"
          />
          <ToolbarButton
            onClick={() => executeCommand("insertOrderedList")}
            icon={ListOrdered}
            title="Numbered List"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto p-8 bg-white">
        <div
          ref={editorRef}
          contentEditable
          className="min-h-full w-full max-w-4xl mx-auto p-8 bg-white shadow-lg border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          style={{ fontSize: "16px", lineHeight: "1.6" }}
        />
      </div>
    </div>
  );
}
