/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from "react";
import { MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    google: any;
  }
}

interface Props {
  value: string;
  onChange: (value: string, lat?: number, lng?: number) => void;
}

const TASHKENT_CENTER = { lat: 41.2995, lng: 69.2401 };

const GoogleMapPicker = ({ value, onChange }: Props) => {
  const [open, setOpen] = useState(false);
  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState(value);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);

  // Load Google Maps script
  useEffect(() => {
    if (window.google?.maps) {
      setMapsLoaded(true);
      return;
    }
    const existing = document.getElementById("google-maps-script");
    if (existing) return;

    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=&libraries=places&language=uz`;
    script.async = true;
    script.defer = true;
    script.onload = () => setMapsLoaded(true);
    document.head.appendChild(script);
  }, []);

  // Init map when dialog opens
  useEffect(() => {
    if (!open || !mapsLoaded || !mapRef.current) return;

    const center = marker || TASHKENT_CENTER;
    const map = new window.google.maps.Map(mapRef.current, {
      center,
      zoom: 12,
      disableDefaultUI: false,
      zoomControl: true,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
    });
    mapInstanceRef.current = map;

    if (marker) {
      markerRef.current = new window.google.maps.Marker({
        position: marker,
        map,
        draggable: true,
      });
      markerRef.current.addListener("dragend", () => {
        const pos = markerRef.current?.getPosition();
        if (pos) {
          const newPos = { lat: pos.lat(), lng: pos.lng() };
          setMarker(newPos);
          reverseGeocode(newPos);
        }
      });
    }

    map.addListener("click", (e: any) => {
      const latLng = e.latLng;
      if (!latLng) return;
      const pos = { lat: latLng.lat(), lng: latLng.lng() };
      setMarker(pos);

      if (markerRef.current) {
        markerRef.current.setPosition(pos);
      } else {
        markerRef.current = new window.google.maps.Marker({
          position: pos,
          map,
          draggable: true,
        });
        markerRef.current.addListener("dragend", () => {
          const p = markerRef.current?.getPosition();
          if (p) {
            const newPos = { lat: p.lat(), lng: p.lng() };
            setMarker(newPos);
            reverseGeocode(newPos);
          }
        });
      }

      reverseGeocode(pos);
    });

    return () => {
      markerRef.current = null;
      mapInstanceRef.current = null;
    };
  }, [open, mapsLoaded]);

  const reverseGeocode = (pos: { lat: number; lng: number }) => {
    if (!window.google?.maps) return;
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: pos }, (results, status) => {
      if (status === "OK" && results?.[0]) {
        setAddress(results[0].formatted_address);
      } else {
        setAddress(`${pos.lat.toFixed(6)}, ${pos.lng.toFixed(6)}`);
      }
    });
  };

  const handleConfirm = () => {
    onChange(address, marker?.lat, marker?.lng);
    setOpen(false);
  };

  return (
    <div className="space-y-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-xl border bg-card py-3 px-4 text-sm text-left transition-colors hover:border-primary/50 hover:bg-secondary/50"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground">Manzil</p>
              <p className="truncate font-medium text-foreground">
                {value || "Xaritadan tanlang..."}
              </p>
            </div>
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl p-0 overflow-hidden">
          <DialogHeader className="p-4 pb-2">
            <DialogTitle>Manzilni xaritadan tanlang</DialogTitle>
          </DialogHeader>
          <div ref={mapRef} className="h-[400px] w-full bg-muted" />
          {address && (
            <div className="px-4 py-2 text-sm text-muted-foreground border-t">
              📍 {address}
            </div>
          )}
          <div className="flex justify-end gap-2 p-4 pt-2">
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
              Bekor qilish
            </Button>
            <Button type="button" onClick={handleConfirm} disabled={!marker}>
              Tasdiqlash
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GoogleMapPicker;
