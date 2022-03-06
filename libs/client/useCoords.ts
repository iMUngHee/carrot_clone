import { useEffect, useState } from "react";

interface UseCoordsState {
  longitude: number | null;
  latitude: number | null;
}

export default function useCoords() {
  const [coords, setCoords] = useState<UseCoordsState>({
    longitude: null,
    latitude: null,
  });
  const onSuccess = (currentPos: GeolocationPosition) => {
    const {
      coords: { longitude, latitude },
    } = currentPos;
    setCoords({ longitude, latitude });
  };
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(onSuccess);
  }, []);

  return coords;
}
