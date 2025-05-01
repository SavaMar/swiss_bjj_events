"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import Image from "next/image";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="markdown-content">
      <ReactMarkdown
        components={{
          // Customizing headings
          h1: ({ children, ...props }) => (
            <h1 className="text-3xl font-bold mt-8 mb-4" {...props}>
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2 className="text-2xl font-bold mt-8 mb-3" {...props}>
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 className="text-xl font-bold mt-6 mb-3" {...props}>
              {children}
            </h3>
          ),
          h4: ({ children, ...props }) => (
            <h4 className="text-lg font-semibold mt-6 mb-2" {...props}>
              {children}
            </h4>
          ),
          h5: ({ children, ...props }) => (
            <h5 className="text-base font-semibold mt-4 mb-2" {...props}>
              {children}
            </h5>
          ),
          h6: ({ children, ...props }) => (
            <h6 className="text-base font-medium mt-4 mb-2" {...props}>
              {children}
            </h6>
          ),

          // Paragraphs with special handling for images
          p: ({ children }) => {
            // Check if children contains an image
            const hasImage = React.Children.toArray(children).some(
              (child) => React.isValidElement(child) && child.type === "img"
            );

            // If there's an image, return the children directly without wrapping in p
            if (hasImage) {
              return <>{children}</>;
            }

            // Regular paragraph
            return <p className="my-4 leading-relaxed">{children}</p>;
          },

          // Image component
          img: ({ src, alt }) => {
            if (!src) return null;

            // Use the exact URL if it's already absolute
            const imageUrl = src.startsWith("http")
              ? src
              : `https://filedn.com/lPmOLyYLDG0bQGSveFAL3WB/bjjArticles/${src}`;

            return (
              <div className="my-6">
                <div className="relative w-full" style={{ height: "400px" }}>
                  <Image
                    src={imageUrl}
                    alt={alt || ""}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                    className="mx-auto object-contain rounded-lg"
                    loading="eager"
                    priority={true}
                    quality={90}
                    unoptimized={src.endsWith(".svg")} // Disable optimization for SVG files
                  />
                </div>
                {alt && (
                  <div className="text-center text-sm text-gray-500 mt-2">
                    {alt}
                  </div>
                )}
              </div>
            );
          },

          // Links
          a: ({ href, children, ...props }) => {
            const isInternal = href && !href.startsWith("http");
            if (isInternal) {
              return (
                <Link
                  href={href || ""}
                  className="text-blue-600 hover:underline"
                  {...props}
                >
                  {children}
                </Link>
              );
            }
            return (
              <a
                href={href}
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
                {...props}
              >
                {children}
              </a>
            );
          },

          // Lists
          ul: ({ children, ...props }) => (
            <ul className="list-disc pl-6 my-4" {...props}>
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className="list-decimal pl-6 my-4" {...props}>
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li className="mt-2" {...props}>
              {children}
            </li>
          ),

          // Code blocks - use any since inline is a custom prop
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          code: ({ children, ...props }: any) => {
            const { inline } = props;
            if (inline) {
              return (
                <code
                  className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto my-4">
                <code className="block font-mono text-sm" {...props}>
                  {children}
                </code>
              </pre>
            );
          },

          // Blockquotes
          blockquote: ({ children, ...props }) => (
            <blockquote
              className="border-l-4 border-gray-300 pl-4 py-1 my-4 text-gray-700 italic"
              {...props}
            >
              {children}
            </blockquote>
          ),

          // Tables
          table: ({ children, ...props }) => (
            <div className="overflow-x-auto my-6">
              <table className="w-full border-collapse" {...props}>
                {children}
              </table>
            </div>
          ),
          thead: ({ children, ...props }) => (
            <thead {...props}>{children}</thead>
          ),
          tbody: ({ children, ...props }) => (
            <tbody {...props}>{children}</tbody>
          ),
          tr: ({ children, ...props }) => (
            <tr className="border-b" {...props}>
              {children}
            </tr>
          ),
          th: ({ children, ...props }) => (
            <th
              className="py-2 px-4 text-left font-semibold bg-gray-50"
              {...props}
            >
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td className="py-2 px-4 border-r last:border-r-0" {...props}>
              {children}
            </td>
          ),

          // Horizontal rule
          hr: () => <hr className="my-8 border-t border-gray-300" />,
        }}
      >
        {content || ""}
      </ReactMarkdown>
    </div>
  );
}
