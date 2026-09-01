import Image from "next/image";

type Props = {
  size?: number;
  className?: string;
  alt?: string;
  priority?: boolean;
};

// Pass `size` for a fixed pixel size, or pass Tailwind size classes via
// `className` (e.g. "h-12 w-12 sm:h-16 sm:w-16") for responsive sizing.
export function RidesLogo({
  size,
  className = "",
  alt = "Rides",
  priority = false,
}: Props) {
  const intrinsic = (size ?? 120) * 2;
  return (
    <Image
      src="/ridelogo.png"
      alt={alt}
      width={intrinsic}
      height={intrinsic}
      priority={priority}
      className={`object-contain ${className}`}
      style={size !== undefined && !/[hw]-/.test(className) ? { width: size, height: size } : undefined}
    />
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   The "Rides" wordmark — R in brand blue, "id" in magenta, "es" in emerald.
   Was retyped as three inline <span>s in navbar.tsx, footer.tsx, and
   phone-screens.tsx, with the phone mockup drifting to a raw #007aff for the R.
   Colours resolve to --wordmark-* tokens in globals.css.

   Pass sizing through `className` (e.g. "text-xl sm:text-2xl"); weight and
   tracking are part of the mark and are set here.
──────────────────────────────────────────────────────────────────────────── */
export function RidesWordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-black tracking-[-0.04em] ${className}`}>
      <span style={{ color: "var(--wordmark-r)" }}>R</span>
      <span style={{ color: "var(--wordmark-id)" }}>id</span>
      <span style={{ color: "var(--wordmark-es)" }}>es</span>
    </span>
  );
}
