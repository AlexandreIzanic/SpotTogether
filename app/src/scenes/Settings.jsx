import { useEffect, useState } from "react";
import { supabase } from "../helper/supabaseClient";

const Settings = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [password, setPassword] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetch();
  }, []);

  const handlePasswordChange = async () => {
    const { data, error } = await supabase.auth.updateUser({
      password: password,
    });
    setError(error);
    console.log(data, error);
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>Settings</h1>
      <div>{user.email}</div>
      <input
        type="password"
        placeholder="New Password"
        className="input w-full max-w-xs"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {password}
      {error && <div>{error.message}</div>}
      <button
        className="btn btn-neutral"
        onClick={() => handlePasswordChange()}
      >
        btn
      </button>

      <button
        className="underline text-red-200"
        onClick={() => supabase.auth.signOut()}
      >
        Sign Out
      </button>
    </div>
  );
};
export default Settings;
