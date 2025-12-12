import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bold, Heading1, Heading2, List, Plus, Trash2, Type } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ContentBlock {
  id: string;
  type: "header" | "subheader" | "paragraph" | "list" | "bold";
  content: string;
}

interface RichTextEditorProps {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
  label?: string;
}

export function RichTextEditor({ blocks, onChange, label = "Description" }: RichTextEditorProps) {
  const addBlock = (type: ContentBlock["type"]) => {
    onChange([
      ...blocks,
      { id: Date.now().toString(), type, content: "" }
    ]);
  };

  const updateBlock = (id: string, content: string) => {
    onChange(
      blocks.map((block) =>
        block.id === id ? { ...block, content } : block
      )
    );
  };

  const removeBlock = (id: string) => {
    if (blocks.length > 1) {
      onChange(blocks.filter((block) => block.id !== id));
    }
  };

  const getBlockIcon = (type: ContentBlock["type"]) => {
    switch (type) {
      case "header": return <Heading1 className="h-3 w-3" />;
      case "subheader": return <Heading2 className="h-3 w-3" />;
      case "paragraph": return <Type className="h-3 w-3" />;
      case "list": return <List className="h-3 w-3" />;
      case "bold": return <Bold className="h-3 w-3" />;
    }
  };

  const getBlockLabel = (type: ContentBlock["type"]) => {
    switch (type) {
      case "header": return "Header";
      case "subheader": return "Subheader";
      case "paragraph": return "Paragraph";
      case "list": return "List";
      case "bold": return "Bold Text";
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Label>{label}</Label>
        <div className="flex flex-wrap gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addBlock("header")}
            className="text-xs"
          >
            <Heading1 className="mr-1 h-3 w-3" />
            H1
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addBlock("subheader")}
            className="text-xs"
          >
            <Heading2 className="mr-1 h-3 w-3" />
            H2
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addBlock("paragraph")}
            className="text-xs"
          >
            <Type className="mr-1 h-3 w-3" />
            Text
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addBlock("bold")}
            className="text-xs"
          >
            <Bold className="mr-1 h-3 w-3" />
            Bold
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addBlock("list")}
            className="text-xs"
          >
            <List className="mr-1 h-3 w-3" />
            List
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {blocks.map((block) => (
          <div key={block.id} className="flex gap-2">
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground flex items-center gap-1 px-2 py-0.5 bg-muted/50 rounded">
                  {getBlockIcon(block.type)}
                  {getBlockLabel(block.type)}
                </span>
              </div>
              {block.type === "header" ? (
                <Input
                  placeholder="Enter header text"
                  value={block.content}
                  onChange={(e) => updateBlock(block.id, e.target.value)}
                  className="bg-muted/30 font-bold text-lg"
                />
              ) : block.type === "subheader" ? (
                <Input
                  placeholder="Enter subheader text"
                  value={block.content}
                  onChange={(e) => updateBlock(block.id, e.target.value)}
                  className="bg-muted/30 font-semibold"
                />
              ) : block.type === "bold" ? (
                <Input
                  placeholder="Enter bold text"
                  value={block.content}
                  onChange={(e) => updateBlock(block.id, e.target.value)}
                  className="bg-muted/30 font-bold"
                />
              ) : block.type === "list" ? (
                <Textarea
                  placeholder="Enter list items (one per line)"
                  value={block.content}
                  onChange={(e) => updateBlock(block.id, e.target.value)}
                  className="bg-muted/30 min-h-[80px]"
                />
              ) : (
                <Textarea
                  placeholder="Enter paragraph text"
                  value={block.content}
                  onChange={(e) => updateBlock(block.id, e.target.value)}
                  className="bg-muted/30 min-h-[80px]"
                />
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeBlock(block.id)}
              disabled={blocks.length === 1}
              className="mt-6 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
