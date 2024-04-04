import { FaInstagram } from "react-icons/fa";

const Popup = ({ place, setSelectedMarker }) => {
  if (!place) return null;

  return (
    <div className=" text-white  rounded-xl w-[20vw] bg-[#7480ff] p-4 ">
      <div className="font-bold text-xl">{place.title}</div>
      {place.instagram_url && (
        <a href={place.instagram_url} target="_blank" rel="noopener noreferrer">
          <FaInstagram />
        </a>
      )}
      <button onClick={() => setSelectedMarker(null)}> Unmark</button>
    </div>
  );
};
export default Popup;
