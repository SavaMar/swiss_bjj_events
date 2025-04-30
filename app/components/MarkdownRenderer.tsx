"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { ComponentProps } from "react";

interface MarkdownRendererProps {
  content: string;
}

// Types for ReactMarkdown components
type ComponentPropsWithoutNode<T extends keyof JSX.IntrinsicElements> = Omit<
  ComponentProps<T>,
  "node"
> & { children?: React.ReactNode };

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const components = {
    // Customizing headings
    h1: (props: ComponentPropsWithoutNode<"h1">) => (
      <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />
    ),
    h2: (props: ComponentPropsWithoutNode<"h2">) => (
      <h2 className="text-2xl font-bold mt-8 mb-3" {...props} />
    ),
    h3: (props: ComponentPropsWithoutNode<"h3">) => (
      <h3 className="text-xl font-bold mt-6 mb-3" {...props} />
    ),
    h4: (props: ComponentPropsWithoutNode<"h4">) => (
      <h4 className="text-lg font-semibold mt-6 mb-2" {...props} />
    ),
    h5: (props: ComponentPropsWithoutNode<"h5">) => (
      <h5 className="text-base font-semibold mt-4 mb-2" {...props} />
    ),
    h6: (props: ComponentPropsWithoutNode<"h6">) => (
      <h6 className="text-base font-medium mt-4 mb-2" {...props} />
    ),

    // Paragraphs and text
    p: (props: ComponentPropsWithoutNode<"p">) => (
      <p className="my-4 leading-relaxed" {...props} />
    ),

    // Links
    a: ({
      href,
      ...props
    }: ComponentPropsWithoutNode<"a"> & { href?: string }) => {
      const isInternal = href && !href.startsWith("http");
      if (isInternal) {
        return (
          <Link
            href={href}
            className="text-blue-600 hover:underline"
            {...props}
          />
        );
      }
      return (
        <a
          href={href}
          className="text-blue-600 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
          {...props}
        />
      );
    },

    // Lists
    ul: (props: ComponentPropsWithoutNode<"ul">) => (
      <ul className="list-disc pl-6 my-4" {...props} />
    ),
    ol: (props: ComponentPropsWithoutNode<"ol">) => (
      <ol className="list-decimal pl-6 my-4" {...props} />
    ),
    li: (props: ComponentPropsWithoutNode<"li">) => (
      <li className="mt-2" {...props} />
    ),

    // Code blocks
    code: ({
      inline,
      children,
      ...props
    }: ComponentPropsWithoutNode<"code"> & { inline?: boolean }) => {
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
    blockquote: (props: ComponentPropsWithoutNode<"blockquote">) => (
      <blockquote
        className="border-l-4 border-gray-300 pl-4 py-1 my-4 text-gray-700 italic"
        {...props}
      />
    ),

    // Images
    img: ({
      src,
      alt,
      ...props
    }: ComponentPropsWithoutNode<"img"> & { src?: string; alt?: string }) => {
      if (!src) return null;

      return (
        <div className="my-6">
          <img
            src={src}
            alt={alt || ""}
            className="mx-auto rounded-lg max-w-full h-auto"
            loading="lazy"
            {...props}
          />
          {alt && (
            <p className="text-center text-sm text-gray-500 mt-2">{alt}</p>
          )}
        </div>
      );
    },

    // Tables
    table: (props: ComponentPropsWithoutNode<"table">) => (
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse" {...props} />
      </div>
    ),
    thead: (props: ComponentPropsWithoutNode<"thead">) => <thead {...props} />,
    tbody: (props: ComponentPropsWithoutNode<"tbody">) => <tbody {...props} />,
    tr: (props: ComponentPropsWithoutNode<"tr">) => (
      <tr className="border-b" {...props} />
    ),
    th: (props: ComponentPropsWithoutNode<"th">) => (
      <th className="py-2 px-4 text-left font-semibold bg-gray-50" {...props} />
    ),
    td: (props: ComponentPropsWithoutNode<"td">) => (
      <td className="py-2 px-4 border-r last:border-r-0" {...props} />
    ),

    // Horizontal rule
    hr: () => <hr className="my-8 border-t border-gray-300" />,
  };

  return (
    <div className="markdown-content">
      <ReactMarkdown components={components}>{content || ""}</ReactMarkdown>
    </div>
  );
}
