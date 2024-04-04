/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Card from "../components/card";
import { supabase } from "../helper/supabaseClient";
import { useParams } from "react-router-dom";

import "mapbox-gl/dist/mapbox-gl.css";
import MapBox from "../components/MapBox";
const ViewerList = () => {
  const { id } = useParams();
  const [places, setPlaces] = useState([]);
  const [list, setList] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [owner, setOwner] = useState(null);
  const [view, setView] = useState("table");

  const fetchList = async () => {
    const { data: list } = await supabase
      .from("Lists")
      .select()
      .eq("id", id)
      .single();
    setList(list);

    const { data: owner } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", list.user_id)
      .single();
    setOwner(owner);
  };

  const fetch = async () => {
    const { data } = await supabase.from("place").select().eq("list_id", id);
    setPlaces(data);
  };

  useEffect(() => {
    fetch();
    fetchList();
  }, [id]);

  return (
    <div className="overflow-y-hidden flex flex-col h-full ">
      <div className="sticky bg-[#1C1C1C] top-0">
        <div className="font-bold text-xl py-4">{list?.Name}</div>
        <div className="font-medium text-[#7480ff]   text-lg ">
          Owner : {owner?.username}
        </div>
        <MapBox
          places={places}
          selectedMarker={selectedMarker}
          setSelectedMarker={setSelectedMarker}
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
                  setSelectedMarker={() => setSelectedMarker(place)}
                />
              </div>
            ))
          : "No places found!"}
      </div>
    </div>
  );
};

export default ViewerList;
