import React from "react";
import { Header } from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => (
  <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
    <Header />
    <main className="flex-1 container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {children}
    </main>
  </div>
);
