"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import { OFFICE, OFFICE_ZOOM, TILE_URL_TEMPLATE } from "./office";

/* ────────────────────────────────────────────────────────────────────────────
   Office location map for /contact.

   Leaflet + OpenStreetMap rather than a Google iframe: no API key, no
   third-party cookies, and `leaflet` was already a dependency here (unused
   until now). Leaflet touches `window` at import time, so it is imported
   inside the effect rather than at module scope — a static import would break
   the server render of this page.
──────────────────────────────────────────────────────────────────────────── */

/* Kick the Leaflet chunk off the moment this module evaluates in the browser,
   rather than waiting for the effect to run after hydration — that wait was the
   single biggest slice of the map's time to first paint. Guarded because this
   module is evaluated during SSR too, where Leaflet touches an absent `window`. */
const leafletChunk = typeof window === "undefined" ? null : import("leaflet");

export function ContactMap({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    let map: import("leaflet").Map | undefined;
    let cancelled = false;

    (async () => {
      const L = (await (leafletChunk ?? import("leaflet"))).default;
      // StrictMode runs effects twice in dev; the cleanup below sets this
      // before the import resolves, so the second run owns the container.
      if (cancelled) return;

      map = L.map(node, {
        center: [OFFICE.lat, OFFICE.lng],
        zoom: OFFICE_ZOOM,
        // The contact page is deliberately one screen tall. A wheel that zooms
        // instead of scrolling would trap the reader inside the map.
        scrollWheelZoom: false,
        // Attribution control off at the site owner's instruction. Note the
        // OSM tiles are ODbL, which asks for a visible credit somewhere — see
        // the note in the PR/handover if this ever needs restoring.
        attributionControl: false,
      });

      L.tileLayer(TILE_URL_TEMPLATE, {
        maxZoom: 19,
      }).addTo(map);

      // A divIcon, not L.Icon: Leaflet's default marker resolves its PNGs by
      // relative URL, which the bundler rewrites and breaks. Own markup also
      // lets the pin carry the brand colour.
      /* Leaflet ships its zoom buttons at 30x30, under the 44px touch
         guidance. They are sized by leaflet.css, and a stylesheet override has
         to both out-specify that rule and win a load-order fight Next decides —
         a first attempt in globals.css lost it silently. Setting the size on
         the elements Leaflet just created is the one place that always wins. */
      node.querySelectorAll<HTMLElement>(".leaflet-control-zoom a").forEach((btn) => {
        btn.style.width = "2.75rem";
        btn.style.height = "2.75rem";
        btn.style.lineHeight = "2.75rem";
        btn.style.fontSize = "1.25rem";
      });

      L.marker([OFFICE.lat, OFFICE.lng], {
        title: "Rides — 3 KG 98 St, Kimironko",
        icon: L.divIcon({
          className: "",
          iconSize: [20, 20],
          iconAnchor: [10, 10],
          html: '<span class="block h-5 w-5 rounded-full border-[3px] border-white bg-primary-strong shadow-lg shadow-primary/40"></span>',
        }),
      }).addTo(map);
    })();

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label="Map showing the Rides office at 3 KG 98 St, Kimironko, Kigali"
      /* `isolate` keeps Leaflet's internal pane z-indexes (up to 700) from
         painting over the fixed navbar at z-50. */
      className={`isolate overflow-hidden rounded-2xl bg-surface-alt ring-1 ring-border ${className}`}
    />
  );
}
