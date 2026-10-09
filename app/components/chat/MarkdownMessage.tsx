import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "~/lib/utils";

interface MarkdownMessageProps {
  content: string;
  className?: string;
}

export function MarkdownMessage({ content, className }: MarkdownMessageProps) {
  return (
    <div className={cn("text-sm leading-relaxed", className)}>
      <ReactMarkdown
        components={{
          p: ({ className: cls, children, ...props }) => (
            <p className={cn("mb-2 last:mb-0", cls)} {...props}>
              {children}
            </p>
          ),
          h1: ({ className: cls, children, ...props }) => (
            <h1
              className={cn("mt-4 mb-2 text-lg font-bold first:mt-0", cls)}
              {...props}
            >
              {children}
            </h1>
          ),
          h2: ({ className: cls, children, ...props }) => (
            <h2
              className={cn("mt-3 mb-2 text-base font-bold first:mt-0", cls)}
              {...props}
            >
              {children}
            </h2>
          ),
          h3: ({ className: cls, children, ...props }) => (
            <h3
              className={cn("mt-2 mb-1 font-semibold first:mt-0", cls)}
              {...props}
            >
              {children}
            </h3>
          ),
          ul: ({ className: cls, children, ...props }) => (
            <ul
              className={cn("mb-2 list-disc pl-5 leading-relaxed", cls)}
              {...props}
            >
              {children}
            </ul>
          ),
          ol: ({ className: cls, children, ...props }) => (
            <ol
              className={cn("mb-2 list-decimal pl-5 leading-relaxed", cls)}
              {...props}
            >
              {children}
            </ol>
          ),
          li: ({ className: cls, children, ...props }) => (
            <li className={cn("leading-relaxed", cls)} {...props}>
              {children}
            </li>
          ),
          strong: ({ className: cls, children, ...props }) => (
            <strong className={cn("font-semibold", cls)} {...props}>
              {children}
            </strong>
          ),
          code: ({ className: cls, children, ...props }) => {
            const text = Array.isArray(children)
              ? children.join("")
              : typeof children === "string"
                ? children
                : "";
            const isInline = !text.includes("\n");
            return isInline ? (
              <code
                className={cn(
                  "rounded bg-white/10 px-1.5 py-0.5 font-mono text-[0.85em]",
                  cls,
                )}
                {...props}
              >
                {children}
              </code>
            ) : (
              <code className={cn("font-mono text-[0.85em]", cls)} {...props}>
                {children}
              </code>
            );
          },
          pre: ({ className: cls, children, ...props }) => (
            <pre
              className={cn(
                "mb-2 overflow-x-auto rounded-lg bg-white/5 p-3 font-mono text-[0.85em] leading-relaxed",
                cls,
              )}
              {...props}
            >
              {children}
            </pre>
          ),
          blockquote: ({ className: cls, children, ...props }) => (
            <blockquote
              className={cn(
                "mb-2 border-l-4 border-white/30 pl-4 text-gray-300",
                cls,
              )}
              {...props}
            >
              {children}
            </blockquote>
          ),
          a: ({ className: cls, children, href, ...props }) => (
            <a
              className={cn("text-blue-400 underline hover:text-blue-300", cls)}
              href={href}
              rel="noopener noreferrer"
              target="_blank"
              {...props}
            >
              {children}
            </a>
          ),
          // Tables
          table: ({ className: cls, children, ...props }) => (
            <div className="mb-2 overflow-x-auto">
              <table
                className={cn(
                  "my-1 w-full border-separate border-spacing-0",
                  cls,
                )}
                {...props}
              >
                {children}
              </table>
            </div>
          ),
          th: ({ className: cls, children, ...props }) => (
            <th
              className={cn(
                "bg-white/10 px-3 py-1.5 text-start font-medium first:rounded-tl-lg last:rounded-tr-lg",
                cls,
              )}
              {...props}
            >
              {children}
            </th>
          ),
          td: ({ className: cls, children, ...props }) => (
            <td
              className={cn(
                "border-s border-b border-white/10 px-3 py-1.5 text-start last:border-e",
                cls,
              )}
              {...props}
            >
              {children}
            </td>
          ),
          tr: ({ className: cls, children, ...props }) => (
            <tr
              className={cn(
                "m-0 border-b p-0 [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg",
                cls,
              )}
              {...props}
            >
              {children}
            </tr>
          ),
        }}
        remarkPlugins={[remarkGfm]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
