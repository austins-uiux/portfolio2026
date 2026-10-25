// Adapted from shadcn/ui (MIT). See vendor/shadcn/LICENSE.md.
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
