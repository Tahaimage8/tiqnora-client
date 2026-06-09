import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";


const RootLayout = ({ children }) => {
  return (
    <html
      lang="en"
    >
      <body className="">
        <Navbar />

        <main className="flex-1">{children}</main>

        <Footer />

       
      </body>
    </html>
  );
};

export default RootLayout;