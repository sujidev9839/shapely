// src/utils/timezone.ts
export async function fetchTimezone(place: string) {
    const GEO_KEY  = import.meta.env.VITE_OPENCAGE_KEY!;
    const GEO_USER = import.meta.env.VITE_GEONAMES_USER!;
  
    if (!GEO_KEY || !GEO_USER) {
      throw new Error("API credentials missing");
    }
  
    /* ---------- 1) Forward‑geocode the place name ---------- */
    const geoUrl =
      `https://api.opencagedata.com/geocode/v1/json` +
      `?q=${encodeURIComponent(place)}` +
      `&key=${GEO_KEY}&limit=1`;
  
    const geoRes = await fetch(geoUrl);
    const geoJson: OpenCageResponse = await geoRes.json();
    if (!geoJson.results.length) {
      throw new Error(`No geocoding result for “${place}”`);
    }
  
    const { lat, lng } = geoJson.results[0].geometry;
  
    /* ---------- 2) Look up timezone from lat/lng ---------- */
    const tzUrl =
      `http://api.geonames.org/timezoneJSON` +
      `?lat=${lat}&lng=${lng}&username=${GEO_USER}`;
  
    const tzRes = await fetch(tzUrl);
    const tzJson: GeoNamesTZ = await tzRes.json();
  
    if (!tzJson.timezoneId) {
      throw new Error(`Timezone lookup failed for “${place}”`);
    }
    return tzJson;            // ← { timezoneId, gmtOffset, dstOffset, … }
  }
  
  /* ---------- minimal response typings ---------- */
  interface OpenCageResponse {
    results: { geometry: { lat: number; lng: number } }[];
  }
  interface GeoNamesTZ {
    timezoneId: string;       // e.g. "Asia/Kolkata"
    gmtOffset: number;        // e.g. 5.5
    dstOffset: number;
    countryName: string;
    sunrise: string;
    sunset: string;
  }
  