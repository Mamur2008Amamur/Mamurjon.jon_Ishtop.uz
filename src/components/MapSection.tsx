import { useState, useEffect, useRef } from "react";
import { MapPin, Navigation, Star, CheckCircle, Phone, X, Search, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

declare global {
  interface Window { google: any; initGoogleMap: () => void; }
}

const API_KEY = "AIzaSyDiCGCaFxkNQOyQtZwee-BzquS_vqr_ZMw";

const specialists = [
  { id:1,  name:"Abdulloh Toshmatov", role:"Santexnik",    rating:5.0, reviews:312, region:"Toshkent",   district:"Chilonzor",    price:"80 000", avatar:"AT", verified:true,  lat:41.2856, lng:69.2012, phone:"+998901234567", color:"#4F46E5" },
  { id:2,  name:"Sherzod Mirzayev",   role:"Elektrik",      rating:4.9, reviews:241, region:"Samarqand",  district:"Samarqand sh.", price:"70 000", avatar:"SM", verified:true,  lat:39.6542, lng:66.9597, phone:"+998937654321", color:"#0EA5E9" },
  { id:3,  name:"Nilufar Xolmatova",  role:"Tozalovchi",    rating:5.0, reviews:487, region:"Toshkent",   district:"Yunusobod",    price:"50 000", avatar:"NX", verified:true,  lat:41.3215, lng:69.2876, phone:"+998941112233", color:"#10B981" },
  { id:4,  name:"Jasurbek Rahimov",   role:"IT mutaxassis", rating:4.9, reviews:156, region:"Namangan",   district:"Namangan sh.", price:"120 000",avatar:"JR", verified:true,  lat:40.9983, lng:71.6726, phone:"+998905556677", color:"#8B5CF6" },
  { id:5,  name:"Murod Hamidov",      role:"Ta'mirchi",     rating:4.8, reviews:398, region:"Andijon",    district:"Andijon sh.",  price:"65 000", avatar:"MH", verified:true,  lat:40.7821, lng:72.3442, phone:"+998912223344", color:"#F59E0B" },
  { id:6,  name:"Zulfiya Nazarova",   role:"O'qituvchi",    rating:5.0, reviews:203, region:"Buxoro",     district:"Buxoro sh.",   price:"60 000", avatar:"ZN", verified:true,  lat:39.7747, lng:64.4286, phone:"+998933334455", color:"#EC4899" },
  { id:7,  name:"Bobur Xasanov",      role:"Avtomaster",    rating:4.7, reviews:189, region:"Qashqadaryo",district:"Qarshi sh.",   price:"75 000", avatar:"BX", verified:true,  lat:38.8604, lng:65.7891, phone:"+998918887766", color:"#EF4444" },
  { id:8,  name:"Kamola Yusupova",    role:"Fotograf",      rating:4.9, reviews:94,  region:"Farg'ona",   district:"Farg'ona sh.", price:"90 000", avatar:"KY", verified:true,  lat:40.3864, lng:71.7864, phone:"+998997776655", color:"#F97316" },
  { id:9,  name:"Sanjar Tursunov",    role:"Konditsioner",  rating:4.8, reviews:143, region:"Xorazm",     district:"Urganch sh.",  price:"65 000", avatar:"ST", verified:false, lat:41.5503, lng:60.6339, phone:"+998901112233", color:"#06B6D4" },
  { id:10, name:"Dilnoza Karimova",   role:"Go'zallik",     rating:5.0, reviews:267, region:"Jizzax",     district:"Jizzax sh.",   price:"55 000", avatar:"DK", verified:true,  lat:40.1158, lng:67.8422, phone:"+998935557788", color:"#D946EF" },
];

const MapSection = () => {
  const mapRef  = useRef<HTMLDivElement>(null);
  const mapInst = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [selected, setSelected] = useState<typeof specialists[0] | null>(null);
  const [search,   setSearch]   = useState("");
  const [loaded,   setLoaded]   = useState(false);
  const [error,    setError]    = useState(false);

  const filtered = specialists.filter(s =>
    [s.name, s.role, s.region, s.district].some(v =>
      v.toLowerCase().includes(search.toLowerCase())
    )
  );

  const pick = (s: typeof specialists[0]) => {
    setSelected(p => p?.id === s.id ? null : s);
    if (mapInst.current) {
      mapInst.current.panTo({ lat: s.lat, lng: s.lng });
      mapInst.current.setZoom(13);
    }
  };

  const buildMap = () => {
    if (!mapRef.current || !window.google?.maps) return;
    try {
      const isDark = document.documentElement.classList.contains("dark");
      const styles = isDark ? [
        { elementType: "geometry",            stylers: [{ color: "#1a1b2e" }] },
        { elementType: "labels.text.fill",    stylers: [{ color: "#8892b0" }] },
        { elementType: "labels.text.stroke",  stylers: [{ color: "#1a1b2e" }] },
        { featureType: "road",       elementType: "geometry",        stylers: [{ color: "#2a2b40" }] },
        { featureType: "road.highway", elementType: "geometry",      stylers: [{ color: "#3a3b55" }] },
        { featureType: "water",      elementType: "geometry",        stylers: [{ color: "#0d1117" }] },
        { featureType: "landscape",  elementType: "geometry",        stylers: [{ color: "#161722" }] },
        { featureType: "poi",        elementType: "labels",          stylers: [{ visibility: "off" }] },
        { featureType: "transit",                                      stylers: [{ visibility: "off" }] },
        { elementType: "labels.icon",                                  stylers: [{ visibility: "off" }] },
      ] : [
        { featureType: "poi",      elementType: "labels", stylers: [{ visibility: "off" }] },
        { featureType: "transit",                          stylers: [{ visibility: "off" }] },
        { featureType: "road",     elementType: "geometry", stylers: [{ color: "#f0f0f5" }] },
        { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#d8d8e8" }] },
        { featureType: "water",    elementType: "geometry", stylers: [{ color: "#b3d9f2" }] },
        { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#f5f5fa" }] },
        { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
      ];

      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 41.2, lng: 63.5 },
        zoom: 6,
        styles,
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        keyboardShortcuts: false,
      });
      mapInst.current = map;

      /* --- Custom SVG pin markers --- */
      specialists.forEach(s => {
        const svgPin = `
          <svg width="42" height="52" viewBox="0 0 42 52" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="shadow${s.id}" x="-30%" y="-20%" width="160%" height="160%">
                <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="rgba(0,0,0,0.35)"/>
              </filter>
            </defs>
            <path d="M21 0C9.4 0 0 9.4 0 21c0 14.7 21 31 21 31S42 35.7 42 21C42 9.4 32.6 0 21 0z"
              fill="${s.color}" filter="url(#shadow${s.id})"/>
            <circle cx="21" cy="21" r="13" fill="white" opacity="0.95"/>
            <text x="21" y="26" text-anchor="middle" font-size="11" font-weight="700"
              font-family="system-ui,sans-serif" fill="${s.color}">${s.avatar}</text>
          </svg>
        `;
        const icon = {
          url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svgPin),
          scaledSize: new window.google.maps.Size(42, 52),
          anchor: new window.google.maps.Point(21, 52),
        };

        const marker = new window.google.maps.Marker({
          position: { lat: s.lat, lng: s.lng },
          map,
          icon,
          title: s.name,
          optimized: false,
        });

        marker.addListener("click", () => {
          setSelected(p => p?.id === s.id ? null : s);
          map.panTo({ lat: s.lat, lng: s.lng });
          map.setZoom(13);
        });

        markersRef.current.push(marker);
      });

      setLoaded(true);
    } catch (e) {
      console.error(e);
      setError(true);
    }
  };

  useEffect(() => {
    if (window.google?.maps?.Marker) { buildMap(); return; }
    const existing = document.getElementById("gmap-script");
    if (existing) { existing.addEventListener("load", buildMap); return; }

    window.initGoogleMap = buildMap;
    const sc = document.createElement("script");
    sc.id    = "gmap-script";
    sc.src   = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&callback=initGoogleMap&language=uz`;
    sc.async = true;
    sc.defer = true;
    sc.onerror = () => setError(true);
    document.head.appendChild(sc);
    return () => { delete window.initGoogleMap; };
  }, []);

  return (
    <section id="xarita" className="py-20 md:py-28 bg-secondary/20">
      <div className="container mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <span className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">🗺️ Xarita</span>
          <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            Yaqin atrofdagi <span className="text-gradient">mutaxassislar</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            O'zbekiston bo'ylab — Toshkent, Samarqand, Farg'ona, Buxoro va boshqa viloyatlarda
          </p>
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-3">
          {/* List */}
          <div className="flex flex-col gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Ism, kasb, viloyat..."
                className="w-full rounded-xl border bg-background pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 ring-primary/30 transition" />
            </div>
            <div className="max-h-[455px] space-y-2 overflow-y-auto pr-0.5">
              {filtered.map(s => (
                <motion.button key={s.id} whileHover={{ x: 3 }} onClick={() => pick(s)}
                  className={`w-full flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${selected?.id === s.id ? "border-primary bg-primary/5 shadow-md" : "bg-card hover:border-primary/40 hover:shadow-sm"}`}>
                  {/* Custom pin color dot */}
                  <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-md border-2 border-white/30"
                    style={{ background: s.color }}>
                    {s.avatar}
                    {s.verified && (
                      <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                        <CheckCircle className="h-2.5 w-2.5 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm truncate">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.role}</p>
                    <p className="text-xs text-primary font-medium mt-0.5">📍 {s.region}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-0.5 justify-end">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-bold">{s.rating}</span>
                    </div>
                    <p className="text-xs text-primary font-bold mt-0.5">{s.price} so'm</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-2 relative h-[510px] overflow-hidden rounded-2xl border shadow-2xl">
            <div ref={mapRef} className="h-full w-full" />

            {!loaded && !error && (
              <div className="absolute inset-0 flex items-center justify-center bg-secondary/70 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-3 text-center">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  <p className="text-sm font-semibold text-foreground">Google Maps yuklanmoqda...</p>
                  <p className="text-xs text-muted-foreground">Internet aloqasini tekshiring</p>
                </div>
              </div>
            )}

            {error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-secondary/70 gap-4">
                <MapPin className="h-12 w-12 text-muted-foreground" />
                <p className="font-semibold text-foreground">Xarita yuklanmadi</p>
                <button onClick={() => { setError(false); buildMap(); }}
                  className="rounded-xl border bg-card px-5 py-2 text-sm font-semibold hover:bg-secondary transition">
                  🔄 Qayta urinish
                </button>
              </div>
            )}

            {/* Selected popup */}
            <AnimatePresence>
              {selected && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}
                  className="absolute bottom-4 left-4 right-4 rounded-2xl border bg-card/96 backdrop-blur-lg p-4 shadow-2xl">
                  <button onClick={() => setSelected(null)}
                    className="absolute right-3 top-3 rounded-lg p-1.5 text-muted-foreground hover:bg-secondary transition">
                    <X className="h-4 w-4" />
                  </button>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-lg border-2 border-white/20"
                      style={{ background: selected.color }}>
                      {selected.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="font-bold text-foreground">{selected.name}</p>
                        {selected.verified && <CheckCircle className="h-4 w-4 text-primary shrink-0" />}
                      </div>
                      <p className="text-sm text-muted-foreground">{selected.role}</p>
                      <p className="text-xs text-primary font-medium">📍 {selected.region} — {selected.district}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1 justify-end">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="font-bold">{selected.rating}</span>
                        <span className="text-xs text-muted-foreground">({selected.reviews})</span>
                      </div>
                      <p className="text-sm font-bold text-primary mt-0.5">{selected.price} so'm/soat</p>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <Button size="sm" className="rounded-xl gap-1.5 h-9"
                      onClick={() => window.open(`tel:${selected.phone}`)}>
                      <Phone className="h-3.5 w-3.5" /> Qo'ng'iroq
                    </Button>
                    <Button size="sm" variant="outline" className="rounded-xl gap-1.5 h-9"
                      onClick={() => window.open("https://t.me/ishtop_uz")}>
                      <Navigation className="h-3.5 w-3.5" /> Buyurtma
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Top badge */}
            <div className="absolute top-3 left-3 flex items-center gap-2 rounded-xl bg-card/95 backdrop-blur px-3 py-2 border shadow-lg text-xs font-semibold text-foreground">
              <Navigation className="h-3.5 w-3.5 text-primary" />
              O'zbekiston — {specialists.length} viloyat
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;
