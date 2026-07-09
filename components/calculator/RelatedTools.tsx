import Link from 'next/link';

interface Tool {
  label: string;
  href: string;
}

interface RelatedToolsProps {
  tools: Tool[];
}

export default function RelatedTools({ tools }: RelatedToolsProps) {
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {tools.map((tool) => (
        <Link
          key={tool.href}
          href={tool.href}
          className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          {tool.label}
        </Link>
      ))}
    </div>
  );
}