import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ToastProvider } from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: "StudyPilot AI — Advanced PDF Studio & AI Image Studio",
  description:
    "Unified browser-first AI workspace for students and researchers. Edit PDFs, annotate, extract text, summarize with AI, and retouch images.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100">
        <ToastProvider>
          <Navbar />
          <div className="flex-1 flex flex-col">{children}</div>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
