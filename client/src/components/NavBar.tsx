import React from 'react'
import { Link, useLocation } from 'react-router-dom';
import { RootState } from '../redux/store';
import { useSelector } from 'react-redux';

interface Nav {
  wrapperClassName: string;
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const NavBar: React.FC<Nav> = ({ isSidebarOpen, setIsSidebarOpen, wrapperClassName = "" }) => {
  const selectProperty = (state: RootState) => state.auth.user;
  const user = useSelector(selectProperty);
  const location = useLocation();
  const { pathname } = location;
  type Role = "buyer" | "farmer";
  const links: Record<Role, { to: string; label: string; tooltip: string }[]> =
    {
      buyer: [
        { to: "/mybookings", label: "B", tooltip: "My Bookings" },
        { to: "/addbookings", label: "B", tooltip: "add book" },
        { to: "/my-profile", label: "P", tooltip: "Update Profile" },
      ],
      farmer: [
        { to: "/addproduct", label: "A", tooltip: "Added Products" },
        { to: "/FarmerDashboard", label: "D", tooltip: "Dashboard" },
        { to: "/profile", label: "P", tooltip: "Update Profile" },
      ],
    };
  return (
    <div className={wrapperClassName}>
      <aside
        className={`fixed md:h-full md:relative bg-gradient-to-t from-green-300 to-green-700 text-white transform ${
          isSidebarOpen ? "translate-x-0 z-2" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <nav className="flex flex-col flex-shrink-0 h-full px-2 py-4 items-center justify-center flex-1 space-y-1">
          {links[user?.role as Role]?.map(
            (link: { to: string; label: string; tooltip: string }) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={`hover:bg-gray-600 p-3 mb-2 rounded inline-block text-xl font-bold tracking-wider  uppercase text-white ${
                  pathname === link.to ? "bg-gray-600" : ""
                }`}
                data-tooltip-id="tooltip" // Link to the tooltip
                data-tooltip-content={link.tooltip} // Add tooltip text
              >
                {link.label}
              </Link>
            )
          )}
        </nav>
      </aside>
    </div>
  )
}

export default NavBar;