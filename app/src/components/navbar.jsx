import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-[#2D2D2D]  w-48 sticky  flex-shrink-0 overflow-y-auto h-screen  inset-y-0   justify-center text-left hidden md:flex ">
      <div className="flex flex-col text-left gap-10 ">
        <div className="flex flex-col justify-center">
          <LinkTo to="/" label="Home" />
          <LinkTo to="/places" label="Places" />
          <LinkTo to="/public-lists" label="Public List" />
          <LinkTo to="/events" label="Events" />
          <LinkTo to="/settings" label="Settings" />
        </div>
      </div>
    </nav>
  );
};

const LinkTo = ({ to, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive
          ? " font-semibold text-lg"
          : "navbar-brand font-semibold text-lg text-[#a9a9a9]"
      }
    >
      {label}
    </NavLink>
  );
};

export default Navbar;
