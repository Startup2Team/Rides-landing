/* Office coordinates, in a plain module on purpose.

   These used to live in contact-map.tsx, but that file is "use client": when a
   Server Component imports from a client module, Next swaps every export for a
   client-reference proxy. `OFFICE_MAPS_URL` arrived in page.tsx as an object
   rather than a string, and the page 500'd on `href.startsWith`. Constants
   shared across the boundary have to sit outside the client module. */

/** 3 KG 98 St, Kimironko, Kigali. */
export const OFFICE = { lat: -1.933264, lng: 30.1309399 } as const;

export const OFFICE_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${OFFICE.lat},${OFFICE.lng}`;

export const OFFICE_ZOOM = 16;

export const TILE_URL_TEMPLATE = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

export const TILE_ORIGIN = "https://tile.openstreetmap.org";

/** OSM slippy-tile coordinates for a lat/lng at a zoom level. */
function tileCoords(lat: number, lng: number, z: number) {
  const n = 2 ** z;
  const latRad = (lat * Math.PI) / 180;
  return {
    z,
    x: Math.floor(((lng + 180) / 360) * n),
    y: Math.floor(((1 - Math.asinh(Math.tan(latRad)) / Math.PI) / 2) * n),
  };
}

/* The one tile the pin sits on. Preloading it in the page's initial HTML means
   it is already in the browser cache by the time Leaflet's JS finishes loading
   and asks for it, so the middle of the map paints immediately rather than
   after a round trip. */
const CENTRE = tileCoords(OFFICE.lat, OFFICE.lng, OFFICE_ZOOM);
export const OFFICE_CENTRE_TILE_URL =
  `${TILE_ORIGIN}/${CENTRE.z}/${CENTRE.x}/${CENTRE.y}.png`;
