"use client";

export function Heading({ level = "h1", children, className = "" }) {
  const Tag = level;

  return (
    <Tag
      className={`text-[var(--foreground)] transition-colors duration-300 ${className}`}
    >
      {children}
    </Tag>
  );
}
