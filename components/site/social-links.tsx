import { SOCIALS, type SocialKey } from "@/lib/content";
import { SOCIAL_ICONS } from "./icons";
import { cn } from "@/lib/utils";

const ORDER: SocialKey[] = [
  "spotify",
  "appleMusic",
  "youtube",
  "instagram",
  "tiktok",
  "facebook",
];

export function SocialLinks({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md";
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {ORDER.map((key) => {
        const Icon = SOCIAL_ICONS[key];
        const { label, url } = SOCIALS[key];
        return (
          <a
            key={key}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
            className={cn(
              "glass flex items-center justify-center rounded-full text-foreground/70 transition-all hover:text-primary hover:scale-105 hover:text-glow",
              size === "sm" ? "size-9" : "size-11"
            )}
          >
            <Icon className={size === "sm" ? "size-4" : "size-5"} />
          </a>
        );
      })}
    </div>
  );
}
