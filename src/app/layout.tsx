import Navigation from "./components/navigation";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { UserProvider } from "./context/UserContext";
import { TaskProvider } from "./context/TaskContext";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DevStorm - Brainstorming platform for tech projects for students",
  description: "Project planning app for tech students to explore careers and industries",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
//rgba(33,42,49,1)
  return (
    <html lang="en">
      <body style={{background: "radial-gradient(circle at bottom, rgba(23,29,34,1) 0%, rgba(23,29,34,1) 85%, rgba(18,78,102,1) 100%)"}}>
        <UserProvider> 
          <Navigation/>
          <TaskProvider>
            {children}
          </TaskProvider>
          <Toaster position="top-right" richColors expand={false} theme={"dark"}/>
        </UserProvider>
      </body>
    </html>
  );
}
