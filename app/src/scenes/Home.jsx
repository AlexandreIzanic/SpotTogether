import toast from "react-hot-toast";
import { supabase } from "../helper/supabaseClient";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState(null);
  const [friends, setFriends] = useState([]);
  const [invitations, setInvitations] = useState([]);

  const [filter, setFilter] = useState({ email: "" });

  const fetchUserId = async () => {
    const { data } = await supabase.auth.getUser();
    setUserId(data.user.id);
  };
  const fetchUser = async () => {
    const { data } = await supabase
      .from("profiles")
      .select()
      .eq("id", userId)
      .single();

    setUser(data);
  };

  const fetchAllUsers = async () => {
    if (filter.email) {
      const { data } = await supabase
        .from("profiles")
        .select()
        .neq("id", userId)
        .ilike("email", `%${filter.email}%`);
      setUsers(data);
      return;
    }

    setUsers(null);
  };

  const fetchFriends = async () => {
    const { data: friendsIds } = await supabase
      .from("friendship")
      .select("friend_id")
      .eq("id", userId)
      .eq("Status", "ACCEPTED");

    const { data: friends } = await supabase
      .from("profiles")
      .select()
      .in(
        "id",
        friendsIds.map((d) => d.friend_id)
      );

    setFriends(friends);
  };

  const addFriend = async (id) => {
    const { error } = await supabase
      .from("friendship")
      .insert([{ id: userId, friend_id: id }]);
    if (error) {
      toast.error("Error adding friend!");
      return;
    }

    fetchFriends();
    toast.success("Successfully added!");
  };

  const deleteFriend = async (id) => {
    if (!window.confirm("Are you sure you want to delete this friend?")) return;

    await supabase
      .from("friendship")
      .delete()
      .eq("friend_id", id)
      .eq("id", userId);

    await supabase
      .from("friendship")
      .delete()
      .eq("id", id)
      .eq("friend_id", userId);

    fetchFriends();
    toast.success("Successfully deleted!");
  };

  const fetchUsersInvitations = async () => {
    const { data: invitations } = await supabase
      .from("friendship")
      .select("id")
      .eq("friend_id", userId)
      .eq("Status", "PENDING");

    const { data: usersInvitations } = await supabase
      .from("profiles")
      .select()
      .in(
        "id",
        invitations.map((d) => d.id)
      );

    setInvitations(usersInvitations);
  };

  const acceptInvitation = async (id) => {
    await supabase
      .from("friendship")
      .update({ Status: "ACCEPTED" })
      .eq("id", id)
      .eq("friend_id", userId);

    await supabase
      .from("friendship")
      .insert([{ id: userId, friend_id: id, Status: "ACCEPTED" }]);

    fetchUsersInvitations();
    fetchFriends();
    toast.success("Successfully accepted!");
  };

  const declineInvitation = async (id) => {
    await supabase
      .from("friendship")
      .delete()
      .eq("id", id)
      .eq("friend_id", userId);
    fetchUsersInvitations();
    toast.success("Successfully declined!");
  };

  useEffect(() => {
    fetchAllUsers();
  }, [filter]);

  useEffect(() => {
    fetchUserId();
    fetchUser();
    fetchFriends();

    fetchUsersInvitations();
  }, [userId]);

  const [view, setView] = useState("friends");

  if (!user || !friends) return <div>Loading...</div>;
  return (
    <>
      <div className="flex  h-full justify-between items-center m-auto max-w-fit gap-x-14 ">
        <AllUsers
          users={users}
          addFriend={addFriend}
          filter={filter}
          setFilter={setFilter}
        />

        <MyLists />
        <div className="flex flex-col">
          <div
            className="btn btn-neutral"
            onClick={() => document.getElementById("my_modal_2").showModal()}
          >
            New Friends
          </div>
          <div className="flex gap-4 mb-4">
            <div role="tablist" className="tabs tabs-bordered w-auto gap-1">
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
                aria-label="Invitations"
                onClick={() => setView("Invitations")}
              />
            </div>
          </div>
          {view === "friends" && (
            <Friends friends={friends} deleteFriend={deleteFriend} />
          )}

          {view === "Invitations" && (
            <FriendsInvitations
              invitations={invitations}
              acceptInvitation={acceptInvitation}
              declineInvitation={declineInvitation}
            />
          )}
        </div>
      </div>
    </>
  );
};

const MyLists = () => {
  const [lists, setLists] = useState([]);
  const [listsPublic, setListsPublic] = useState([]);
  const [newList, setNewList] = useState({ Name: "" });
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);
  };
  const add = async () => {
    await supabase
      .from("Lists")
      .insert([{ Name: newList.Name, user_id: user.id }]);
    fetch();
    document.getElementById("my_modal_2").close();
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const fetch = async () => {
    const { data } = await supabase
      .from("Lists")
      .select()
      .eq("user_id", user.id)
      .eq("privacy", "PRIVATE");
    setLists(data);
  };

  const fetchListsPublic = async () => {
    const { data } = await supabase
      .from("Lists")
      .select()
      .eq("user_id", user.id)
      .eq("privacy", "PUBLIC");
    setListsPublic(data);
  };
  useEffect(() => {
    fetch();
    fetchListsPublic();
  }, [user]);

  return (
    <div className="flex flex-col rounded-lg  bg-[#2D2D2D] p-6">
      <div className="text-[#a9a9a9] font-light text-sm ">Mes Listes</div>
      {lists.map((list) => (
        <div key={list.id} className="py-1">
          <Link
            to={`/lists/${list.id}`}
            className="font-semibold text-lg text-[#a9a9a9] hover:text-white"
          >
            {list.Name}
          </Link>
        </div>
      ))}

      <div className="text-[#a9a9a9] font-light text-sm ">
        Mes Listes Partagés
      </div>

      {listsPublic.map((list) => (
        <div key={list.id} className="py-1">
          <Link
            to={`/lists/${list.id}`}
            className="font-semibold text-lg text-[#a9a9a9] hover:text-white"
          >
            {list.Name}
          </Link>
        </div>
      ))}
    </div>
  );
};
const AllUsers = ({ users, addFriend, filter, setFilter }) => {
  return (
    <>
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box bg-[#1c1c1c]">
          <div className="flex flex-col">
            <div className="font-bold text-lg pb-4">Search Friends</div>
            <input
              type="text"
              placeholder="Search Friends by Email"
              className="input w-full "
              value={filter.email || ""}
              onChange={(event) => setFilter({ email: event.target.value })}
            ></input>
            <div className=" overflow-x-auto   rounded-xl bg-[#2D2D2D] mt-4  ">
              <table className="table">
                <tbody>
                  {users?.map((user) => (
                    <tr key={user.id} className="hover">
                      <td>{user.email}</td>

                      <td>
                        <button onClick={() => addFriend(user.id)}>
                          Add Friend
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

const Friends = ({ friends, deleteFriend }) => {
  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto max-w-80  rounded-xl bg-[#2D2D2D] ">
        <table className="table">
          <thead>
            <tr></tr>
          </thead>
          <tbody>
            {friends?.map((user) => (
              <tr key={user.id} className="hover">
                <td>{user.email}</td>
                <td>
                  <button onClick={() => deleteFriend(user.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const FriendsInvitations = ({
  invitations,
  acceptInvitation,
  declineInvitation,
}) => {
  return (
    <div className="flex flex-col">
      <div className="font-bold">
        {invitations.length ? "Friends invitations" : "0 Friends invitations"}
      </div>
      <div className="overflow-x-auto max-w-80  rounded-xl bg-[#2D2D2D]">
        <table className="table">
          <tbody>
            {invitations?.map((user) => (
              <tr key={user.id} className="hover">
                <td>{user.email}</td>

                <td>
                  <button onClick={() => acceptInvitation(user.id)}>
                    Accept
                  </button>
                  <button onClick={() => declineInvitation(user.id)}>
                    Decline
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
