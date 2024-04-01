import { NavLink } from "react-router-dom";
import { supabase } from "../helper/supabaseClient";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [lists, setLists] = useState([]);
  const [newList, setNewList] = useState({ Name: "" });

  const add = async () => {
    console.log("test");
    await supabase.from("Lists").insert([newList]);
    fetch();
    document.getElementById("my_modal_2").close();
  };

  const fetch = async () => {
    const { data } = await supabase.from("Lists").select();

    setLists(data);
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-[#2D2D2D]  w-48 justify-center text-left ">
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
          <div className="text-[#a9a9a9] font-light text-sm ">Mes Listes</div>
          {lists.map((list) => (
            <div key={list.id} className="py-1">
              <NavLink
                to={`/lists/${list.id}`}
                className={({ isActive }) =>
                  isActive
                    ? " font-semibold text-lg"
                    : "navbar-brand font-semibold text-lg text-[#a9a9a9]"
                }
              >
                {list.Name}
              </NavLink>
            </div>
          ))}

          <div className="text-[#a9a9a9] font-light text-sm ">
            Mes Listes Partagés
          </div>
          <button
            className=" mt-4 font-semibold text-lg text-[#a9a9a9] "
            onClick={() => document.getElementById("my_modal_2").showModal()}
          >
            New List +
          </button>
        </div>

        <dialog id="my_modal_2" className="modal text-white ">
          <div className="modal-box bg-[#2D2D2D] ">
            <h3 className="font-bold text-lg">Hello!</h3>
            <input
              type="text"
              placeholder="Name"
              className="input w-full max-w-xs"
              onChange={(event) =>
                setNewList({ ...newList, Name: event.target.value })
              }
            />
            <button className="btn btn-neutral" onClick={add}>
              Add
            </button>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </div>
    </nav>
  );
};

export default Navbar;
