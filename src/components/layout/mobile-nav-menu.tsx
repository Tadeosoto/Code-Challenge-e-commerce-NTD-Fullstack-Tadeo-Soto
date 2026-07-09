"use client";

import Link from "next/link";
import {
  Info,
  LogIn,
  Mail,
  Package,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Upload,
  type LucideIcon,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { useEffect, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import type { AuthUser } from "@/lib/auth/auth-context";

export type MobileNavLink = {
  href: string;
  label: string;
  icon: LucideIcon;
};

type ClipOrigin = {
  x: number;
  y: number;
};

const navVariants: Variants = {
  open: {
    transition: { delayChildren: 0.12, staggerChildren: 0.07 },
  },
  closed: {
    transition: { staggerChildren: 0.04, staggerDirection: -1 },
  },
};

const itemVariants: Variants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 40,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
};

function createSidebarVariants(origin: ClipOrigin): Variants {
  return {
    open: {
      clipPath: `circle(150vmax at ${origin.x}px ${origin.y}px)`,
      transition: {
        type: "spring",
        stiffness: 20,
        restDelta: 2,
      },
    },
    closed: {
      clipPath: `circle(0px at ${origin.x}px ${origin.y}px)`,
      transition: {
        delay: 0.1,
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
  };
}

const pathVariants = {
  closed: { opacity: 1 },
  open: { opacity: 0 },
};

type MobileNavMenuProps = {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  pathname: string;
  publicLinks: MobileNavLink[];
  roleLinks: MobileNavLink[];
  user: AuthUser | null;
};

type PathProps = {
  d?: string;
  variants: Variants;
  transition?: { duration: number };
  animate?: "open" | "closed";
};

function Path({ variants, transition, animate, d }: PathProps) {
  return (
    <motion.path
      fill="transparent"
      strokeWidth="2.5"
      stroke="currentColor"
      strokeLinecap="round"
      d={d}
      variants={variants}
      transition={transition}
      animate={animate}
      initial={false}
    />
  );
}

function MenuToggle({
  isOpen,
  toggle,
  toggleRef,
  className,
  style,
  iconClassName = "text-white",
}: {
  isOpen: boolean;
  toggle: () => void;
  toggleRef?: RefObject<HTMLButtonElement | null>;
  className?: string;
  style?: React.CSSProperties;
  iconClassName?: string;
}) {
  return (
    <button
      ref={toggleRef}
      type="button"
      onClick={toggle}
      style={style}
      className={cn(
        "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition hover:bg-white/10 md:hidden",
        iconClassName,
        className,
      )}
      aria-expanded={isOpen}
      aria-controls="mobile-nav-overlay"
      aria-label={isOpen ? "Close menu" : "Open menu"}
    >
      <svg className="h-[18px] w-[18px]" viewBox="0 0 23 23" aria-hidden="true">
        <Path
          variants={{
            closed: { d: "M 2 2.5 L 20 2.5" },
            open: { d: "M 3 16.5 L 17 2.5" },
          }}
          animate={isOpen ? "open" : "closed"}
        />
        <Path
          d="M 2 9.423 L 20 9.423"
          variants={pathVariants}
          transition={{ duration: 0.1 }}
          animate={isOpen ? "open" : "closed"}
        />
        <Path
          variants={{
            closed: { d: "M 2 16.346 L 20 16.346" },
            open: { d: "M 3 2.5 L 17 16.346" },
          }}
          animate={isOpen ? "open" : "closed"}
        />
      </svg>
    </button>
  );
}

function FloatingMenuToggle({
  isOpen,
  toggle,
  origin,
}: {
  isOpen: boolean;
  toggle: () => void;
  origin: ClipOrigin;
}) {
  if (!isOpen) return null;

  return (
    <MenuToggle
      isOpen={isOpen}
      toggle={toggle}
      className="fixed z-[210] bg-charcoal/95 text-white shadow-lg hover:bg-charcoal"
      style={{
        left: Math.max(origin.x - 18, 8),
        top: Math.max(origin.y - 18, 8),
      }}
    />
  );
}

function MenuItem({
  link,
  active,
  onNavigate,
  reduceMotion,
}: {
  link: MobileNavLink;
  active: boolean;
  onNavigate: () => void;
  reduceMotion: boolean;
}) {
  const Icon = link.icon;

  const content = (
    <Link
      href={link.href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-4 rounded-2xl px-2 py-2 transition-colors",
        active ? "text-charcoal" : "text-charcoal/85 hover:text-charcoal",
      )}
    >
      <span
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2",
          active
            ? "border-lavender-dark bg-lavender text-charcoal"
            : "border-charcoal/10 bg-white text-charcoal",
        )}
      >
        <Icon className="h-4 w-4" />
      </span>
      <span className="font-mono-body text-base font-medium">{link.label}</span>
    </Link>
  );

  if (reduceMotion) {
    return <li className="list-none">{content}</li>;
  }

  return (
    <motion.li variants={itemVariants} className="list-none">
      {content}
    </motion.li>
  );
}

function MobileNavOverlay({
  isOpen,
  onClose,
  pathname,
  publicLinks,
  roleLinks,
  user,
  origin,
  reduceMotion,
}: {
  isOpen: boolean;
  onClose: () => void;
  pathname: string;
  publicLinks: MobileNavLink[];
  roleLinks: MobileNavLink[];
  user: AuthUser | null;
  origin: ClipOrigin;
  reduceMotion: boolean;
}) {
  const allLinks = [
    ...publicLinks,
    ...roleLinks,
    ...(user ? [] : [{ href: "/login", label: "Login", icon: LogIn }]),
  ];

  const sidebarVariants = createSidebarVariants(origin);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          key="mobile-nav-backdrop"
          className="fixed inset-0 z-[200] md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.2 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-charcoal/40"
            onClick={onClose}
            aria-label="Close menu"
          />

          <motion.nav
            id="mobile-nav-overlay"
            initial="closed"
            animate="open"
            exit="closed"
            className="pointer-events-none absolute inset-0"
          >
            <motion.div
              className="pointer-events-auto absolute inset-0 bg-cream"
              variants={reduceMotion ? undefined : sidebarVariants}
              initial={reduceMotion ? false : "closed"}
              animate={reduceMotion ? undefined : "open"}
              exit={reduceMotion ? undefined : "closed"}
            />

            <motion.ul
              className="pointer-events-auto absolute inset-x-0 top-0 bottom-0 list-none overflow-y-auto px-6 pt-28 pb-10"
              variants={reduceMotion ? undefined : navVariants}
              initial={reduceMotion ? false : "closed"}
              animate={reduceMotion ? undefined : "open"}
              exit={reduceMotion ? undefined : "closed"}
            >
              <motion.li
                variants={reduceMotion ? undefined : itemVariants}
                className="mb-6 list-none"
              >
                <p className="font-serif-display text-2xl text-charcoal">Menu</p>
                <p className="font-mono-body mt-1 text-sm text-muted">
                  Explore the catalog and company pages.
                </p>
              </motion.li>

              {allLinks.map((link) => (
                <MenuItem
                  key={link.href}
                  link={link}
                  active={pathname === link.href}
                  onNavigate={onClose}
                  reduceMotion={reduceMotion ?? false}
                />
              ))}

              {user ? (
                <motion.li
                  variants={reduceMotion ? undefined : itemVariants}
                  className="mt-6 list-none border-t border-charcoal/10 pt-6"
                >
                  <p className="font-mono-body px-2 text-xs text-muted">
                    Signed in as{" "}
                    <span className="font-medium text-charcoal">
                      {user.role === "SELLER" ? user.sellerName : user.username}
                    </span>{" "}
                    ({user.role})
                  </p>
                </motion.li>
              ) : null}
            </motion.ul>
          </motion.nav>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function MobileNavMenu({
  isOpen,
  onToggle,
  onClose,
  pathname,
  publicLinks,
  roleLinks,
  user,
}: MobileNavMenuProps) {
  const reduceMotion = useReducedMotion();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);
  const [clipOrigin, setClipOrigin] = useState<ClipOrigin>({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleToggle() {
    if (!isOpen && toggleRef.current) {
      const rect = toggleRef.current.getBoundingClientRect();
      setClipOrigin({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }
    onToggle();
  }

  useEffect(() => {
    if (!toggleRef.current) return;

    function updateOrigin() {
      const rect = toggleRef.current?.getBoundingClientRect();
      if (!rect) return;
      setClipOrigin({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }

    updateOrigin();

    if (!isOpen) return;

    window.addEventListener("resize", updateOrigin);
    window.addEventListener("scroll", updateOrigin, { passive: true });

    return () => {
      window.removeEventListener("resize", updateOrigin);
      window.removeEventListener("scroll", updateOrigin);
    };
  }, [isOpen]);

  const overlay =
    mounted && typeof document !== "undefined"
      ? createPortal(
          <>
            <MobileNavOverlay
              isOpen={isOpen}
              onClose={onClose}
              pathname={pathname}
              publicLinks={publicLinks}
              roleLinks={roleLinks}
              user={user}
              origin={clipOrigin}
              reduceMotion={reduceMotion ?? false}
            />
            <FloatingMenuToggle isOpen={isOpen} toggle={handleToggle} origin={clipOrigin} />
          </>,
          document.body,
        )
      : null;

  return (
    <>
      <MenuToggle
        isOpen={isOpen}
        toggle={handleToggle}
        toggleRef={toggleRef}
        className={isOpen ? "pointer-events-none invisible" : undefined}
      />
      {overlay}
    </>
  );
}

export const mobilePublicLinks: MobileNavLink[] = [
  { href: "/shop", label: "Shop", icon: ShoppingBag },
  { href: "/why-us", label: "Why Us", icon: Sparkles },
  { href: "/about", label: "About Us", icon: Info },
  { href: "/contact", label: "Contact", icon: Mail },
];

export function getMobileRoleLinks(user: AuthUser | null): MobileNavLink[] {
  if (user?.role === "SELLER") {
    return [{ href: "/seller/products", label: "My Products", icon: Package }];
  }
  if (user?.role === "OWNER") {
    return [
      { href: "/owner/approvals", label: "Approvals", icon: ShieldCheck },
      { href: "/owner/import", label: "Import CSV", icon: Upload },
    ];
  }
  return [];
}
