import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Import custom fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Login Page for HeadCount",
  description: "Login to access the HeadCount dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Flexbox to center content */}
        <div className="flex items-center justify-center min-h-screen p-8">
          {/* This renders the children, e.g., Login component */}
          {children}
        </div>
      </body>
    </html>
  );
}
