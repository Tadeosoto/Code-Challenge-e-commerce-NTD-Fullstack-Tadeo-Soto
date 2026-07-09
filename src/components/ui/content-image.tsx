import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

type ContentImageProps = Omit<ImageProps, "src" | "alt"> & {
  src: string;
  alt: string;
  rounded?: "2xl" | "3xl" | "[2.5rem]";
  priority?: boolean;
};

export function ContentImage({
  src,
  alt,
  className,
  rounded = "[2.5rem]",
  priority = false,
  ...props
}: ContentImageProps) {
  const radius =
    rounded === "2xl" ? "rounded-2xl" : rounded === "3xl" ? "rounded-3xl" : "rounded-[2.5rem]";

  return (
    <div className={cn("relative overflow-hidden", radius, className)}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover"
        {...props}
      />
    </div>
  );
}
