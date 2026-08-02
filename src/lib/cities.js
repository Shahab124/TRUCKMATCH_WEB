// Origins/destinations are free text ("Lahore"), not coordinates, so the map
// needs a lookup. A dict covers the routes this app actually serves with no
// API key and no network call.
// ponytail: hardcoded gazetteer, swap for a geocoding API when users type
// arbitrary addresses rather than known cities.
const CITIES = {
  karachi: [24.8607, 67.0011],
  lahore: [31.5204, 74.3587],
  islamabad: [33.6844, 73.0479],
  rawalpindi: [33.5651, 73.0169],
  faisalabad: [31.4187, 73.0791],
  multan: [30.1575, 71.5249],
  peshawar: [34.0151, 71.5249],
  quetta: [30.1798, 66.9750],
  hyderabad: [25.396, 68.3578],
  sialkot: [32.4945, 74.5229],
  gujranwala: [32.1877, 74.1945],
  sukkur: [27.7052, 68.8574],
  bahawalpur: [29.3956, 71.6836],
  sargodha: [32.0836, 72.6711],
  abbottabad: [34.1688, 73.2215],
  gwadar: [25.1264, 62.3225],
  mardan: [34.1989, 72.0231],
  sahiwal: [30.6682, 73.1114],
  larkana: [27.5590, 68.2123],
  rahimyarkhan: [28.4202, 70.2952],
};

// Geographic centre-ish of Pakistan — the map's default view.
export const DEFAULT_CENTER = [30.3753, 69.3451];
export const DEFAULT_ZOOM = 5;

export function cityLatLng(name) {
  if (!name) return null;
  return CITIES[name.trim().toLowerCase().replace(/\s+/g, "")] ?? null;
}

// Straight-line point between two coords, t from 0 (a) to 1 (b).
export function interpolate(a, b, t) {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}
