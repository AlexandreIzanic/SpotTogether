import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import ReactDOMServer from "react-dom/server";
import Popup from "./Popup";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWxleGFuZHJlLWl6YyIsImEiOiJjbHVrM2Fod2swamxjMmtsbXh4Y3dxYmEyIn0.FTKlr6wwlsAeXnurfl027A";
const MapBox = ({ places, selectedMarker, setSelectedMarker, tempoMarker }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(2.333333);
  const [lat, setLat] = useState(48.866667);
  const [zoom, setZoom] = useState(11);

  /*   const Popup = ({ place }) => {
    return (
      <div className="p-2 ">
        <h1>{place.title}</h1>
        <a href={place.instagram_url}>Insta</a>
      </div>
    );
  }; */
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
        /*  .setPopup(
          new mapboxgl.Popup().setHTML(
            ReactDOMServer.renderToString({
              <Popup place={place} />
            })
          )
        ) */
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
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    function success(pos) {
      var crd = pos.coords;

      console.log("Votre position actuelle est :");
      console.log(`Latitude : ${crd.latitude}`);
      console.log(`Longitude : ${crd.longitude}`);
      console.log(`La précision est de ${crd.accuracy} mètres.`);
    }

    function error(err) {
      console.log(`ERREUR (${err.code}): ${err.message}`);
    }
    navigator.geolocation.getCurrentPosition(success, error, options);

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
