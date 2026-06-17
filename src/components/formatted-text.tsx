import { cn } from "@/lib/utils";

function getParagraphs(text: string): string[] {
  const normalized = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
  if (!normalized) return [];

  const byBlankLine = normalized
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (byBlankLine.length > 1) return byBlankLine;

  const bySingleLine = normalized
    .split(/\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (bySingleLine.length > 1) return bySingleLine;

  return byBlankLine.length ? byBlankLine : [normalized];
}

/** Renders plain text with paragraph spacing and preserved line breaks. */
export function FormattedText({
  text,
  className,
  paragraphClassName,
}: {
  text: string;
  className?: string;
  paragraphClassName?: string;
}) {
  const paragraphs = getParagraphs(text);

  if (paragraphs.length === 0) return null;

  if (paragraphs.length === 1) {
    return (
      <p className={cn("whitespace-pre-line", paragraphClassName, className)}>
        {paragraphs[0]}
      </p>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {paragraphs.map((para, i) => (
        <p key={i} className={cn("whitespace-pre-line", paragraphClassName)}>
          {para}
        </p>
      ))}
    </div>
  );
}
