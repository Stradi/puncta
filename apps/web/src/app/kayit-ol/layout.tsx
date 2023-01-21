"use client";

import { SignUpProvider } from "@/context/SignUpContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SignUpProvider>{children}</SignUpProvider>;
}
