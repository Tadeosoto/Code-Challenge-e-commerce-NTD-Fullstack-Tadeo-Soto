import { ShoppingBag, Store, ShieldCheck, type LucideIcon } from "lucide-react";

export type DemoRole = "BUYER" | "SELLER" | "OWNER";

export type RoleOption = {
  role: DemoRole;
  title: string;
  description: string;
  icon: LucideIcon;
};

export const ROLE_OPTIONS: RoleOption[] = [
  {
    role: "BUYER",
    title: "Buyer",
    description: "Browse the shop, add items to cart, and complete mock checkout.",
    icon: ShoppingBag,
  },
  {
    role: "SELLER",
    title: "Seller",
    description: "Create and manage your products. Each seller gets a unique ID (seller1, seller2…).",
    icon: Store,
  },
  {
    role: "OWNER",
    title: "Owner",
    description: "Approve seller products before they go live and import the CSV catalog.",
    icon: ShieldCheck,
  },
];

export const ROLE_PICKER_DISMISSED_KEY = "ntd-role-picker-dismissed";
