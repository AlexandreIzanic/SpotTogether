/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Card from "../components/card";
import { supabase } from "../helper/supabaseClient";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { id } = useParams();
  const [places, setPlaces] = useState([]);

  const fetch = async () => {
    const { data } = await supabase.from("place").select().eq("list_id", id);
    setPlaces(data);
  };

  const onDelete = async (id) => {
    await supabase.from("place").delete().eq("id", id);
    fetch();
    toast.success("Successfully deleted!");
  };

  useEffect(() => {
    fetch();
  }, [id]);

  return (
    <div className="">
      <FiltersBar fetch={fetch} listId={id} />
      {places.length
        ? places.map((place) => (
            <div key={place.id} className="py-4">
              <Card
                title={place.title}
                instagramUrl={place.instagram_url}
                onDelete={() => onDelete(place.id)}
              />
            </div>
          ))
        : "No places found!"}
    </div>
  );
};

const FiltersBar = ({ fetch, listId }) => {
  const navigate = useNavigate();
  const [newPlace, setNewPlace] = useState({
    title: null,
    instagram_url: null,
  });
  const add = async () => {
    await supabase.from("place").insert([
      {
        title: newPlace.title,
        list_id: listId,
        instagram_url: newPlace.instagram_url,
      },
    ]);
    fetch();
    setNewPlace({ title: null, type: null });
    toast.success("Successfully created!");
  };

  const deleteList = async () => {
    await supabase.from("Lists").delete().eq("id", listId);
    fetch();
    toast.success("Successfully deleted!");
    navigate("/");
  };

  return (
    <div className="flex justify-between">
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Name"
          className="input w-full max-w-xs"
          value={newPlace.title || ""}
          onChange={(event) =>
            setNewPlace({ ...newPlace, title: event.target.value })
          }
        />

        <input
          type="text"
          placeholder="Instagram URL"
          className="input w-full max-w-xs"
          value={newPlace.instagram_url || ""}
          onChange={(event) =>
            setNewPlace({ ...newPlace, instagram_url: event.target.value })
          }
        />

        <button className="btn btn-neutral" onClick={add}>
          +
        </button>

        <button className="btn btn-danger" onClick={deleteList}>
          Delete List
        </button>
      </div>
    </div>
  );
};

export default Home;
