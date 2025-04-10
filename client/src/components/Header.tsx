import React, { ReactNode, useState } from "react";
import { FaUser } from "react-icons/fa6";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import { logoutUser } from "../utils/logoutUser";
import NavBar from "./NavBar";

const Header: React.FC<{ username: string; children: ReactNode }> = ({
  username,
}) => {
  const selectProperty = (state: RootState) => state.auth.user;
  const user = useSelector(selectProperty);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <header className="bg-gradient-to-r from-green-700 to-green-400 text-white p-3">
        <div className="flex justify-between items-center">
          {user && (
            <div className="flex items-center md:hidden justify-between space-x-4">
              <button
                type="button"
                className="bg-gray-600 px-3 py-1 rounded"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                ☰
              </button>
            </div>
          )}
          <div className="text-lg font-bold">
            <a href={username ? "" : "/"} className="text-white">
              HarvestHub
            </a>
          </div>

          <div className="relative">
            <button
              type="button"
              className="flex items-center focus:outline-none"
              onClick={toggleDropdown}
            >
              <FaUser />
              <span className="ml-2">{username}</span>
              {dropdownOpen ? (
                <IoIosArrowUp style={{ marginTop: "2px" }} />
              ) : (
                <IoIosArrowDown style={{ marginTop: "2px" }} />
              )}
            </button>
            {dropdownOpen && (
              <div className="absolute z-2 right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg">
                <a href={user?.role === 'farmer' ? "/profile" : "/my-profile"} className="block px-4 py-2 hover:bg-gray-200">
                  Account
                </a>
                <button
                  type="button"
                  onClick={logoutUser}
                  className="bg-green-700 text-start rounded w-full font-semibold text-white px-3 py-1"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <NavBar wrapperClassName="visible md:hidden" setIsSidebarOpen={setIsSidebarOpen} isSidebarOpen={isSidebarOpen} />
    </>
  );
};

export default Header;
