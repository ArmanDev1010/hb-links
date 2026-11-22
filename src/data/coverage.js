// Where we work, for the /contact page's map (Contact/Estimate/ContactMap):
// the cities it marks round Woodland Hills — [latitude, longitude], roughly
// their middles; `left` sets the name on the dot's left.

export const HOME_BASE = { name: "Woodland Hills", at: [34.1683, -118.6059] };

export const COVERAGE_CITIES = [
  ["Woodland Hills", 34.1683, -118.6059],
  ["Calabasas", 34.1578, -118.6384, true],
  ["West Hills", 34.1973, -118.644, true],
  ["Canoga Park", 34.2011, -118.598],
  ["Winnetka", 34.2133, -118.5711],
  ["Chatsworth", 34.2572, -118.6012],
  ["Porter Ranch", 34.2819, -118.5537],
  ["Northridge", 34.2283, -118.5367],
  ["Granada Hills", 34.2647, -118.5232],
  ["Reseda", 34.2011, -118.536],
  ["Tarzana", 34.173, -118.553],
  ["Encino", 34.1592, -118.5012],
  ["Lake Balboa", 34.1866, -118.4962],
  ["Van Nuys", 34.1899, -118.4514],
  ["North Hills", 34.236, -118.481],
  ["Mission Hills", 34.2572, -118.467],
  ["Sherman Oaks", 34.1511, -118.449],
  ["Studio City", 34.1396, -118.387],
  ["North Hollywood", 34.187, -118.3813],
  ["Agoura Hills", 34.1533, -118.7617, true],
  ["Oak Park", 34.1792, -118.7629, true],
  ["Westlake Village", 34.1458, -118.8059, true],
  ["Simi Valley", 34.2694, -118.7815, true],
  ["Topanga", 34.0936, -118.6017],
].map(([name, lat, lon, left]) => ({ name, at: [lat, lon], left }));

// the areas with pages of their own: all a phone's map has room for
export const PAGED_CITIES = ["Woodland Hills", "Calabasas", "Canoga Park", "Northridge", "Reseda", "Tarzana", "Encino", "Sherman Oaks"];

