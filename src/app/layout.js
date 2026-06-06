import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Tiqnora — Event Ticket Booking & Management Platform",
  description:
    "Discover events, book tickets, and manage everything seamlessly with Tiqnora.",
};

const RootLayout = ({ children }) => {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#080C16] text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
};

export default RootLayout;