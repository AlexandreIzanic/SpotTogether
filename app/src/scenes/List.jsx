/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Card from "../components/card";
import { supabase } from "../helper/supabaseClient";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import "mapbox-gl/dist/mapbox-gl.css";
import MapBox from "../components/MapBox";
import Popup from "../components/Popup";
const Home = () => {
  const { id } = useParams();
  const [places, setPlaces] = useState([]);
  const [list, setList] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);

  const fetchList = async () => {
    const { data } = await supabase
      .from("Lists")
      .select()
      .eq("id", id)
      .single();
    setList(data);
  };

  const fetch = async () => {
    const { data } = await supabase.from("place").select().eq("list_id", id);
    setPlaces(data);
  };

  const onDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this place?")) return;

    await supabase.from("place").delete().eq("id", id);
    fetch();
    toast.success("Successfully deleted!");
  };

  const handleChangePrivacy = async () => {
    console.log(id);
    const newPrivacy = list.privacy === "PUBLIC" ? "PRIVATE" : "PUBLIC";
    await supabase
      .from("Lists")
      .update({ privacy: newPrivacy })
      .eq("id", id)
      .single();
    fetchList();
  };

  useEffect(() => {
    fetch();
    fetchList();
  }, [id]);

  const [view, setView] = useState("table");

  return (
    <div className="">
      <div className="font-bold text-xl py-4">{list?.Name}</div>

      <MapBox
        places={places}
        selectedMarker={selectedMarker}
        setSelectedMarker={setSelectedMarker}
      />

      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text font-bold text-xl py-4">
            {list?.privacy}
          </span>
          <input
            type="checkbox"
            className="toggle toggle-primary"
            checked={list?.privacy === "PUBLIC"}
            onChange={handleChangePrivacy}
          />
        </label>
      </div>

      <FiltersBar fetch={fetch} listId={id} />
      <div role="tablist" className="tabs tabs-bordered w-10">
        <input
          type="radio"
          name="my_tabs_1"
          role="tab"
          className="tab"
          onClick={() => setView("table")}
          aria-label="Table"
          defaultChecked
        />

        <input
          type="radio"
          name="my_tabs_1"
          role="tab"
          className="tab"
          aria-label="Grid"
          onClick={() => setView("grid")}
        />
      </div>
      <div className={`${view === "table" ? "" : " grid grid-cols-2 gap-4"}`}>
        {places.length
          ? places.map((place) => (
              <div
                key={place.id}
                className={`${view === "table" ? "py-4" : ""}`}
              >
                <Card
                  title={place.title}
                  instagramUrl={place.instagram_url}
                  longitude={place.longitude}
                  lattitude={place.lattitude}
                  onDelete={() => onDelete(place.id)}
                  setSelectedMarker={() => setSelectedMarker(place)}
                />
              </div>
            ))
          : "No places found!"}
      </div>
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
    if (!window.confirm("Are you sure you want to delete this List?")) return;
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
