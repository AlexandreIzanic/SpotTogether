import { HiOutlineTrash } from "react-icons/hi2";
import { FaInstagram } from "react-icons/fa";
import { HiMapPin } from "react-icons/hi2";
const Card = ({
  title,
  instagramUrl,
  onDelete,
  longitude,
  lattitude,
  setSelectedMarker,
}) => {
  return (
    <div className=" h-32  bg-[#2D2D2D]  rounded-xl flex gap-7 p-4   ">
      <div className="bg-[#1C1C1C] w-1/5 rounded-xl "></div>
      <div className="flex flex-col gap-2 w-full">
        <div className="text-2xl ">{title}</div>
        <div className="flex gap-2">
          {instagramUrl && (
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
          )}
          {longitude && lattitude && (
            <button onClick={setSelectedMarker}>
              <HiMapPin />
            </button>
          )}
        </div>
      </div>

      <button className="" onClick={onDelete}>
        <HiOutlineTrash className="text-red-500" />
      </button>
    </div>
  );
};
export default Card;
