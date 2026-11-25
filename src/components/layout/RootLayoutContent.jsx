"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppFloat from "@/components/layout/WhatsAppFloat";

export default function RootLayoutContent({ children }) {
  const pathname = usePathname();

  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    return children;
  }

  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
