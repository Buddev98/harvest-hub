import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Link, useLocation } from "react-router-dom";
import { Tooltip as ReactTooltip } from 'react-tooltip';
import Loader from "./Loader";
import { FaUserDoctor } from "react-icons/fa6";
import { logoutUser } from "../utils/logoutUser";
import { refreshToken } from "../utils/refreshToken";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const selectProperty = (state: RootState) => state.auth.user;
  const user = useSelector(selectProperty);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { pathname } = location;
  type Role = "buyer" | "farmer";

  const links: Record<Role, { to: string; label: string; tooltip: string }[]> = {
    buyer: [
      
      { to: "/myappointments", label: "A", tooltip: "My Appointments" },
    
    ],
    farmer: [
      { to: "/addproduct", label: "A", tooltip: "Added Products" },
      { to: "/FarmerDashboard", label: "D", tooltip: "Dashboard" },
      
    ],
  };
  

  const handleSessionExpiry = async () => {
    const userChoice = window.confirm("Your session is about to expire. You will lose any unsaved changes. Do you want to refresh your session?");
    if (userChoice) {
      await refreshToken();
    } else {
      await logoutUser();
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const interval = setInterval(() => {
      handleSessionExpiry();
    }, 14 * 60 * 1000); // Check every 14 minutes

    return () => { 
      document.body.style.overflow = 'auto';
      clearInterval(interval);
    }
  }, []);


  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="sticky bg-gradient-to-r from-green-700 to-green-400 text-white p-2 flex flex-col md:flex-row justify-between items-center top-0 left-0 fixed  w-full shadow-md z-50">
        <div className="flex">
          <h5 className="flex mb-0"><FaUserDoctor style={{ marginRight: '5px' }} /> HarvestHub</h5>
        </div>
        {user && (
          <div className="flex items-center justify-between space-x-4">
            <span className="font-semibold">Welcome, {user.username}!</span>
            <button
              type="button"
              className="bg-blue-600 px-3 py-1 rounded md:hidden"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              ☰
            </button>
            <button
              type="button"
              onClick={logoutUser}
              className="bg-green-700 font-semibold text-white px-3 py-1 rounded hidden md:block"
            >
              Logout
            </button>
          </div>
        )}
      </header>
      <div className="flex flex-1">
        <aside
          className={`fixed md:relative bg-gradient-to-t from-green-300 to-green-700 text-white transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 transition-transform duration-300 ease-in-out`}
        >
          <nav className="flex flex-col flex-shrink-0 h-full px-2 py-4 items-center justify-center flex-1 space-y-1">
            {links[user?.role as Role]?.map(
              (link: { to: string; label: string; tooltip: string }) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className={`hover:bg-gray-600 p-3 mb-0 rounded inline-block text-xl font-bold tracking-wider  uppercase block text-white ${
                    pathname === link.to ? "bg-gray-600" : ""
                  }`}
                  data-tooltip-id="tooltip" // Link to the tooltip
                  data-tooltip-content={link.tooltip} // Add tooltip text
                >
                  {link.label}
                </Link>
              )
            )}
            <button
              onClick={logoutUser}
              className="bg-green-900 text-white px-3 py-1 rounded md:hidden visible"
            >
              Logout
            </button>
          </nav>
        </aside>
        {/* Main Content */}
        <div id="mainloader" className="hidden fixed inset-0 flex justify-center items-center">
              <Loader />
          </div>
        <main className="flex-1 p-4  mt-4">{children}</main>
      </div>
      <ReactTooltip id="tooltip" place="right"/>
    </div>
  );
};

export default Layout;