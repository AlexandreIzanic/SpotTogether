import { useEffect, useState } from "react";
import { supabase } from "../helper/supabaseClient";
import { Link } from "react-router-dom";

const PublicLists = () => {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("friends");

  const fetchUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div>
      <div role="tablist" className="tabs tabs-bordered w-10">
        <input
          type="radio"
          name="my_tabs_1"
          role="tab"
          className="tab"
          onClick={() => setView("friends")}
          aria-label="Friends"
          defaultChecked
        />

        <input
          type="radio"
          name="my_tabs_1"
          role="tab"
          className="tab"
          aria-label="World"
          onClick={() => setView("world")}
        />
      </div>

      {view === "friends" && <Table user={user} />}
    </div>
  );
};

const Table = ({ user }) => {
  const [listsFriends, setListsFriends] = useState([]);

  const fetch = async () => {
    if (!user) return;
    const { data: friendsIds } = await supabase
      .from("friendship")
      .select("friend_id")
      .eq("id", user.id);

    const { data } = await supabase
      .from("Lists")
      .select()
      .eq("privacy", "PUBLIC")
      .in(
        "user_id",
        friendsIds.map((f) => f.friend_id)
      );

    for (const list of data) {
      const { data: user } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", list.user_id)
        .single();
      list.owner = user.username;
    }

    setListsFriends(data);
  };

  useEffect(() => {
    fetch();
  }, [user]);

  return (
    <div>
      <div className="overflow-x-auto   rounded-xl bg-[#2D2D2D] mt-4">
        <table className="table ">
          <thead>
            <tr>
              <th>Name</th>
              <th>Owner</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {listsFriends.map((list) => (
              <tr key={list.id} className="hover">
                <td className="font-bold text-xl">
                  <Link to={`/lists/${list.id}`}>{list.Name}</Link>
                </td>
                <td className="text-gray-400">{list.owner} </td>

                <td className="text-gray-400">{list.created_at} </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PublicLists;
