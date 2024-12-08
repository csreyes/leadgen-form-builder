import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OpenPipe - Train Faster, Cheaper Models",
  description:
    "OpenPipe helps you fine-tune and deploy models that are faster and cheaper than GPT-4, trained on your production data.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Toaster />
        {children}
      </body>
    </html>
  );
}
