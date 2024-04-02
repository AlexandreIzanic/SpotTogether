import toast from "react-hot-toast";
import { supabase } from "../helper/supabaseClient";
import { useEffect, useState } from "react";
const Home = () => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState(null);
  const [friends, setFriends] = useState([]);
  const [invitations, setInvitations] = useState([]);

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
    const { data } = await supabase.from("profiles").select();
    setUsers(data);
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
    fetchUserId();
    fetchUser();
    fetchAllUsers();
    fetchFriends();

    fetchUsersInvitations();
  }, [userId]);

  if (!user || !friends || !users) return <div>Loading...</div>;
  return (
    <>
      <div>Logged in as {user.email}!</div>
      <AllUsers users={users} addFriend={addFriend} />
      <Friends friends={friends} deleteFriend={deleteFriend} />

      <FriendsInvitations
        invitations={invitations}
        acceptInvitation={acceptInvitation}
        declineInvitation={declineInvitation}
      />
    </>
  );
};

const AllUsers = ({ users, addFriend }) => {
  return (
    <>
      ALL USERS
      <div className=" overflow-x-auto max-w-80 border rounded-xl bg-[#2D2D2D]  ">
        <table className="table">
          <thead>
            <tr>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user.id} className="hover">
                <td>{user.email}</td>

                <td>
                  <button onClick={() => addFriend(user.id)}>Add Friend</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

const Friends = ({ friends, deleteFriend }) => {
  return (
    <>
      <div className="font-bold ">Friends</div>
      <div className="overflow-x-auto max-w-80 border rounded-xl bg-[#2D2D2D] ">
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
    </>
  );
};

const FriendsInvitations = ({
  invitations,
  acceptInvitation,
  declineInvitation,
}) => {
  return (
    <>
      FRIENDS INVITATIONS
      <div className="overflow-x-auto max-w-80 border rounded-xl bg-[#2D2D2D]">
        <table className="table">
          <thead>
            <tr>
              <th>Email</th>
            </tr>
          </thead>
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
    </>
  );
};

export default Home;
