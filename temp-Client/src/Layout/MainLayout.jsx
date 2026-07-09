import { Outlet } from "react-router-dom";
import Footer from "../Pages/Shared/Footer";
import Navbar from "../Pages/Shared/Navbar";

export default function MainLayout() {
  return (
    <div className="font-ysabeau-infant flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow bg-gray-50">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
