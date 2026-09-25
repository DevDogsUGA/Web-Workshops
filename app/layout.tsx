import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DevDogs at UGA Workshops",
  description: "Starter code and finished workshops from DevDogs at UGA.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
