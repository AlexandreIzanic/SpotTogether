import { HiOutlineTrash } from "react-icons/hi2";
import { FaInstagram } from "react-icons/fa";
import { HiMapPin } from "react-icons/hi2";
import { HiLink } from "react-icons/hi2";
const Card = ({ onDelete, place, setSelectedMarker }) => {
  return (
    <div className=" h-32  bg-[#2D2D2D]  rounded-xl flex gap-7 p-4   ">
      <div className="bg-[#1C1C1C] w-1/5 rounded-xl "></div>
      <div className="flex flex-col gap-2 w-full">
        <div className="flex gap-4  ">
          <div className="text-2xl ">{place.title}</div>
          {/* TAG */}
          <div className="bg-[#7480ff] text-[#1c1c1c]  rounded-lg  py-2 px-3 font-medium text-xs">
            {place.type}
          </div>
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
