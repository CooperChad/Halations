"use client";

import { useEffect, useRef } from "react";

export interface Pin {
  id: string;
  lat: number;
  lng: number;
  location: string;
  date: string;
}

interface Props {
  pins: Pin[];
  onMapClick?: (lat: number, lng: number) => void;
  interactive?: boolean;
}

export default function Map({ pins, onMapClick, interactive = false }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<unknown>(null);
  const markersRef = useRef<unknown[]>([]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    import("leaflet").then((L) => {
      // Warm vintage map style
      const map = L.map(containerRef.current!, {
        zoomControl: true,
        scrollWheelZoom: false,
        center: [40.2969, -111.6946], // Orem, Utah
        zoom: 7,
      });

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
          attribution: "© OpenStreetMap contributors © CARTO",
          subdomains: "abcd",
          maxZoom: 19,
        }
      ).addTo(map);

      // Shift map toward sage green palette
      const tilePane = map.getPanes().tilePane as HTMLElement;
      if (tilePane) tilePane.style.filter = "hue-rotate(45deg) saturate(0.85) brightness(0.93)";

      mapRef.current = map;

      if (interactive && onMapClick) {
        map.on("click", (e: { latlng: { lat: number; lng: number } }) => {
          onMapClick(e.latlng.lat, e.latlng.lng);
        });
      }

      // Custom pushpin icon
      function makePinIcon(L: typeof import("leaflet")) {
        return L.divIcon({
          className: "",
          html: `<div style="
            width: 28px; height: 28px;
            display: flex; align-items: center; justify-content: center;
            filter: drop-shadow(0 2px 3px rgba(80,50,20,0.35));
          ">
            <svg width="24" height="32" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="12" cy="11" rx="9" ry="9" fill="#6b7a5e"/>
              <ellipse cx="12" cy="10" rx="6" ry="6" fill="#8a9a7c"/>
              <ellipse cx="10" cy="8" rx="2" ry="2" fill="rgba(255,255,255,0.35)"/>
              <path d="M12 18 L9 30 L12 26 L15 30 Z" fill="#6b7a5e"/>
            </svg>
          </div>`,
          iconSize: [28, 36],
          iconAnchor: [14, 34],
          popupAnchor: [0, -34],
        });
      }

      // Render initial pins
      pins.forEach((pin) => {
        const marker = L.marker([pin.lat, pin.lng], { icon: makePinIcon(L) })
          .addTo(map)
          .bindTooltip(
            `<div style="font-family: 'Playfair Display', serif; color: #3a3530; padding: 4px 2px;">
              <div style="font-size: 0.95rem; font-weight: 500;">${pin.location}</div>
              <div style="font-size: 0.78rem; color: #7a7268; margin-top: 2px;">${pin.date}</div>
            </div>`,
            { direction: "top", offset: [0, -8], className: "halation-tooltip" }
          );
        markersRef.current.push(marker);
      });

      // Store makePinIcon for later use
      (mapRef.current as { _makePinIcon?: unknown })._makePinIcon = makePinIcon;
    });

    return () => {
      if (mapRef.current) {
        (mapRef.current as { remove: () => void }).remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update markers when pins change
  useEffect(() => {
    if (!mapRef.current) return;
    import("leaflet").then((L) => {
      const map = mapRef.current as { addLayer: (l: unknown) => void };
      markersRef.current.forEach((m) => (m as { remove: () => void }).remove());
      markersRef.current = [];

      function makePinIcon() {
        return L.divIcon({
          className: "",
          html: `<div style="
            width: 28px; height: 28px;
            display: flex; align-items: center; justify-content: center;
            filter: drop-shadow(0 2px 3px rgba(80,50,20,0.35));
          ">
            <svg width="24" height="32" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="12" cy="11" rx="9" ry="9" fill="#6b7a5e"/>
              <ellipse cx="12" cy="10" rx="6" ry="6" fill="#8a9a7c"/>
              <ellipse cx="10" cy="8" rx="2" ry="2" fill="rgba(255,255,255,0.35)"/>
              <path d="M12 18 L9 30 L12 26 L15 30 Z" fill="#6b7a5e"/>
            </svg>
          </div>`,
          iconSize: [28, 36],
          iconAnchor: [14, 34],
          popupAnchor: [0, -34],
        });
      }

      pins.forEach((pin) => {
        const marker = L.marker([pin.lat, pin.lng], { icon: makePinIcon() })
          .addTo(map as Parameters<typeof L.marker>[1] extends infer T ? T : never)
          .bindTooltip(
            `<div style="font-family: 'Playfair Display', serif; color: #3a3530; padding: 4px 2px;">
              <div style="font-size: 0.95rem; font-weight: 500;">${pin.location}</div>
              <div style="font-size: 0.78rem; color: #7a7268; margin-top: 2px;">${pin.date}</div>
            </div>`,
            { direction: "top", offset: [0, -8], className: "halation-tooltip" }
          );
        markersRef.current.push(marker);
      });
    });
  }, [pins]);

  return (
    <>
      <style>{`
        .halation-tooltip {
          background: #f0ebe2 !important;
          border: 1px solid #c8c0b0 !important;
          border-radius: 3px !important;
          box-shadow: 0 2px 8px rgba(80,50,20,0.15) !important;
          padding: 8px 12px !important;
        }
        .halation-tooltip::before {
          border-top-color: #c8c0b0 !important;
        }
        .leaflet-control-zoom {
          border: 1px solid #c8c0b0 !important;
          border-radius: 3px !important;
        }
        .leaflet-control-zoom a {
          background: #f0ebe2 !important;
          color: #6b7a5e !important;
          border-bottom: 1px solid #c8c0b0 !important;
        }
      `}</style>
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
    </>
  );
}
