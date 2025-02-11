import "./globals.css";
import type { Metadata } from "next";
import AuthProvider from "./providers/AuthProvider";
import { Navbar } from "@/app/_components/navbar";
export const metadata: Metadata = {
  title: "Eventi",
  description: "Event management app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
