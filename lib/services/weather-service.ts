type WeatherLookup = {
  postalCode: string;
  temperatureF: number | null;
  latitude: number;
  longitude: number;
  locationLabel: string | null;
};

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const DEFAULT_COUNTRY_CODE = process.env.SHIPPING_COUNTRY_CODE ?? "AU";

export function isWeatherConfigured() {
  return Boolean(OPENWEATHER_API_KEY);
}

type WeatherLookupInput = {
  postalCode: string;
  city?: string;
  state?: string;
  countryCode?: string;
};

async function fetchWeatherByCoordinates({
  latitude,
  longitude,
  postalCode,
  locationLabel
}: {
  latitude: number;
  longitude: number;
  postalCode: string;
  locationLabel: string | null;
}): Promise<WeatherLookup> {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=${OPENWEATHER_API_KEY}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(payload?.message ?? "Unable to look up weather for that location.");
  }

  const payload = (await response.json()) as {
    main?: { temp?: number };
    name?: string;
  };

  return {
    postalCode,
    temperatureF: typeof payload.main?.temp === "number" ? payload.main.temp : null,
    latitude,
    longitude,
    locationLabel: payload.name ?? locationLabel
  };
}

async function lookupCoordinatesByPostalCode(postalCode: string, countryCode: string) {
  const response = await fetch(
    `https://api.openweathermap.org/geo/1.0/zip?zip=${encodeURIComponent(postalCode)},${encodeURIComponent(countryCode)}&appid=${OPENWEATHER_API_KEY}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as {
    lat?: number;
    lon?: number;
    name?: string;
  };

  if (typeof payload.lat !== "number" || typeof payload.lon !== "number") {
    return null;
  }

  return {
    latitude: payload.lat,
    longitude: payload.lon,
    locationLabel: payload.name ?? null
  };
}

async function lookupCoordinatesByCity(input: WeatherLookupInput) {
  if (!input.city) {
    return null;
  }

  const countryCode = input.countryCode ?? DEFAULT_COUNTRY_CODE;
  const query = [input.city, input.state, countryCode].filter(Boolean).join(",");
  const response = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=1&appid=${OPENWEATHER_API_KEY}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as Array<{
    lat?: number;
    lon?: number;
    name?: string;
    state?: string;
    country?: string;
  }>;
  const location = payload[0];

  if (typeof location?.lat !== "number" || typeof location.lon !== "number") {
    return null;
  }

  return {
    latitude: location.lat,
    longitude: location.lon,
    locationLabel: [location.name, location.state, location.country].filter(Boolean).join(", ")
  };
}

export async function lookupWeather(input: WeatherLookupInput): Promise<WeatherLookup> {
  if (!OPENWEATHER_API_KEY) {
    throw new Error("Missing OPENWEATHER_API_KEY environment variable.");
  }

  const countryCode = input.countryCode ?? DEFAULT_COUNTRY_CODE;
  const coordinates =
    (await lookupCoordinatesByPostalCode(input.postalCode, countryCode)) ??
    (await lookupCoordinatesByCity(input));

  if (!coordinates) {
    throw new Error("Unable to find that delivery city or postal code.");
  }

  return fetchWeatherByCoordinates({
    ...coordinates,
    postalCode: input.postalCode
  });
}

export async function lookupWeatherByPostalCode(postalCode: string): Promise<WeatherLookup> {
  return lookupWeather({ postalCode });
}
