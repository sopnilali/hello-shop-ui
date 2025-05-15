import React from "react";
import Link from "next/link";
import { X } from "lucide-react"; // Optional: use any icon library you prefer
import { usePathname } from "next/navigation";
import { MdCategory, MdDiscount, MdMovie, MdPerson, MdRateReview, MdSpaceDashboard } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { useAppSelector } from "@/components/Redux/hooks";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const user = useAppSelector((state) => state.auth.user) as User | null;
  const pathname = usePathname();

  const menuItems = [
    { name: "Overview", icon: <MdSpaceDashboard />, link: "/dashboard" },
    { name: "Products", icon: <MdMovie />, link: "/dashboard/products" },
    { name: "Brand & Category", icon: <MdRateReview />, link: "/dashboard/brand-category" },
    { name: "Discount", icon: <MdDiscount />, link: "/dashboard/discount" },
  ];

  // Add Users route only for ADMIN role
  if (user?.role === "ADMIN") {
    menuItems.splice(2, 0, { name: "Users", icon: <FaUsers />, link: "/dashboard/users" });
  }

  return (
    <aside
      className={`fixed z-40 top-0 left-0 h-full w-64 bg-gray-900 border-r border-gray-700 transform transition-transform duration-300 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 lg:static lg:block`}
    >
      <div className="relative p-6 h-full flex flex-col">
        {/* Close Button (visible only on mobile) */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white lg:hidden"
          onClick={toggleSidebar}
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">
            {user?.role === "ADMIN" ? "Admin Dashboard" : user?.role === "SELLER" ? "Seller Dashboard" : "Dashboard"}
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 border-t pt-2 border-gray-700">
          {menuItems?.map((item) => (
            <Link
              key={item?.name}
              href={`${item.link}`}
              className={`flex items-center gap-3 p-3 rounded-lg ${pathname === item.link ? "bg-gray-700" : ""} hover:bg-gray-700 transition-colors text-gray-300 hover:text-white`}
            >
              <span className="material-icons-outlined">
              {item?.icon}
              </span>
              {item?.name}
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
              <span className="text-gray-300">⚙️</span>
            </div>
            <span className="text-sm text-gray-300">Settings</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
