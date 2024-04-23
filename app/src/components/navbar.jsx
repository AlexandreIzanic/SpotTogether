import { NavLink } from "react-router-dom";
import { HiBars3 } from "react-icons/hi2";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-[#2D2D2D]  w-48 sticky  flex-shrink-0 overflow-y-auto h-screen  inset-y-0   justify-center text-left hidden md:flex ">
      <div className="flex flex-col text-left gap-10 ">
        <div className="flex flex-col justify-center">
          <NavLink
            to={`/`}
            className={({ isActive }) =>
              isActive
                ? " font-semibold text-lg"
                : "navbar-brand font-semibold text-lg text-[#a9a9a9]"
            }
          >
            Home
          </NavLink>

          {/* <button
            className=" mt-4 font-semibold text-lg text-[#a9a9a9] "
            onClick={() => document.getElementById("my_modal_2").showModal()}
          >
            New List +
          </button> */}

          <NavLink
            to={`/places`}
            className={({ isActive }) =>
              isActive
                ? " font-semibold text-lg"
                : "navbar-brand font-semibold text-lg text-[#a9a9a9]"
            }
          >
            Places
          </NavLink>

          <NavLink
            to={`/public-lists`}
            className={({ isActive }) =>
              isActive
                ? " font-semibold text-lg"
                : "navbar-brand font-semibold text-lg text-[#a9a9a9]"
            }
          >
            Public List
          </NavLink>

          <NavLink
            to={`/events`}
            className={({ isActive }) =>
              isActive
                ? " font-semibold text-lg"
                : "navbar-brand font-semibold text-lg text-[#a9a9a9]"
            }
          >
            Events
          </NavLink>

          <NavLink
            to={`/settings`}
            className={({ isActive }) =>
              isActive
                ? " font-semibold text-lg"
                : "navbar-brand font-semibold text-lg text-[#a9a9a9]"
            }
          >
            Settings
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
