import type { Metadata } from "next";
import "./globals.css";
import "@/lib/localStorage-polyfill"; // Polyfill localStorage for SSR
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import { ClientScripts } from "@/components/ClientScripts";
import { RequestProvider } from "@/context/request-context";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "SampleFlow - Creator Product Sample Request",
  description: "Modern platform for creators to request product samples from brands.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-background">
        <RequestProvider>
          <Navbar />
          <main>
            {children}
          </main>
          <Toaster position="top-center" />
        </RequestProvider>
        <ClientScripts />
        <ErrorReporter />
        <VisualEditsMessenger />
      </body>
    </html>
  );
}
