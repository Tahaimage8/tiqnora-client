import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";


const RootLayout = ({ children }) => {
  return (
    <html
      lang="en"
    >
      <body className="min-h-full flex flex-col bg-[#080C16] text-white">
        <Navbar />

        <main className="flex-1">{children}</main>

        <Footer />

       
      </body>
    </html>
  );
};

export default RootLayout;