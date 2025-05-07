// ——— React ———
// export { default as React } from "react";
export { default as React, useState } from "react";

// ——— Next/Navigation (Hooks) ———
export { usePathname, useRouter, redirect, } from "next/navigation";

// ——————— MUI Core ———————
export { default as AppBar } from "@mui/material/AppBar";
export { default as Box } from "@mui/material/Box";
export { default as Toolbar } from "@mui/material/Toolbar";
export { default as IconButton } from "@mui/material/IconButton";
export { default as Typography } from "@mui/material/Typography";
export { default as Menu } from "@mui/material/Menu";
export { default as MenuItem } from "@mui/material/MenuItem";
export { default as Button } from "@mui/material/Button";
export { default as Select } from "@mui/material/Select";
export { default as Input } from "@mui/material/Input";
export { default as FormControl } from "@mui/material/FormControl";
export { default as InputLabel } from "@mui/material/InputLabel";
export { default as Checkbox } from "@mui/material/Checkbox";

// ————— MUI Icons —————
export { default as MenuIcon } from "@mui/icons-material/Menu";
export { default as VisibilityIcon } from "@mui/icons-material/Visibility";
export { default as VisibilityOffIcon  } from "@mui/icons-material/VisibilityOff";

export { default as EditIcon } from "@mui/icons-material/Edit";
export { default as DeleteIcon } from "@mui/icons-material/Delete";
// ——— MUI Charts ———
export { PieChart } from "@mui/x-charts";

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


// ——— SCSS Modules ———
export { default as HeaderStyles } from "../../shared/header/header.module.scss";
export { default as CadInvestmentsStyles } from "../../components/cad-investments/cad-investments.module.scss";
export { default as CardBalanceStyles } from "../../components/card-balance/card-balance.module.scss";
export { default as CardListExtractStyles } from "../../components/card-list-extract/card-list-extract.module.scss";
export { default as cardNewTransactionStyles } from "../../components/card-new-transaction/card-new-transaction.module.scss";