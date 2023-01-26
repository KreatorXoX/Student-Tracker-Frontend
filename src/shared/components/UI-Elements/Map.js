import React, { useState } from "react";
import ReactMap, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import styles from "./Map.module.css";

const Map = (props) => {
  const { center, zoom } = props;
  const [viewState, setViewState] = useState({
    latitude: center.lat,
    longitude: center.lng,
    zoom: zoom,
  });
  return (
    <div className={styles.map}>
      <ReactMap
        mapStyle={"mapbox://styles/gorkem-dev/cldbri91l001z01lxomjg11h1"}
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_KEY}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        width={"100%"}
        height={"100%"}
      >
        <Marker latitude={center.lat} longitude={center.lng}>
          <FontAwesomeIcon color="purple" size="2xl" icon={faUser} />
        </Marker>
      </ReactMap>
    </div>
  );
};

export default Map;
