import { useState, useEffect } from "react";
import { MapPin, Navigation, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

interface Props {
  value: string;
  onChange: (value: string, lat?: number, lng?: number) => void;
}

const TASHKENT_CENTER: [number, number] = [41.2995, 69.2401];

function LocationMarker({
  position,
  setPosition,
  setAddress,
}: {
  position: [number, number] | null;
  setPosition: (pos: [number, number]) => void;
  setAddress: (addr: string) => void;
}) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      reverseGeocode(lat, lng, setAddress);
    },
  });

  return position ? <Marker position={position} /> : null;
}

function FlyToLocation({ position }: { position: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 16, { duration: 1.2 });
    }
  }, [position, map]);
  return null;
}

async function reverseGeocode(lat: number, lng: number, setAddress: (addr: string) => void) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=uz`
    );
    const data = await res.json();
    if (data.display_name) {
      setAddress(data.display_name);
    } else {
      setAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    }
  } catch {
    setAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
  }
}

async function searchLocation(query: string): Promise<{ lat: number; lng: number; name: string } | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&accept-language=uz`
    );
    const data = await res.json();
    if (data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), name: data[0].display_name };
    }
  } catch {}
  return null;
}

const LeafletMapPicker = ({ value, onChange }: Props) => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [address, setAddress] = useState(value);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    const result = await searchLocation(searchQuery);
    if (result) {
      setPosition([result.lat, result.lng]);
      setAddress(result.name);
    }
    setSearching(false);
  };

  const handleMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setPosition(coords);
        reverseGeocode(coords[0], coords[1], setAddress);
      },
      () => {},
      { enableHighAccuracy: true }
    );
  };

  const handleConfirm = () => {
    onChange(address, position?.[0], position?.[1]);
    setOpen(false);
  };

  return (
    <div className="space-y-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            type="button"
            className="group flex w-full items-center gap-3 rounded-2xl border-2 border-dashed border-border bg-card py-4 px-5 text-sm text-left transition-all hover:border-primary/50 hover:bg-secondary/30 hover:shadow-lg hover:shadow-primary/5"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 transition-transform group-hover:scale-110">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Manzil</p>
              <p className="truncate font-semibold text-foreground mt-0.5">
                {value || "📍 Xaritadan tanlang..."}
              </p>
            </div>
            <div className="shrink-0 text-muted-foreground group-hover:text-primary transition-colors">
              <Search className="h-5 w-5" />
            </div>
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-2xl">
          <DialogHeader className="p-5 pb-3">
            <DialogTitle className="text-xl font-bold">📍 Manzilni xaritadan tanlang</DialogTitle>
          </DialogHeader>

          {/* Search bar */}
          <div className="px-5 pb-3 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Manzil qidirish... (masalan: Toshkent, Chilonzor)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10 rounded-xl"
              />
            </div>
            <Button type="button" variant="outline" size="icon" onClick={handleSearch} disabled={searching} className="rounded-xl shrink-0">
              <Search className="h-4 w-4" />
            </Button>
            <Button type="button" variant="outline" size="icon" onClick={handleMyLocation} className="rounded-xl shrink-0" title="Mening joylashuvim">
              <Navigation className="h-4 w-4" />
            </Button>
          </div>

          {/* Map */}
          <div className="h-[400px] w-full relative">
            {open && (
              <MapContainer
                center={position || TASHKENT_CENTER}
                zoom={12}
                style={{ height: "100%", width: "100%", zIndex: 0 }}
                zoomControl={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker position={position} setPosition={setPosition} setAddress={setAddress} />
                <FlyToLocation position={position} />
              </MapContainer>
            )}
          </div>

          {/* Address display */}
          {address && (
            <div className="mx-5 my-3 rounded-xl bg-secondary/50 px-4 py-3 text-sm text-foreground border">
              <span className="text-muted-foreground">📍 </span>
              <span className="font-medium">{address}</span>
            </div>
          )}

          <div className="flex justify-end gap-3 p-5 pt-2">
            <Button variant="outline" type="button" onClick={() => setOpen(false)} className="rounded-xl px-6">
              Bekor qilish
            </Button>
            <Button type="button" onClick={handleConfirm} disabled={!position} className="rounded-xl px-8 glow-sm">
              ✅ Tasdiqlash
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeafletMapPicker;
