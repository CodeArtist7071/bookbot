import React, { useMemo, useState } from "react";

type AvatarProps = {
  src?: string | null;
  alt: string;
  name?: string | null;
  className?: string;
  fallbackClassName?: string;
};

function getInitials(name?: string | null) {
  const trimmed = (name ?? "").trim();
  if (!trimmed) return "?";
  const parts = trimmed.split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase()).join("") || "?";
}

function colorFromString(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  const hue = hash % 360;
  return `hsl(${hue} 65% 92%)`;
}

export default function Avatar({
  src,
  alt,
  name,
  className = "h-24 w-24 rounded-full object-cover",
  fallbackClassName = "h-24 w-24 rounded-full flex items-center justify-center font-bold text-slate-700",
}: AvatarProps) {
  const [errored, setErrored] = useState(false);
  const initials = useMemo(() => getInitials(name ?? alt), [name, alt]);
  const bg = useMemo(() => colorFromString(name ?? alt), [name, alt]);

  if (!src || errored) {
    return (
      <div className={fallbackClassName} style={{ background: bg }} aria-label={alt}>
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setErrored(true)}
      loading="lazy"
    />
  );
}

