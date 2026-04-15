"use client";

interface FormationRichEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export function FormationRichEditor({ content = "", onChange, placeholder, className = "" }: FormationRichEditorProps) {
  return (
    <textarea
      className={`w-full min-h-[200px] p-4 border border-gray-200 rounded-xl text-sm resize-y focus:outline-none focus:border-[#006e2f] ${className}`}
      value={content}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder ?? "Écrivez votre contenu..."}
    />
  );
}
