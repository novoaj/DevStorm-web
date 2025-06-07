import Navigation from "./components/navigation";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ClientProviders } from "./client-providers";
import { checkAuthCookies } from "./actions/actions";

const inter = Inter({ subsets: ["latin"], preload: false });

export const metadata: Metadata = {
  title: "DevStorm - Brainstorming platform for tech projects for students",
  description: "Project planning app for tech students to explore careers and industries",
};

// This is a SERVER component
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // This runs on the server
  const initialLoggedIn = await checkAuthCookies();
  
  return (
    <html lang="en">
      <body className="bg-primary-300">
        {/* Pass server-rendered data to client providers */}
        <ClientProviders initialLoggedIn={initialLoggedIn}>
          <Navigation/>
          {children} {/* children can still be server components! */}
          <Toaster position="top-right" richColors expand={false} theme={"dark"}/>
        </ClientProviders>
      </body>
    </html>
  );
}
