// ——— React ———
export { default as React } from "react";

// ——— Next/Navigation (Hooks) ———
export { useRouter } from "next/navigation";

// ——————— MUI ———————
export { default as AppBar } from "@mui/material/AppBar";
export { default as Box } from "@mui/material/Box";
export { default as Toolbar } from "@mui/material/Toolbar";
export { default as IconButton } from "@mui/material/IconButton";
export { default as Typography } from "@mui/material/Typography";
export { default as Menu } from "@mui/material/Menu";
export { default as MenuItem } from "@mui/material/MenuItem";
export { default as Button } from "@mui/material/Button";

// ————— MUI Icons —————
export { default as MenuIcon } from "@mui/icons-material/Menu";

// ——— Next/Image & Link ———
export { default as Image } from "next/image";
export { default as Link } from "next/link";

// ——— Tipos do Next ———
export type { Metadata } from "next";

// ——— Google Fonts ———
import { Inter, Roboto_Mono } from "next/font/google";

export const geistSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const geistMono = Roboto_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
