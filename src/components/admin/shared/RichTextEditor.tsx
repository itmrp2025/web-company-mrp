"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Unlink,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Minus,
  Heading2,
  Heading3,
  Undo,
  Redo,
} from "lucide-react";

interface Props {
  value: string;
  onChange: (html: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
}

interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}

function ToolbarButton({ onClick, active, disabled, title, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded text-sm transition-colors",
        active
          ? "bg-primary text-white"
          : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
        disabled && "cursor-not-allowed opacity-40",
      )}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="mx-1 h-5 w-px bg-neutral-200" />;
}

export function RichTextEditor({ value, onChange, label, placeholder, error }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        bulletList: { HTMLAttributes: { class: "list-disc pl-5" } },
        orderedList: { HTMLAttributes: { class: "list-decimal pl-5" } },
        blockquote: { HTMLAttributes: { class: "border-l-4 border-primary/40 pl-4 text-neutral-500 italic" } },
        horizontalRule: { HTMLAttributes: { class: "my-4 border-neutral-200" } },
        code: { HTMLAttributes: { class: "bg-neutral-100 px-1 py-0.5 rounded text-sm font-mono" } },
        codeBlock: { HTMLAttributes: { class: "bg-neutral-100 rounded p-3 text-sm font-mono" } },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-primary underline cursor-pointer" },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: placeholder ?? "Tulis isi di sini..." }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "min-h-[240px] px-4 py-3 text-sm text-neutral-900 outline-none prose-sm max-w-none focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html === "<p></p>" ? "" : html);
    },
    immediatelyRender: false,
  });

  // Sync external value → editor (e.g. edit mode prefill)
  useEffect(() => {
    if (!editor) return;
    if (editor.getHTML() !== value) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [value, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL link:", prev ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-neutral-700">{label}</label>
      )}

      <div
        className={cn(
          "overflow-hidden rounded-md border bg-white transition-colors focus-within:border-primary focus-within:ring-1 focus-within:ring-primary",
          error ? "border-error focus-within:border-error focus-within:ring-error" : "border-neutral-200",
        )}
      >
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-0.5 border-b border-neutral-100 bg-neutral-50/60 px-2 py-1.5">
          <ToolbarButton
            title="Undo"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            <Undo className="h-3.5 w-3.5" />
          </ToolbarButton>
          <ToolbarButton
            title="Redo"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            <Redo className="h-3.5 w-3.5" />
          </ToolbarButton>

          <Divider />

          <ToolbarButton
            title="Heading 2"
            active={editor.isActive("heading", { level: 2 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            <Heading2 className="h-3.5 w-3.5" />
          </ToolbarButton>
          <ToolbarButton
            title="Heading 3"
            active={editor.isActive("heading", { level: 3 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          >
            <Heading3 className="h-3.5 w-3.5" />
          </ToolbarButton>

          <Divider />

          <ToolbarButton
            title="Bold"
            active={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold className="h-3.5 w-3.5" />
          </ToolbarButton>
          <ToolbarButton
            title="Italic"
            active={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic className="h-3.5 w-3.5" />
          </ToolbarButton>
          <ToolbarButton
            title="Underline"
            active={editor.isActive("underline")}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <UnderlineIcon className="h-3.5 w-3.5" />
          </ToolbarButton>
          <ToolbarButton
            title="Strikethrough"
            active={editor.isActive("strike")}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <Strikethrough className="h-3.5 w-3.5" />
          </ToolbarButton>

          <Divider />

          <ToolbarButton
            title="Bullet List"
            active={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List className="h-3.5 w-3.5" />
          </ToolbarButton>
          <ToolbarButton
            title="Numbered List"
            active={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered className="h-3.5 w-3.5" />
          </ToolbarButton>
          <ToolbarButton
            title="Blockquote"
            active={editor.isActive("blockquote")}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <Quote className="h-3.5 w-3.5" />
          </ToolbarButton>
          <ToolbarButton
            title="Divider"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          >
            <Minus className="h-3.5 w-3.5" />
          </ToolbarButton>

          <Divider />

          <ToolbarButton
            title="Align Left"
            active={editor.isActive({ textAlign: "left" })}
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
          >
            <AlignLeft className="h-3.5 w-3.5" />
          </ToolbarButton>
          <ToolbarButton
            title="Align Center"
            active={editor.isActive({ textAlign: "center" })}
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
          >
            <AlignCenter className="h-3.5 w-3.5" />
          </ToolbarButton>
          <ToolbarButton
            title="Align Right"
            active={editor.isActive({ textAlign: "right" })}
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
          >
            <AlignRight className="h-3.5 w-3.5" />
          </ToolbarButton>

          <Divider />

          <ToolbarButton
            title="Insert Link"
            active={editor.isActive("link")}
            onClick={setLink}
          >
            <LinkIcon className="h-3.5 w-3.5" />
          </ToolbarButton>
          <ToolbarButton
            title="Remove Link"
            disabled={!editor.isActive("link")}
            onClick={() => editor.chain().focus().unsetLink().run()}
          >
            <Unlink className="h-3.5 w-3.5" />
          </ToolbarButton>
        </div>

        {/* Editor area — font follows site theme via CSS inheritance */}
        <EditorContent editor={editor} />
      </div>

      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  );
}
