import Footer from "@/components/Shared/Footer";
import Navbar from "@/components/Shared/Navbar";
import LayoutWraper from "@/components/Layouts/LayoutWraper";
import { Toaster } from "sonner";

const layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    return (
      <div>
        <LayoutWraper>
          {children}
        </LayoutWraper>
      </div>
    );
  };
  
  export default layout;
  