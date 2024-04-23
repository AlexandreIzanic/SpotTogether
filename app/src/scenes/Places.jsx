import { useEffect, useState } from "react";
import { supabase } from "../helper/supabaseClient";
import Card from "../components/card";
const Places = () => {
  const [places, setPlaces] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [search, setSearch] = useState("");

  const fetchPlaces = async () => {
    let query = supabase
      .from("place")
      .select(
        `
  *, tags:places_tags (tag:tags(id, name))
`
      )
      .order("created_at", { ascending: false })
      .ilike("title", `%${search}%`);

    if (selectedTag) {
      query = supabase
        .from("place")
        .select(
          `
  *, tags:places_tags  (tag:tags(id, name)),
  tagslist:places_tags!inner(tag_id)
`
        )
        .order("created_at", { ascending: false })
        .ilike("title", `%${search}%`)
        .in("tagslist.tag_id", [selectedTag]);
    }

    const { data } = await query;

    setPlaces(data);
  };

  const fetchTags = async () => {
    const { data } = await supabase.from("tags").select("*");
    setTags(data);
  };

  useEffect(() => {
    fetchPlaces();
    fetchTags();
  }, [search, selectedTag]);

  if (!places) return <div>Loading...</div>;
  return (
    <div>
      <input
        type="text"
        placeholder="Name"
        className="input w-full my-3"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      ></input>

      {tags.length ? (
        <div className="flex gap-2 flex-wrap">
          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() =>
                selectedTag === tag.id
                  ? setSelectedTag(null)
                  : setSelectedTag(tag.id)
              }
              className={`rounded-lg my-3 py-2 px-3 font-medium text-xs ${
                selectedTag === tag.id
                  ? "bg-[#7480ff] text-[#1c1c1c]"
                  : "bg-[#2D2D2D] text-white"
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>
      ) : null}

      <div>{places.length} adresses disponibles </div>
      <div className="grid grid-cols-2 gap-4">
        {places.map((place) => (
          <div key={place.id}>
            <Card place={place} />
          </div>
        ))}
      </div>
    </div>
  );
};
export default Places;
