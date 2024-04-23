import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import Popup from "./Popup";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWxleGFuZHJlLWl6YyIsImEiOiJjbHVrM2Fod2swamxjMmtsbXh4Y3dxYmEyIn0.FTKlr6wwlsAeXnurfl027A";
const MapBox = ({ places, selectedMarker, setSelectedMarker, tempoMarker }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(2.333333);
  const [lat, setLat] = useState(48.866667);
  const [zoom, setZoom] = useState(11);

  useEffect(() => {
    if (selectedMarker) {
      map.current.flyTo({
        center: [selectedMarker.longitude, selectedMarker.lattitude],
      });
    } else if (tempoMarker) {
      map.current.flyTo({
        center: [tempoMarker.lng, tempoMarker.lat],
      });
    }
  }, [selectedMarker, tempoMarker]);

  for (const place of places) {
    if (place.lattitude && place.longitude) {
      const marker = new mapboxgl.Marker({
        color: selectedMarker === place ? "#7480ff" : "#2d2d2d",
      })
        .setLngLat([place.longitude, place.lattitude])
        .addTo(map.current);

      marker.getElement().addEventListener("click", () => {
        setSelectedMarker(place);
      });
    }
  }

  if (tempoMarker) {
    new mapboxgl.Marker({
      color: "#ff0000",
    })
      .setLngLat([tempoMarker.lng, tempoMarker.lat])
      .addTo(map.current);
  }

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [lng, lat],
      zoom: zoom,
    });
  });

  return (
    <div className="flex gap-3">
      <div
        ref={mapContainer}
        className={`map-container h-64 w-full  text-black rounded-2xl`}
      />
      <Popup place={selectedMarker} setSelectedMarker={setSelectedMarker} />
    </div>
  );
};
export default MapBox;
