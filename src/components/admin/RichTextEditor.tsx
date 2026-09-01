"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  TextB,
  TextItalic,
  ListBullets,
  ListNumbers,
  Quotes,
  LinkSimple,
  ArrowCounterClockwise,
  ArrowClockwise,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

function ToolbarButton({
  onClick,
  active,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex size-8 items-center justify-center rounded-md text-ink-700 transition-colors hover:bg-surface-muted disabled:pointer-events-none disabled:opacity-40",
        active && "bg-accent-100 text-accent-700",
      )}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Rédigez le contenu ici...",
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ link: { openOnClick: false, autolink: true } }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "prose-content min-h-[220px] max-w-none px-4 py-3 text-sm text-ink-900 focus:outline-none [&_p]:mt-3 [&_p:first-child]:mt-0 [&_h2]:mt-4 [&_h2]:text-lg [&_h2]:font-semibold [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mt-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_blockquote]:border-l-2 [&_blockquote]:border-accent-500 [&_blockquote]:pl-3 [&_blockquote]:text-ink-500 [&_a]:text-accent-700 [&_a]:underline",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  function setLink() {
    const previousUrl = editor!.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL du lien", previousUrl ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor!.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor!.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  return (
    <div className="overflow-hidden rounded-lg border border-ink-200 bg-surface focus-within:border-accent-500 focus-within:ring-3 focus-within:ring-accent-500/20">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-ink-200 bg-surface-muted/60 p-1.5">
        <ToolbarButton
          label="Gras"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <TextB size={16} weight="bold" />
        </ToolbarButton>
        <ToolbarButton
          label="Italique"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <TextItalic size={16} />
        </ToolbarButton>
        <ToolbarButton
          label="Titre"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <span className="text-xs font-bold">H2</span>
        </ToolbarButton>
        <ToolbarButton
          label="Liste à puces"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <ListBullets size={16} />
        </ToolbarButton>
        <ToolbarButton
          label="Liste numérotée"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListNumbers size={16} />
        </ToolbarButton>
        <ToolbarButton
          label="Citation"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quotes size={16} />
        </ToolbarButton>
        <ToolbarButton label="Lien" active={editor.isActive("link")} onClick={setLink}>
          <LinkSimple size={16} />
        </ToolbarButton>
        <div className="mx-1 h-5 w-px bg-ink-200" />
        <ToolbarButton
          label="Annuler"
          disabled={!editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <ArrowCounterClockwise size={16} />
        </ToolbarButton>
        <ToolbarButton
          label="Rétablir"
          disabled={!editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <ArrowClockwise size={16} />
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
