"use client";

interface TiptapRendererProps {
  content: string;
  className?: string;
}

export function TiptapRenderer({ content, className = "" }: TiptapRendererProps) {
  if (!content) return null;
  return (
    <div
      className={`prose prose-slate max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
