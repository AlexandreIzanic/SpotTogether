/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Card from "../components/card";
import { supabase } from "../helper/supabaseClient";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { HiMiniPencilSquare } from "react-icons/hi2";

import { setDefaults, fromAddress } from "react-geocode";

import "mapbox-gl/dist/mapbox-gl.css";
import MapBox from "../components/MapBox";
const Home = () => {
  const { id } = useParams();
  const [places, setPlaces] = useState([]);
  const [list, setList] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);

  setDefaults({
    key: "AIzaSyDuLTp6CauR2-u9imascGH48-6aITfD4Po", // Your Google API key here.
    language: "fr",
    region: "fr",
  });

  const fetchList = async () => {
    const { data } = await supabase
      .from("Lists")
      .select()
      .eq("id", id)
      .single();
    setList(data);
  };

  const fetch = async () => {
    const { data } = await supabase
      .from("place")
      .select(
        `
    *, tags:places_tags (tag:tags(id, name))
  `
      )
      .eq("list_id", id);
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

  const handleChangeName = async () => {
    console.log(id);
    console.log(list);
    const newName = list.Name;
    await supabase
      .from("Lists")
      .update({ Name: newName })
      .eq("id", id)
      .single();
    fetchList();
    toast.success("Successfully updated!");
  };

  useEffect(() => {
    fetch();
    fetchList();
  }, [id]);

  const [view, setView] = useState("table");
  const [viewEdit, setViewEdit] = useState(false);

  const [tempoMarker, setTempoMarker] = useState("");

  return (
    <div className="overflow-y-hidden flex flex-col h-full ">
      <div className="sticky bg-[#1C1C1C] top-0">
        <div className="flex items-center gap-2">
          {viewEdit ? (
            <>
              <input
                type="text"
                className="input w-full max-w-xs my-4"
                value={list?.Name}
                onChange={(event) =>
                  setList({ ...list, Name: event.target.value })
                }
              />
              <button onClick={handleChangeName}>New Name</button>
            </>
          ) : (
            <div className="font-bold text-xl py-4">{list?.Name}</div>
          )}
          <HiMiniPencilSquare
            className="cursor-pointer"
            onClick={() => setViewEdit(!viewEdit)}
          />
        </div>
        <MapBox
          places={places}
          selectedMarker={selectedMarker}
          setSelectedMarker={setSelectedMarker}
          tempoMarker={tempoMarker}
        />

        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text font-bold text-xl py-4  ">
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

        <FiltersBar
          fetch={fetch}
          listId={id}
          tempoMarker={tempoMarker}
          setTempoMarker={setTempoMarker}
        />
        <div role="tablist" className="tabs tabs-bordered w-10 gap-1">
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
      </div>

      <div
        className={`${
          view === "table"
            ? "  overflow-y-auto "
            : "overflow-y-auto  grid grid-cols-2 gap-4 py-4"
        }`}
      >
        {places.length
          ? places.map((place) => (
              <div
                key={place.id}
                className={`${view === "table" ? "py-4" : ""}`}
              >
                <Card
                  place={place}
                  onDelete={() => onDelete(place.id)}
                  setSelectedMarker={() => setSelectedMarker(place)}
                  selectedMarker={selectedMarker}
                />
              </div>
            ))
          : "No places found!"}
      </div>
    </div>
  );
};

const FiltersBar = ({ fetch, listId, tempoMarker, setTempoMarker }) => {
  const navigate = useNavigate();
  const [newPlace, setNewPlace] = useState({
    title: null,
    instagram_url: null,
  });
  const add = async () => {
    if (!tempoMarker) {
      toast.error("Please set a marker on the map!");
      return;
    }

    await supabase.from("place").insert([
      {
        title: newPlace.title,
        list_id: listId,
        instagram_url: newPlace.instagram_url,
        website: newPlace.website,
        lattitude: tempoMarker.lat,
        longitude: tempoMarker.lng,
      },
    ]);
    setTempoMarker("");
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

  const [tempoAdresse, setTempoAdresse] = useState("");

  console.log(tempoAdresse);

  // Get latitude & longitude from address.

  const adressToLatLng = () => {
    fromAddress(tempoAdresse)
      .then(({ results }) => {
        const { lat, lng } = results[0].geometry.location;
        console.log(lat, lng);
        setTempoMarker({ lat, lng });
      })
      .catch(console.error);
  };

  return (
    <div className="md:flex hidden justify-between">
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

        <input
          type="text"
          placeholder="Website"
          className="input w-full max-w-xs"
          value={newPlace.website || ""}
          onChange={(event) =>
            setNewPlace({ ...newPlace, website: event.target.value })
          }
        />

        <div className=" w-full max-w-xs relative">
          <button
            onClick={() => adressToLatLng()}
            className="top-[-28px] text-[#7480ff] underline font-bold absolute"
          >
            Set Marker
          </button>
          <input
            type="text"
            placeholder="Adresse"
            className="input w-full max-w-xs"
            value={tempoAdresse || ""}
            onChange={(event) => setTempoAdresse(event.target.value)}
          />
        </div>

        <button className="btn btn-neutral" onClick={add}>
          +
        </button>

        <button
          className="btn btn-danger bg-[#7480ff] text-white"
          onClick={deleteList}
        >
          Delete List
        </button>
      </div>
    </div>
  );
};

export default Home;
