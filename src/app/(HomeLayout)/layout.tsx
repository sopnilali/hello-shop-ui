import Footer from "@/components/Shared/Footer";
import Navbar from "@/components/Shared/Navbar";

const layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    return (
      <div>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </div>
    );
  };
  
  export default layout;
  