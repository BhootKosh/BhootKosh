"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

export function RichTextEditor({
  value,
  onChange,
  label = "Content",
  placeholder = "Write rich text content…",
}: {
  value?: string | null;
  onChange: (html: string) => void;
  label?: string;
  placeholder?: string;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || "",
    immediatelyRender: false,
    onUpdate: ({ editor: e }) => {
      onChange(e.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "tiptap prose-archive min-h-[200px] px-3 py-2 text-ink focus:outline-none",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== undefined && value !== null && value !== current) {
      // Only set if external reset (avoid cursor jumps on own updates)
      if (!editor.isFocused) {
        editor.commands.setContent(value || "");
      }
    }
  }, [value, editor]);

  if (!editor) return null;

  const btn =
    "border-2 border-ink bg-white px-2 py-1 text-xs font-bold uppercase text-ink shadow-[1px_1px_0_0_#0a0a0a] hover:bg-gold";

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold uppercase tracking-wide text-ink">
        {label}
      </label>
      <div className="overflow-hidden border-[3px] border-ink bg-white shadow-[3px_3px_0_0_#0a0a0a]">
        <div className="flex flex-wrap gap-1 border-b-[3px] border-ink bg-gold/40 p-2">
          <button
            type="button"
            className={cn(btn, editor.isActive("bold") && "bg-ink text-gold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            Bold
          </button>
          <button
            type="button"
            className={cn(btn, editor.isActive("italic") && "bg-ink text-gold")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            Italic
          </button>
          <button
            type="button"
            className={cn(
              btn,
              editor.isActive("heading", { level: 2 }) && "bg-ink text-gold"
            )}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            H2
          </button>
          <button
            type="button"
            className={cn(
              btn,
              editor.isActive("bulletList") && "bg-ink text-gold"
            )}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            List
          </button>
          <button
            type="button"
            className={cn(
              btn,
              editor.isActive("blockquote") && "bg-ink text-gold"
            )}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            Quote
          </button>
        </div>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
