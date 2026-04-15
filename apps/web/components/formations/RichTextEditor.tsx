"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { useRef, useState, useCallback } from "react";

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
};

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Décrivez votre produit en détail…",
  minHeight = 320,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [linkInputOpen, setLinkInputOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Image.configure({ inline: false, allowBase64: true, HTMLAttributes: { class: "rounded-lg max-w-full my-3" } }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-[#006e2f] underline" } }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: "rte-content focus:outline-none text-zinc-900 leading-relaxed px-5 py-4",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    immediatelyRender: false,
  });

  const uploadImage = useCallback(async (file: File) => {
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("folder", "portfolio");
      const res = await fetch("/api/upload/image", { method: "POST", body: form });
      const data = await res.json();
      if (data.url) {
        editor?.chain().focus().setImage({ src: data.url }).run();
      } else {
        alert(data.error ?? "Échec de l'upload");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'upload");
    } finally {
      setUploading(false);
    }
  }, [editor]);

  const onFilePicked = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadImage(file);
    e.target.value = "";
  };

  const applyLink = () => {
    if (!linkUrl) {
      editor?.chain().focus().unsetLink().run();
    } else {
      const url = linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`;
      editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
    setLinkInputOpen(false);
    setLinkUrl("");
  };

  if (!editor) return null;

  // Inline styles for rich content (no typography plugin needed)
  const rteStyles = `
    .rte-content { font-size: 15px; }
    .rte-content h1 { font-size: 1.875rem; font-weight: 800; letter-spacing: -0.025em; margin-top: 1.5rem; margin-bottom: 0.5rem; color: #18181b; }
    .rte-content h2 { font-size: 1.5rem; font-weight: 800; letter-spacing: -0.025em; margin-top: 1.25rem; margin-bottom: 0.5rem; color: #18181b; }
    .rte-content h3 { font-size: 1.25rem; font-weight: 700; margin-top: 1rem; margin-bottom: 0.5rem; color: #18181b; }
    .rte-content p { margin-bottom: 0.75rem; }
    .rte-content ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 0.75rem; }
    .rte-content ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 0.75rem; }
    .rte-content li { margin-bottom: 0.25rem; }
    .rte-content li > p { margin-bottom: 0; }
    .rte-content blockquote { border-left: 4px solid #22c55e; padding-left: 1rem; margin: 1rem 0; color: #52525b; font-style: italic; }
    .rte-content a { color: #006e2f; text-decoration: underline; text-underline-offset: 2px; }
    .rte-content strong { font-weight: 700; color: #18181b; }
    .rte-content em { font-style: italic; }
    .rte-content u { text-decoration: underline; }
    .rte-content s { text-decoration: line-through; color: #71717a; }
    .rte-content img { border-radius: 0.5rem; max-width: 100%; height: auto; margin: 0.75rem 0; }
    .rte-content p.is-editor-empty:first-child::before { content: attr(data-placeholder); color: #a1a1aa; pointer-events: none; float: left; height: 0; }
  `;

  const btn = (opts: {
    onClick: () => void;
    active?: boolean;
    icon: string;
    title: string;
    disabled?: boolean;
  }) => (
    <button
      type="button"
      onClick={opts.onClick}
      disabled={opts.disabled}
      title={opts.title}
      className={`p-2 transition-colors disabled:opacity-30 ${
        opts.active ? "bg-[#006e2f] text-white" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
      }`}
    >
      <span className="material-symbols-outlined text-[18px]">{opts.icon}</span>
    </button>
  );

  return (
    <div className="border border-zinc-200 bg-white">
      <style dangerouslySetInnerHTML={{ __html: rteStyles }} />
      {/* Toolbar */}
      <div className="flex items-center flex-wrap gap-px border-b border-zinc-200 bg-[#f9f9f9] px-2 py-1.5">
        {/* Paragraph style dropdown */}
        <select
          value={
            editor.isActive("heading", { level: 1 }) ? "h1" :
            editor.isActive("heading", { level: 2 }) ? "h2" :
            editor.isActive("heading", { level: 3 }) ? "h3" : "p"
          }
          onChange={(e) => {
            const v = e.target.value;
            if (v === "p") editor.chain().focus().setParagraph().run();
            else if (v === "h1") editor.chain().focus().toggleHeading({ level: 1 }).run();
            else if (v === "h2") editor.chain().focus().toggleHeading({ level: 2 }).run();
            else if (v === "h3") editor.chain().focus().toggleHeading({ level: 3 }).run();
          }}
          className="px-2 py-1.5 mr-1 text-xs font-bold text-zinc-900 bg-white border border-zinc-200 outline-none focus:ring-1 focus:ring-[#22c55e] appearance-none cursor-pointer"
        >
          <option value="p">Paragraphe</option>
          <option value="h1">Titre 1</option>
          <option value="h2">Titre 2</option>
          <option value="h3">Titre 3</option>
        </select>

        <div className="w-px h-6 bg-zinc-200 mx-1" />

        {btn({ onClick: () => editor.chain().focus().toggleBold().run(), active: editor.isActive("bold"), icon: "format_bold", title: "Gras (Ctrl+B)" })}
        {btn({ onClick: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive("italic"), icon: "format_italic", title: "Italique (Ctrl+I)" })}
        {btn({ onClick: () => editor.chain().focus().toggleUnderline().run(), active: editor.isActive("underline"), icon: "format_underlined", title: "Souligné (Ctrl+U)" })}
        {btn({ onClick: () => editor.chain().focus().toggleStrike().run(), active: editor.isActive("strike"), icon: "format_strikethrough", title: "Barré" })}
        {btn({ onClick: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive("blockquote"), icon: "format_quote", title: "Citation" })}

        <div className="w-px h-6 bg-zinc-200 mx-1" />

        {btn({ onClick: () => editor.chain().focus().setTextAlign("left").run(), active: editor.isActive({ textAlign: "left" }), icon: "format_align_left", title: "Aligner à gauche" })}
        {btn({ onClick: () => editor.chain().focus().setTextAlign("center").run(), active: editor.isActive({ textAlign: "center" }), icon: "format_align_center", title: "Centrer" })}
        {btn({ onClick: () => editor.chain().focus().setTextAlign("right").run(), active: editor.isActive({ textAlign: "right" }), icon: "format_align_right", title: "Aligner à droite" })}

        <div className="w-px h-6 bg-zinc-200 mx-1" />

        {btn({ onClick: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive("bulletList"), icon: "format_list_bulleted", title: "Liste à puces" })}
        {btn({ onClick: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive("orderedList"), icon: "format_list_numbered", title: "Liste numérotée" })}

        <div className="w-px h-6 bg-zinc-200 mx-1" />

        {btn({
          onClick: () => {
            if (editor.isActive("link")) {
              editor.chain().focus().unsetLink().run();
            } else {
              setLinkUrl("");
              setLinkInputOpen(true);
            }
          },
          active: editor.isActive("link"),
          icon: editor.isActive("link") ? "link_off" : "link",
          title: editor.isActive("link") ? "Retirer le lien" : "Ajouter un lien",
        })}

        {btn({
          onClick: () => fileInputRef.current?.click(),
          icon: uploading ? "hourglass_empty" : "add_photo_alternate",
          title: "Insérer une image",
          disabled: uploading,
        })}
        <input ref={fileInputRef} type="file" accept="image/*" onChange={onFilePicked} className="hidden" />

        <div className="flex-1" />

        {btn({ onClick: () => editor.chain().focus().undo().run(), icon: "undo", title: "Annuler (Ctrl+Z)", disabled: !editor.can().undo() })}
        {btn({ onClick: () => editor.chain().focus().redo().run(), icon: "redo", title: "Refaire (Ctrl+Y)", disabled: !editor.can().redo() })}
      </div>

      {/* Link input row */}
      {linkInputOpen && (
        <div className="flex items-center gap-2 px-3 py-2 bg-[#f9f9f9] border-b border-zinc-200">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">URL</span>
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); applyLink(); }
              if (e.key === "Escape") { setLinkInputOpen(false); setLinkUrl(""); }
            }}
            autoFocus
            placeholder="https://…"
            className="flex-1 bg-white border border-zinc-200 focus:ring-1 focus:ring-[#22c55e] py-1.5 px-3 text-xs text-zinc-900 outline-none"
          />
          <button onClick={applyLink} className="px-3 py-1.5 bg-[#22c55e] text-[#004b1e] text-[10px] font-bold uppercase tracking-widest hover:bg-[#4ae176] transition-colors">
            OK
          </button>
          <button onClick={() => { setLinkInputOpen(false); setLinkUrl(""); }} className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 transition-colors">
            Annuler
          </button>
        </div>
      )}

      {/* Editor canvas */}
      <div className="relative" style={{ minHeight }}>
        <EditorContent editor={editor} />
        {uploading && (
          <div className="absolute top-3 right-3 flex items-center gap-2 bg-zinc-900 text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest">
            <span className="material-symbols-outlined text-[14px] animate-spin">progress_activity</span>
            Upload…
          </div>
        )}
      </div>

      {/* Footer stats */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#f9f9f9] border-t border-zinc-200 text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
        <span>{editor.storage.characterCount?.characters?.() ?? editor.getText().length} caractères</span>
        <span>Glissez-déposez une image ou cliquez sur l&apos;icône</span>
      </div>
    </div>
  );
}
