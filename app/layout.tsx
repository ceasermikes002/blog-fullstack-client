import { ClerkProvider, SignInButton, SignedOut } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Blog Client",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={raleway.className}>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <Header />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
