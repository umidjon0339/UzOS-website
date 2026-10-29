import Image, { type StaticImageData } from "next/image";

// A screenshot in a simple window frame (three dots and a title).
export function Screenshot({
  src,
  title,
  priority = false,
  className = "",
}: {
  src: StaticImageData;
  title: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <figure
      className={`overflow-hidden rounded-xl bg-slate-900 shadow-2xl shadow-slate-900/20 ring-1 ring-slate-900/10 dark:ring-white/10 ${className}`}
    >
      <figcaption className="flex items-center gap-1.5 border-b border-white/5 bg-slate-800 px-3 py-2">
        <span className="size-2.5 rounded-full bg-flag-red/80" />
        <span className="size-2.5 rounded-full bg-amber-400/80" />
        <span className="size-2.5 rounded-full bg-leaf-500/80" />
        <span className="ml-2 truncate text-xs text-slate-400">{title}</span>
      </figcaption>
      <Image
        src={src}
        alt={title}
        priority={priority}
        sizes="(min-width: 1024px) 600px, 100vw"
        className="block h-auto w-full [image-rendering:pixelated]"
      />
    </figure>
  );
}
