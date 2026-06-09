import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";


const RootLayout = ({ children }) => {
  return (
    <html
      lang="en"
      className={`h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#080C16] text-white">
        <Navbar />

        <main className="flex-1">{children}</main>

        <Footer />

        <Toaster
          position="top-right"
          richColors
          closeButton
          theme="dark"
          toastOptions={{
            duration: 2500,
            style: {
              background: "#0B1120",
              color: "#F8FAFC",
              border: "1px solid rgba(255,255,255,0.10)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
              zIndex: 999999,
            },
          }}
        />
      </body>
    </html>
  );
};

export default RootLayout;