import { HiOutlineTrash } from "react-icons/hi2";
import { FaInstagram } from "react-icons/fa";

const Card = ({ title, instagramUrl, onDelete }) => {
  return (
    <div className=" h-32  bg-[#2D2D2D]  rounded-xl flex gap-7 p-4   ">
      <div className="bg-[#1C1C1C] w-1/5 rounded-xl "></div>
      <div className="flex flex-col gap-2 w-full">
        <div className="text-2xl ">{title}</div>
        <div>
          {instagramUrl && (
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
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
