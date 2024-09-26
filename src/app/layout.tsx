import Navigation from "./components/navigation";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { UserProvider } from "./context/UserContext";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DevStorm",
  description: "Project planning app for tech students to explore careers and industries",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{background: "linear-gradient(50deg, rgba(33,42,49,1) 0%, rgba(46,57,68,1) 80%, rgba(18,78,102,1) 100%)"}}>
        <UserProvider>
          <Navigation/>
          {children}
          <Toaster position="top-right" richColors expand={false} theme={"dark"}/>
        </UserProvider>
      </body>
    </html>
  );
}
