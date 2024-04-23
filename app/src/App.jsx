import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar";
import Home from "./scenes/Home";
import List from "./scenes/List";
import Settings from "./scenes/Settings";
import { useEffect, useState } from "react";
import { supabase } from "./helper/supabaseClient";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import PublicLists from "./scenes/PublicLists";
import ViewerList from "./scenes/ViewerList";
import Events from "./scenes/Events";
import Places from "./scenes/Places";

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session)
    return (
      <div className="w-80   h-full m-auto  ">
        <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />
      </div>
    );

  return (
    <div className="bg-[#1C1C1C] text-white  flex h-screen  ">
      <BrowserRouter>
        <Navbar />
        <div className="max-w-7xl mx-auto w-full h-full  py-4 flex-1 p-6 overflow-y-auto   ">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/places" element={<Places />} />
            <Route path="/lists/:id" element={<List />} />
            <Route path="/public-lists/:id" element={<ViewerList />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/public-lists" element={<PublicLists />} />
            <Route path="/events" element={<Events />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
