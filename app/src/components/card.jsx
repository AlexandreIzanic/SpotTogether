import { HiOutlineTrash } from "react-icons/hi2";
import { FaInstagram } from "react-icons/fa";
import { HiMapPin } from "react-icons/hi2";
import { HiLink } from "react-icons/hi2";
const Card = ({ onDelete, place, setSelectedMarker, selectedMarker }) => {
  return (
    <div
      className={` h-32    rounded-xl flex gap-7 p-4 ${
        selectedMarker === place ? "bg-[#7480ff]" : "bg-[#2D2D2D]"
      }  `}
    >
      <div className="bg-[#1C1C1C] w-1/5 min-w-28       rounded-xl ">
        {place.background_url && (
          <img
            src={place.background_url}
            className="w-full h-full rounded-xl min-w-10 border-none object-cover "
          ></img>
        )}
      </div>
      <div className="flex flex-col gap-2 w-full">
        <div className="flex gap-4  ">
          <div className=" text-base md:text-2xl ">{place.title}</div>

          {place.tags?.length
            ? place.tags.map(({ tag }) => (
                <div
                  key={tag.id}
                  className={` md:block hidden  rounded-lg  py-2 px-3 font-medium text-xs ${
                    selectedMarker === place
                      ? "bg-[#2D2D2D] text-white"
                      : "bg-[#7480ff] text-[#1c1c1c] "
                  } `}
                >
                  {tag.name}
                </div>
              ))
            : null}
        </div>

        <div className="flex gap-2">
          {place.instagram_url && (
            <a
              href={place.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram />
            </a>
          )}

          {place.website && (
            <a href={place.website} target="_blank" rel="noopener noreferrer">
              <HiLink />
            </a>
          )}

          {place.longitude && place.lattitude && (
            <button onClick={setSelectedMarker}>
              <HiMapPin />
            </button>
          )}
        </div>
        {place.description && (
          <div className="text-xs text-gray-400">{place.description}</div>
        )}
      </div>

      {onDelete && (
        <button className="" onClick={onDelete}>
          <HiOutlineTrash className="text-red-500" />
        </button>
      )}
    </div>
  );
};
export default Card;
