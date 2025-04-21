// src/app/layout.tsx
import "../styles/globals.css";
import React from "react";

import { geistSans, geistMono, Metadata } from "../components/ui";
import Header  from "../components/header/header";
import Footer  from "../components/footer/footer";

export const metadata: Metadata = {
  title:       "ByteBank",
  description: "Seja bem‑vindo ao ByteBank",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
