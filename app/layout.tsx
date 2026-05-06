import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import ClientInit from "@/components/ClientInit";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AppProvider } from "@/components/AppProvider";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Forehand – Tournament Hub",
  description: "Your all-in-one tournament hub. Manage. Play. Compete.",
  manifest: "/manifest.json",
  icons: {
    icon: "/pwa-icons/icon-192.png",
    shortcut: "/pwa-icons/icon-192.png",
    apple: "/pwa-icons/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#FF7A1A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://fonts.cdnfonts.com/css/zalando-sans" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var s=localStorage.getItem('forehand:theme');var d=document.documentElement;if(s==='dark')d.classList.add('dark');else if(s==='light')d.classList.remove('dark');else if(window.matchMedia('(prefers-color-scheme: dark)').matches)d.classList.add('dark');else d.classList.remove('dark');})();`,
          }}
        />
      </head>
      <body className={`${dmSans.variable} subpixel-antialiased`}>
        <AppProvider>
          <ThemeProvider>
            <ClientInit />
            {children}
          </ThemeProvider>
        </AppProvider>
      </body>
    </html>
  );
}

