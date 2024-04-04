const Popup = ({ place, setSelectedMarker }) => {
  if (!place) return null;
  return (
    <div className=" text-white  rounded-xl w-[20vw] bg-[#2D2D2D] ">
      <div className="font-bold text-xl">{place.title}</div>
      <button onClick={() => setSelectedMarker(null)}> Unmark</button>
    </div>
  );
};
export default Popup;
