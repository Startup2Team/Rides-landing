"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { LanguageSwitcher } from "./language-switcher";
import { useTranslations, type Dictionary } from "../i18n/context";
import { RidesWordmark } from "./rides-logo";

function isLinkActive(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

type NavKey = keyof Dictionary["nav"];
type NavChild = { labelKey: NavKey; href: string };
type NavItem = {
  labelKey: NavKey;
  href: string;
  children?: readonly NavChild[];
};

// A parent shows as active whenever any page underneath it is.
function isItemActive(item: NavItem, pathname: string): boolean {
  if (item.children) {
    return item.children.some((c) => isLinkActive(c.href, pathname));
  }
  return isLinkActive(item.href, pathname);
}

const navLinks: readonly NavItem[] = [
  { labelKey: "home", href: "/" },
  {
    labelKey: "about",
    href: "/about",
    children: [
      { labelKey: "company", href: "/about" },
      { labelKey: "howItWorks", href: "/how-it-works" },
      { labelKey: "drivers", href: "/drivers" },
    ],
  },
  { labelKey: "contact", href: "/contact" },
];

function ChevronDownIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

const SCROLL_STASH_KEY = "rides-pending-scroll";

function smoothScrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return false;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  return true;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("nav");
  const [mobileOpen, setMobileOpen] = useState(false);

  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<Map<string, HTMLElement>>(new Map());
  const [openMenu, setOpenMenu] = useState<NavKey | null>(null);
  const [indicator, setIndicator] = useState<{
    left: number;
    width: number;
    ready: boolean;
  }>({ left: 0, width: 0, ready: false });

  // Glass needs something behind it to frost. Sitting at the top of the page
  // there's nothing, so the pill stays light; once content slides underneath it
  // firms up to keep the links legible.
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const repositionIndicator = () => {
    const active = navLinks.find((l) => isItemActive(l, pathname));
    const navEl = navRef.current;
    const linkEl = active ? linkRefs.current.get(active.labelKey) : null;
    if (!active || !navEl || !linkEl) {
      setIndicator((prev) => ({ ...prev, ready: false }));
      return;
    }
    const navBox = navEl.getBoundingClientRect();
    const linkBox = linkEl.getBoundingClientRect();
    setIndicator({
      left: linkBox.left - navBox.left,
      width: linkBox.width,
      ready: true,
    });
  };

  useLayoutEffect(repositionIndicator, [pathname]);

  useEffect(() => {
    window.addEventListener("resize", repositionIndicator);
    return () => window.removeEventListener("resize", repositionIndicator);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const pending = sessionStorage.getItem(SCROLL_STASH_KEY);
    if (!pending) return;
    sessionStorage.removeItem(SCROLL_STASH_KEY);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!smoothScrollToId(pending)) {
          setTimeout(() => smoothScrollToId(pending), 200);
        } else {
          history.replaceState(null, "", `#${pending}`);
        }
      });
    });
  }, [pathname]);

  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  useEffect(() => {
    if (!openMenu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    // Anything outside the desktop nav dismisses it, including the logo and CTA.
    const onPointerDown = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpenMenu(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [openMenu]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  function handleNavClick(
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) {
    setMobileOpen(false);
    const hashIndex = href.indexOf("#");
    if (hashIndex === -1) return;

    e.preventDefault();
    const path = href.substring(0, hashIndex) || "/";
    const hash = href.substring(hashIndex + 1);

    if (pathname === path) {
      if (smoothScrollToId(hash)) {
        history.replaceState(null, "", `#${hash}`);
      }
      return;
    }

    sessionStorage.setItem(SCROLL_STASH_KEY, hash);
    router.push(path);
  }

  return (
    // The header stays click-through so it can't swallow taps on the hero
    // behind it — only the bar and the sheet opt back in.
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div
        aria-hidden
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 bg-foreground/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      <div
        className={`pointer-events-auto relative z-10 border-b transition-[background-color,box-shadow,border-color] duration-300 ${
          scrolled || mobileOpen
            ? "border-glass-border bg-glass-strong shadow-lg shadow-foreground/10 backdrop-blur-3xl backdrop-saturate-150"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
        <Link href="/" className="group relative flex items-center">
          {/* One typeface throughout, three brand colours: blue R, pink id,
              green es. All clear the 3:1 large-text bar at this size. */}
          <RidesWordmark className="text-xl sm:text-2xl" />
        </Link>

        <nav
          ref={navRef}
          className="relative hidden items-center gap-1 lg:flex"
        >
          {navLinks.map((item) => {
            const isActive = isItemActive(item, pathname);
            const linkClass = `relative z-10 rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`;

            if (!item.children) {
              return (
                <Link
                  key={item.labelKey}
                  href={item.href}
                  ref={(el) => {
                    if (el) linkRefs.current.set(item.labelKey, el);
                    else linkRefs.current.delete(item.labelKey);
                  }}
                  onClick={(e) => handleNavClick(e, item.href)}
                  aria-current={isActive ? "page" : undefined}
                  className={linkClass}
                >
                  {t(item.labelKey)}
                </Link>
              );
            }

            const isOpen = openMenu === item.labelKey;
            return (
              // Hover opens it for mice; the button keeps it reachable by
              // keyboard and touch, where there is no hover to rely on.
              <div
                key={item.labelKey}
                className="relative"
                onMouseEnter={() => setOpenMenu(item.labelKey)}
                onMouseLeave={() =>
                  setOpenMenu((k) => (k === item.labelKey ? null : k))
                }
              >
                <button
                  type="button"
                  ref={(el) => {
                    if (el) linkRefs.current.set(item.labelKey, el);
                    else linkRefs.current.delete(item.labelKey);
                  }}
                  onClick={() =>
                    setOpenMenu((k) => (k === item.labelKey ? null : item.labelKey))
                  }
                  aria-expanded={isOpen}
                  aria-haspopup="menu"
                  aria-current={isActive ? "page" : undefined}
                  className={`${linkClass} inline-flex items-center gap-1.5`}
                >
                  {t(item.labelKey)}
                  <ChevronDownIcon
                    className={`h-3 w-3 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* The pt-2 bridges the gap to the panel, so crossing it with
                    the mouse never leaves the group and closes the menu. */}
                <div
                  className={`absolute left-1/2 top-full z-20 -translate-x-1/2 pt-2 transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none ${
                    isOpen
                      ? "pointer-events-auto translate-y-0 opacity-100"
                      : "pointer-events-none -translate-y-1 opacity-0"
                  }`}
                >
                  <div
                    role="menu"
                    aria-label={t(item.labelKey)}
                    className="w-56 rounded-2xl border border-glass-border bg-glass-strong p-1.5 shadow-xl shadow-foreground/10 backdrop-blur-3xl backdrop-saturate-150"
                  >
                    {item.children.map((child) => {
                      const childActive = isLinkActive(child.href, pathname);
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          role="menuitem"
                          tabIndex={isOpen ? 0 : -1}
                          onClick={() => setOpenMenu(null)}
                          aria-current={childActive ? "page" : undefined}
                          className={`flex min-h-11 items-center rounded-xl px-3.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                            childActive
                              ? "bg-primary/10 text-primary ring-1 ring-inset ring-primary/20"
                              : "text-foreground hover:bg-foreground/5"
                          }`}
                        >
                          {t(child.labelKey)}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Same measured left/width as before, grown from a 2px underline into
              a pill that slides between links. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 rounded-full bg-primary/10 ring-1 ring-inset ring-primary/20 transition-[left,width,opacity] duration-300 ease-out motion-reduce:transition-none"
            style={{
              left: indicator.left,
              width: indicator.width,
              opacity: indicator.ready ? 1 : 0,
            }}
          />
        </nav>

        <div className="relative flex items-center gap-2">
          <LanguageSwitcher />

          <Link
            href="/#download"
            onClick={(e) => handleNavClick(e, "/#download")}
            className="hidden h-11 items-center justify-center rounded-full bg-primary-strong px-5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:scale-[1.02] hover:bg-foreground active:scale-[0.98] sm:inline-flex"
          >
            {t("download")}
          </Link>

          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-panel"
            onClick={() => setMobileOpen((v) => !v)}
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-glass-border bg-glass-strong text-foreground transition-colors hover:bg-surface lg:hidden"
          >
            <span className="relative block h-3.5 w-5">
              <span
                aria-hidden
                className={`absolute left-0 top-0 h-[2px] w-5 rounded-full bg-current transition-transform duration-300 ease-out ${
                  mobileOpen ? "translate-y-[6px] rotate-45" : ""
                }`}
              />
              <span
                aria-hidden
                className={`absolute left-0 top-[6px] h-[2px] w-5 rounded-full bg-current transition-opacity duration-200 ${
                  mobileOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                aria-hidden
                className={`absolute left-0 top-[12px] h-[2px] w-5 rounded-full bg-current transition-transform duration-300 ease-out ${
                  mobileOpen ? "-translate-y-[6px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
        </div>
      </div>

      {/* The sheet hangs directly off the bar now, matching its full-bleed
          width instead of floating as a separate card. */}
      <div
        id="mobile-nav-panel"
        className={`pointer-events-auto relative z-10 grid overflow-hidden border-b backdrop-blur-3xl backdrop-saturate-150 transition-[grid-template-rows,opacity,background-color,border-color] duration-300 ease-out motion-reduce:transition-none lg:hidden ${
          mobileOpen
            ? "grid-rows-[1fr] border-glass-border bg-glass-strong opacity-100 shadow-xl shadow-foreground/10"
            : "pointer-events-none grid-rows-[0fr] border-transparent bg-transparent opacity-0"
        }`}
      >
        <div className="min-h-0">
          <nav
            className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:px-6"
            aria-hidden={!mobileOpen}
          >
            {navLinks.map((item) => {
              const rowClass = (active: boolean) =>
                `relative flex min-h-11 items-center rounded-full px-4 py-3 text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary/10 text-primary ring-1 ring-inset ring-primary/20"
                    : "text-foreground hover:bg-foreground/5"
                }`;

              if (!item.children) {
                const isActive = isLinkActive(item.href, pathname);
                return (
                  <Link
                    key={item.labelKey}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    tabIndex={mobileOpen ? 0 : -1}
                    aria-current={isActive ? "page" : undefined}
                    className={rowClass(isActive)}
                  >
                    {t(item.labelKey)}
                  </Link>
                );
              }

              // No room for a hover menu on touch, so the group is spelled out
              // as a labelled block — every destination stays one tap away.
              return (
                <div key={item.labelKey} className="mt-1">
                  <p className="px-4 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {t(item.labelKey)}
                  </p>
                  {item.children.map((child) => {
                    const childActive = isLinkActive(child.href, pathname);
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={(e) => handleNavClick(e, child.href)}
                        tabIndex={mobileOpen ? 0 : -1}
                        aria-current={childActive ? "page" : undefined}
                        className={rowClass(childActive)}
                      >
                        {t(child.labelKey)}
                      </Link>
                    );
                  })}
                </div>
              );
            })}
            <Link
              href="/#download"
              onClick={(e) => {
                setMobileOpen(false);
                handleNavClick(e, "/#download");
              }}
              tabIndex={mobileOpen ? 0 : -1}
              className="mt-2 flex h-12 items-center justify-center rounded-full bg-primary-strong text-sm font-semibold text-primary-foreground shadow-md shadow-primary/30 sm:hidden"
            >
              {t("download")}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
